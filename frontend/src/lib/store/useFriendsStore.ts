import { create } from "zustand";
import { friends, FriendRequest, Friend, FriendUser } from "../friends";
import { useChatStore } from "./useChatStore";

interface FriendsState {
 searchResults: FriendUser[];
 friendRequests: FriendRequest[];
 allFriends: Friend[];
 sentRequests: string[]; // user IDs we sent request to
 searchLoading: boolean;
 requestsLoading: boolean;
 searchUsers: (query: string) => Promise<void>;
 clearSearch: () => void;
 fetchRequests: () => Promise<void>;
 sendRequest: (to: string, message?: string) => Promise<void>;
 acceptRequest: (requestId: string) => Promise<void>;
 declineRequest: (requestId: string) => Promise<void>;
  fetchAllFriends: () => Promise<void>;
 fetchSentRequests: () => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set) => ({
 searchResults: [],
 friendRequests: [],
 allFriends: [],
 sentRequests: [],
 searchLoading: false,
 requestsLoading: false,

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

 fetchRequests: async () => {
 set({ requestsLoading: true });
 try {
 const requests = await friends.getFriendRequests();
 set({ friendRequests: requests, requestsLoading: false });
 } catch {
 set({ requestsLoading: false });
 }
 },

 sendRequest: async (to: string, message?: string) => {
 await friends.sendFriendRequest(to, message);
 },

 acceptRequest: async (requestId: string) => {
 await friends.acceptFriendRequest(requestId);
 set((state) => ({
 friendRequests: state.friendRequests.filter((r) => r._id !== requestId),
 }));
 await useChatStore.getState().fetchConversation();
 },

 declineRequest: async (requestId: string) => {
 await friends.declineFriendRequest(requestId);
 set((state) => ({
 friendRequests: state.friendRequests.filter((r) => r._id !== requestId),
 }));
  },

 fetchSentRequests: async () => {
 try {
 const reqs = await friends.getSentRequests();
 set({ sentRequests: reqs.map(r => r.to._id) });
 } catch {}
 },

 fetchAllFriends: async () => {
 try {
 const allFriends = await friends.getAllFriends();
 set({ allFriends });
 } catch {
 // silent fail
 }
 },
}));
