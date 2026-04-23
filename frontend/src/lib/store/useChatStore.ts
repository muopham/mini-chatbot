import { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chat } from "../chat";
import { useAuthStore } from "./useAuthStore";
import { Conversation, Message } from "@/types/chat";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      converLoading: false,
      messageLoading: false,
 typingUsers: {},

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          converLoading: false,
          messageLoading: false,
        });
      },
      fetchConversation: async () => {
        try {
          set({ converLoading: true });
          const { conversations } = await chat.fetchConversation();

          set({ conversations, converLoading: false });
        } catch (error) {
          console.log(error);
          set({ converLoading: false });
        }
      },

      fetchMessages: async (conversationsId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();
        const converId = conversationsId ?? activeConversationId;

        if (!converId) return;

        const current = messages?.[converId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;
        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await chat.fetchMessages(
            converId,
            nextCursor
          );
          const processed = fetched.map((m: Message) => ({
            ...m,
            isOwn: m.senderId === user?.id,
          }));
          set((state) => {
            const prev = state.messages[converId]?.items ?? [];
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [converId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
 didFetch: true,
                },
              },
            };
          });
        } catch (error) {
          console.log(error);
        } finally {
          set({ messageLoading: false });
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          const { user } = useAuthStore.getState();

          const message = await chat.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined
          );

          // Add message to store immediately — don't wait for socket
          if (message && activeConversationId) {
            set((state) => {
              const current = state.messages[activeConversationId];
              if (!current) return state;
              if (current.items.some((m) => m._id === message._id)) return state;
              return {
                messages: {
                  ...state.messages,
                  [activeConversationId]: {
                    ...current,
                    items: [...current.items, { ...message, isOwn: true }],
                  },
                },
                conversations: state.conversations.map((c) =>
                  c._id === activeConversationId ? { ...c, seenBy: [] } : c
                ),
              };
            });
          }
        } catch (error) {
          console.error(
            "An error occurred while sending a direct message",
            error
          );
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const message = await chat.sendGroupMessage(conversationId, content, imgUrl);

          if (message) {
            set((state) => {
              const current = state.messages[conversationId];
              if (!current) return state;
              if (current.items.some((m) => m._id === message._id)) return state;
              return {
                messages: {
                  ...state.messages,
                  [conversationId]: {
                    ...current,
                    items: [...current.items, { ...message, isOwn: true }],
                  },
                },
                conversations: state.conversations.map((c) =>
                  c._id === conversationId ? { ...c, seenBy: [] } : c
                ),
              };
            });
          }
        } catch (error) {
          console.error(
            "An error occurred while sending a group message",
            error
          );
        }
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          message.isOwn = message.senderId === user?.id;
          const conversationId = message.conversationId;

          // If no cache at all, fetch first
          const existing = get().messages[conversationId];
          if (!existing?.didFetch && !existing?.items?.length) {
            await get().fetchMessages(conversationId);
          }

          // Use set(state => ...) to always read current state — avoids stale closure
          set((state) => {
            const currentItems = state.messages[conversationId]?.items ?? [];
            if (currentItems.some((m) => m._id === message._id)) return state;

            return {
              messages: {
                ...state.messages,
                [conversationId]: {
                  ...state.messages[conversationId],
                  items: [...currentItems, message],
                  hasMore: state.messages[conversationId]?.hasMore ?? false,
                  nextCursor: state.messages[conversationId]?.nextCursor ?? undefined,
                  didFetch: true,
                },
              },
            };
          });
        } catch (error) {
          console.log(error);
        }
      },

      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c
          ),
        }));
      },

      setTyping: (conversationId: string, userId: string, username: string) => {
 set((state) => {
 const prev = state.typingUsers[conversationId] ?? [];
 const filtered = prev.filter((u) => u.userId !== userId);
 return {
 typingUsers: {
 ...state.typingUsers,
 [conversationId]: [...filtered, { userId, username }],
 },
 };
 });
 },

 clearTyping: (conversationId: string, userId: string) => {
 set((state) => {
 const prev = state.typingUsers[conversationId] ?? [];
 return {
 typingUsers: {
 ...state.typingUsers,
 [conversationId]: prev.filter((u) => u.userId !== userId),
 },
 };
 });
 },

 markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) return;

          const conver = conversations.find(
            (c) => c._id === activeConversationId
          );

          if (!conver) return;
          if (conver.unreadCounts?.[user.id ?? 0] === 0) return;

          await chat.markAsSeen(activeConversationId);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user.id]: 0,
                    },
                  }
                : c
            ),
          }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        // Only persist activeConversationId to remember selected chat
        activeConversationId: state.activeConversationId,
        // Do NOT persist conversations or messages — always fetch fresh
      }),
    }
  )
);
