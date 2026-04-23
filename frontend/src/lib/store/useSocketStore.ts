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

 if (existingSocket) return;

 const socket: Socket = io(baseURL, {
 auth: { token: accessToken },
 transports: ["websocket"],
 });

 set({ socket });

 socket.on("connect", () => {
 console.log("Connect success!");
 });

 socket.on("online-users", (userId) => {
 set({ onlineUsers: userId });
 });

 // New message
 socket.on("new-message", ({ message, conversation, unreadCounts }) => {
 // Get sender's displayName from participants already in the store
 const { conversations } = useChatStore.getState();
 const existingConvo = conversations.find((c) => c._id === conversation._id);
 const senderParticipant = existingConvo?.participants?.find(
  (p) => p._id === conversation.lastMessage?.senderId
 );

 const lastMessage = {
  _id: conversation.lastMessage._id,
  content: conversation.lastMessage.content,
  createdAt: conversation.lastMessage.createdAt,
  sender: {
   _id: conversation.lastMessage.senderId,
   displayName: senderParticipant?.displayName ?? "",
   avatarUrl: senderParticipant?.avatarUrl ?? null,
  },
 };

 const updateConversation = {
  ...conversation,
  lastMessage,
  unreadCounts,
 };

 if (
  useChatStore.getState().activeConversationId === message.conversationId
 ) {
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
 },
 disconnectSocket: () => {
 const socket = get().socket;
 if (socket) {
 socket.disconnect();
 set({ socket: null });
 }
 },
}));
