import { Conversation } from "@/types/chat";
import Card from "./Card";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { cn } from "@/lib/utils";

export default function GroupCard({
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

 if (!user) return null;

 const ortherUser = conversation.participants.find(
 (item) => item._id !== user.id
 );

 if (!ortherUser) return null;

 const unreadCount = conversation.unreadCounts[user.id];
 const name = conversation.group?.name ?? "";

 const handleSelectionConversation = async (id: string) => {
 setActiveConversation(id);
 await fetchMessages(id);
 };

 return (
 <Card
 isGroup
 convosationId={conversation._id}
 name={name}
 timestamp={
 conversation.lastMessage?.createdAt
 ? new Date(conversation.lastMessage?.createdAt)
 : undefined
 }
 isActive={activeConversationId === conversation._id}
 unreadCount={unreadCount}
 onSelect={handleSelectionConversation}
 subTitle={
 <p className="truncate text-xs">
 {conversation.participants.length} members
 </p>
 }
 />
);
}
