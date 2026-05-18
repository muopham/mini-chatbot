import { create } from "zustand";
import { friends, FriendRequest, Friend, FriendUser } from "../friends";
import { useChatStore } from "./useChatStore";

const FRIEND_REQUESTS_TTL_MS = 30_000;
let friendRequestsFetchedAt = 0;
let friendRequestsFetchPromise: Promise<void> | null = null;

export interface FriendsState {
  searchResults: FriendUser[];
  friendRequests: FriendRequest[];
  allFriends: Friend[];
  sentRequests: string[];
  searchLoading: boolean;
  requestsLoading: boolean;
  requestsInitialized: boolean;
  searchUsers: (query: string) => Promise<void>;
  clearSearch: () => void;
  fetchRequests: (options?: { force?: boolean }) => Promise<void>;
  sendRequest: (to: string, message?: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  fetchAllFriends: () => Promise<void>;
  fetchSentRequests: () => Promise<void>;
  reset: () => void;
}

export const useFriendsStore = create<FriendsState>((set) => ({
  searchResults: [],
  friendRequests: [],
  allFriends: [],
  sentRequests: [],
  searchLoading: false,
  requestsLoading: false,
  requestsInitialized: false,

  searchUsers: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ searchLoading: true });
    try {
      const results = await friends.searchUsers(query);
      set({ searchResults: results, searchLoading: false });
    } catch {
      set({ searchResults: [], searchLoading: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),

  fetchRequests: async (options) => {
    const isFresh =
      Date.now() - friendRequestsFetchedAt < FRIEND_REQUESTS_TTL_MS;
    if (!options?.force && isFresh) return;
    if (friendRequestsFetchPromise) return friendRequestsFetchPromise;

    const fetchPromise = (async () => {
      set({ requestsLoading: true });
      try {
        const requests = await friends.getFriendRequests();
        friendRequestsFetchedAt = Date.now();
        set({
          friendRequests: requests,
          requestsLoading: false,
          requestsInitialized: true,
        });
      } catch {
        set({ requestsLoading: false, requestsInitialized: true });
      } finally {
        friendRequestsFetchPromise = null;
      }
    })();

    friendRequestsFetchPromise = fetchPromise;
    return fetchPromise;
  },

  acceptRequest: async (requestId: string) => {
    await friends.acceptFriendRequest(requestId);
    set((state) => ({
      friendRequests: state.friendRequests.filter((r) => r._id !== requestId),
    }));
    friendRequestsFetchedAt = Date.now();
    await useChatStore.getState().fetchConversation();
    await useFriendsStore.getState().fetchAllFriends();
  },

  declineRequest: async (requestId: string) => {
    await friends.declineFriendRequest(requestId);
    set((state) => ({
      friendRequests: state.friendRequests.filter((r) => r._id !== requestId),
    }));
    friendRequestsFetchedAt = Date.now();
  },

  fetchSentRequests: async () => {
    try {
      const reqs = await friends.getSentRequests();
      set({
        sentRequests: reqs.map((r) =>
          typeof r.to === "string" ? r.to : r.to._id
        ),
      });
    } catch {}
  },

  fetchAllFriends: async () => {
    try {
      const allFriends = await friends.getAllFriends();
      set({ allFriends });
    } catch {}
  },

  sendRequest: async (to: string, message?: string) => {
    try {
      await friends.sendFriendRequest(to, message);
      useFriendsStore.setState((s) => ({
        sentRequests: [...s.sentRequests, to],
      }));
    } catch (err: unknown) {
      const isConflict =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { status?: number } }).response?.status === 409;
      if (isConflict) {
        await useFriendsStore.getState().fetchAllFriends();
        await useFriendsStore.getState().fetchSentRequests();
      }
      throw err;
    }
  },

  reset: () => {
    friendRequestsFetchedAt = 0;
    friendRequestsFetchPromise = null;
    set({
      searchResults: [],
      friendRequests: [],
      allFriends: [],
      sentRequests: [],
      searchLoading: false,
      requestsLoading: false,
      requestsInitialized: false,
    });
  },
}));
