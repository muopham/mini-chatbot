import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;
    const existingAuth = existingSocket?.auth;
    const existingToken =
      typeof existingAuth === "object" && existingAuth !== null
        ? (existingAuth as { token?: string }).token
        : undefined;

    if (!accessToken) return;

    if (existingSocket?.connected && existingToken === accessToken) {
      return;
    }

    if (existingSocket) {
      existingSocket.disconnect();
    }

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Connect success!");
    });

    socket.io.on("reconnect_attempt", () => {
      socket.auth = { token: useAuthStore.getState().accessToken };
    });

    socket.on("online-users", (userId) => {
      set({ onlineUsers: userId });
    });

    // New message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      const { activeConversationId, conversations } = useChatStore.getState();
      const { user } = useAuthStore.getState();

      const existingConvo = conversations.find(
        (c) => c._id === conversation._id
      );
      const incomingLastMessage = conversation.lastMessage;
      const senderId = incomingLastMessage?.sender?._id ?? message.senderId;
      const senderParticipant = existingConvo?.participants?.find(
        (p) => p._id === senderId
      );

      const lastMessage = incomingLastMessage
        ? {
            ...incomingLastMessage,
            sender: {
              _id: senderId,
              displayName:
                incomingLastMessage.sender?.displayName ??
                senderParticipant?.displayName ??
                "",
              avatarUrl:
                incomingLastMessage.sender?.avatarUrl ??
                senderParticipant?.avatarUrl ??
                null,
            },
          }
        : null;

      const updateConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (message.senderId === user?.id) {
        useChatStore.getState().updateConversation(updateConversation);
        return;
      }

      if (activeConversationId === message.conversationId) {
        useChatStore.getState().markAsSeen();
      }
      useChatStore.getState().addMessage(message);
      useChatStore.getState().updateConversation(updateConversation);
    });

    // Read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };
      useChatStore.getState().updateConversation(updated);
    });

    // Typing indicator
    socket.on("user-typing", ({ conversationId, userId, username }) => {
      useChatStore.getState().setTyping(conversationId, userId, username);
    });

    socket.on("user-stopped-typing", ({ conversationId, userId }) => {
      useChatStore.getState().clearTyping(conversationId, userId);
    });

    socket.on("new-group", (conversation) => {
      useChatStore.getState().updateConversation(conversation);
      socket.emit("join-conversation", conversation._id);
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
