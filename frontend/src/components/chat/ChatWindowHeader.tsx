"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { Conversation } from "@/types/chat";
import { EllipsisVertical, Search } from "lucide-react";
import Image from "next/image";

export default function ChatWindowHeader({ chat }: { chat?: Conversation }) {
 const { user } = useAuthStore();
 const { onlineUsers } = useSocketStore();
 const { conversations, activeConversationId, typingUsers } = useChatStore();

 let otherUser;

 chat = chat ?? conversations.find((i) => i._id === activeConversationId);

 if (!chat) return;

 if (chat.type === "direct") {
 const otherUsers = chat.participants.filter((p) => p._id !== user?.id);
 otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

 if (!user || !otherUser) return;
 }
 const checkOnline = onlineUsers.includes(otherUser?._id ?? "");
 const isValidImage =
 otherUser?.avatarUrl &&
 (otherUser.avatarUrl.startsWith("http://") ||
 otherUser.avatarUrl.startsWith("https://") ||
 otherUser.avatarUrl.startsWith("/"));

 // Typing indicator
 const typingList = (typingUsers[chat._id] ?? []).filter(
 (u) => u.userId !== user?.id
 );
 const typingLabel = buildTypingLabel(typingList);

 const initial = otherUser?.displayName?.charAt(0).toUpperCase() || "?";
 return (
 <div className="flex items-center justify-between border-b-4 border-black bg-surface p-6">
 <div className="flex items-center gap-4">
 {chat.type === "direct" ? (
 isValidImage && otherUser?.avatarUrl ? (
 <Image
 src={otherUser.avatarUrl}
 alt={otherUser.displayName || "avatar"}
 width={48}
 height={48}
 className="h-12 w-12 rounded-full border-2 border-black object-cover"
 />
 ) : (
 <div className="flex h-12 w-12 items-center justify-center bg-black text-sm font-bold text-white">
 {initial}
 </div>
 )
 ) : (
 <div className="flex h-12 w-12 items-center justify-center bg-black text-sm font-bold text-white">
 {chat.group?.name.charAt(0).toUpperCase()}
 </div>
 )}
 <div>
 <h3 className="font-headline text-lg font-extrabold uppercase leading-none">
 {chat.type === "direct" ? otherUser?.displayName : chat.group?.name}
 </h3>
 {typingLabel ? (
 <p className="mt-1 flex items-center gap-1 text-xs font-bold italic text-green-500">
 <span className="typing-dots">
 <span>.</span><span>.</span><span>.</span>
 </span>
 {typingLabel}
 </p>
 ) : (
 <p
 className={`mt-1 flex items-center gap-1 text-xs font-bold ${checkOnline ? "text-green-500" : "text-gray-400"} `}
 >
 <span
 className={`h-2 w-2 rounded-full ${checkOnline ? "bg-green-500" : "bg-gray-400"} `}
 />
 {checkOnline ? "Online" : "Offline"}
 </p>
 )}
 </div>
 </div>
 <div className="flex gap-4">
 <Search />
 <EllipsisVertical className="hover:cursor-pointer" />
 </div>
 </div>
 );
}

function buildTypingLabel(
 typingUsers: { userId: string; username: string }[]
): string {
 if (typingUsers.length === 0) return "";
 if (typingUsers.length === 1) {
 return `${typingUsers[0].username} is typing`;
 }
 if (typingUsers.length === 2) {
 return `${typingUsers[0].username} and ${typingUsers[1].username} are typing`;
 }
 return `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing`;
}
