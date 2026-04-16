import { Conversation } from "@/types/chat";
import Card from "./Card";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { cn } from "@/lib/utils";
import { useSocketStore } from "@/lib/store/useSocketStore";

export default function FriendCard({
 conversation,
}: {
 conversation: Conversation;
}) {
 const { user } = useAuthStore();
 const {
 activeConversationId,
 setActiveConversation,
 fetchMessages,
 } = useChatStore();
 const { onlineUsers } = useSocketStore();

 if (!user) return null;

 const ortherUser = conversation.participants.find(
 (item) => item._id !== user.id
 );

 if (!ortherUser) return null;

 const unreadCount = conversation.unreadCounts[user.id];
 const lassMessage = conversation.lastMessage?.content ?? "";
 const checkOnline = onlineUsers.includes(ortherUser?._id ?? "");

 const handleSelectionConversation = async (id: string) => {
 setActiveConversation(id);
 await fetchMessages(id);
 };

 return (
 <Card
 convosationId={conversation._id}
 name={ortherUser.displayName ?? ""}
 timestamp={
 conversation.lastMessage?.createdAt
 ? new Date(conversation.lastMessage?.createdAt)
 : undefined
 }
 isActive={activeConversationId === conversation._id}
 unreadCount={unreadCount}
 onSelect={handleSelectionConversation}
 avatar={ortherUser.avatarUrl!}
 subTitle={
 <p
 className={cn(
 "truncate text-xs",
 unreadCount > 0 ? "font-semibold text-black" : "text-gray-500"
 )}
 >
 {lassMessage}
 </p>
 }
 statusType={checkOnline ? "online" : "offline"}
 />
 );
}
