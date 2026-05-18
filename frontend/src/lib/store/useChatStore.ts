import { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chat } from "../chat";
import { useAuthStore } from "./useAuthStore";
import { Conversation, Message } from "@/types/chat";

const messageFetches = new Map<string, Promise<void>>();

const createLocalMessage = ({
  content,
  conversationId,
  imgUrl,
  senderId,
}: {
  content: string;
  conversationId: string;
  imgUrl?: string;
  senderId: string;
}): Message => {
  const localId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  return {
    _id: `local-${localId}`,
    localId,
    conversationId,
    senderId,
    content,
    imgUrl,
    createdAt: new Date().toISOString(),
    isOwn: true,
    status: "sending",
  };
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      converLoading: false,
      messageLoading: false,
      typingUsers: {},
      drafts: {},

      setActiveConversation: (id) => set({ activeConversationId: id }),
      setDraft: (conversationId, content) => {
        set((state) => ({
          drafts: {
            ...state.drafts,
            [conversationId]: content,
          },
        }));
      },
      clearDraft: (conversationId) => {
        set((state) => {
          const { [conversationId]: _removed, ...drafts } = state.drafts;
          return { drafts };
        });
      },
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          converLoading: false,
          messageLoading: false,
          drafts: {},
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
        const pendingFetch = messageFetches.get(converId);
        if (pendingFetch) return pendingFetch;

        const current = messages?.[converId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;
        set({ messageLoading: true });

        const fetchPromise = (async () => {
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
            messageFetches.delete(converId);
            set({ messageLoading: false });
          }
        })();

        messageFetches.set(converId, fetchPromise);
        return fetchPromise;
      },

      createDirectConversation: async (memberId) => {
        try {
          const conversation = await chat.createDirectConversation(memberId);
          get().updateConversation(conversation);
          set({ activeConversationId: conversation._id });
          return conversation;
        } catch (error) {
          console.log(error);
          return null;
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        const { activeConversationId } = get();
        const { user } = useAuthStore.getState();
        if (!activeConversationId || !user) return;

        const localMessage = createLocalMessage({
          content,
          conversationId: activeConversationId,
          imgUrl,
          senderId: user.id,
        });

        set((state) => {
          const current = state.messages[activeConversationId] ?? {
            items: [],
            hasMore: false,
            nextCursor: undefined,
            didFetch: true,
          };
          return {
            messages: {
              ...state.messages,
              [activeConversationId]: {
                ...current,
                items: [...current.items, localMessage],
              },
            },
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c
            ),
          };
        });

        try {
          const message = await chat.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined
          );

          if (message) {
            set((state) => {
              const current = state.messages[activeConversationId];
              if (!current) return state;
              return {
                messages: {
                  ...state.messages,
                  [activeConversationId]: {
                    ...current,
                    items: current.items.map((item) =>
                      item._id === localMessage._id
                        ? { ...message, isOwn: true, status: "sent" }
                        : item
                    ),
                  },
                },
              };
            });
          }
        } catch (error) {
          set((state) => {
            const current = state.messages[activeConversationId];
            if (!current) return state;
            return {
              messages: {
                ...state.messages,
                [activeConversationId]: {
                  ...current,
                  items: current.items.map((item) =>
                    item._id === localMessage._id
                      ? { ...item, status: "failed" }
                      : item
                  ),
                },
              },
            };
          });
          console.error(
            "An error occurred while sending a direct message",
            error
          );
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        const localMessage = createLocalMessage({
          content,
          conversationId,
          imgUrl,
          senderId: user.id,
        });

        set((state) => {
          const current = state.messages[conversationId] ?? {
            items: [],
            hasMore: false,
            nextCursor: undefined,
            didFetch: true,
          };
          return {
            messages: {
              ...state.messages,
              [conversationId]: {
                ...current,
                items: [...current.items, localMessage],
              },
            },
            conversations: state.conversations.map((c) =>
              c._id === conversationId ? { ...c, seenBy: [] } : c
            ),
          };
        });

        try {
          const message = await chat.sendGroupMessage(
            conversationId,
            content,
            imgUrl
          );

          if (message) {
            set((state) => {
              const current = state.messages[conversationId];
              if (!current) return state;
              return {
                messages: {
                  ...state.messages,
                  [conversationId]: {
                    ...current,
                    items: current.items.map((item) =>
                      item._id === localMessage._id
                        ? { ...message, isOwn: true, status: "sent" }
                        : item
                    ),
                  },
                },
              };
            });
          }
        } catch (error) {
          set((state) => {
            const current = state.messages[conversationId];
            if (!current) return state;
            return {
              messages: {
                ...state.messages,
                [conversationId]: {
                  ...current,
                  items: current.items.map((item) =>
                    item._id === localMessage._id
                      ? { ...item, status: "failed" }
                      : item
                  ),
                },
              },
            };
          });
          console.error(
            "An error occurred while sending a group message",
            error
          );
        }
      },

      retryMessage: async (conversationId, messageId) => {
        const conversation = get().conversations.find(
          (item) => item._id === conversationId
        );
        const failedMessage = get().messages[conversationId]?.items.find(
          (item) => item._id === messageId && item.status === "failed"
        );
        const { user } = useAuthStore.getState();
        if (!conversation || !failedMessage || !user) return;

        set((state) => {
          const current = state.messages[conversationId];
          if (!current) return state;
          return {
            messages: {
              ...state.messages,
              [conversationId]: {
                ...current,
                items: current.items.filter((item) => item._id !== messageId),
              },
            },
          };
        });

        if (conversation.type === "direct") {
          const recipient = conversation.participants.find(
            (participant) => participant._id !== user.id
          );
          if (!recipient) return;
          await get().sendDirectMessage(
            recipient._id,
            failedMessage.content ?? "",
            failedMessage.imgUrl ?? undefined
          );
          return;
        }

        await get().sendGroupMessage(
          conversationId,
          failedMessage.content ?? "",
          failedMessage.imgUrl ?? undefined
        );
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          message.isOwn = message.senderId === user?.id;
          const conversationId = message.conversationId;

          const existing = get().messages[conversationId];
          if (!existing?.didFetch && !existing?.items?.length) {
            await get().fetchMessages(conversationId);
          }

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
                  nextCursor:
                    state.messages[conversationId]?.nextCursor ?? undefined,
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
        set((state) => {
          const existing = state.conversations.some(
            (c) => c._id === conversation._id
          );
          const conversations = existing
            ? state.conversations.map((c) =>
                c._id === conversation._id ? { ...c, ...conversation } : c
              )
            : conversation.type && conversation.participants
              ? [conversation as Conversation, ...state.conversations]
              : state.conversations;

          return {
            conversations: conversations.slice().sort((a, b) => {
              const aTime = new Date(
                a.lastMessageAt ?? a.updatedAt ?? a.createdAt
              ).getTime();
              const bTime = new Date(
                b.lastMessageAt ?? b.updatedAt ?? b.createdAt
              ).getTime();
              return bTime - aTime;
            }),
          };
        });
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

      clearTypingForConversation: (conversationId: string) => {
        set((state) => {
          const { [conversationId]: _removed, ...typingUsers } =
            state.typingUsers;
          return { typingUsers };
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
        activeConversationId: state.activeConversationId,
        drafts: state.drafts,
      }),
    }
  )
);
