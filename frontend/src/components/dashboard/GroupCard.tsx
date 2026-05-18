import { Conversation } from "@/types/chat";
import Card from "./Card";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { memo } from "react";

function GroupCard({ conversation }: { conversation: Conversation }) {
  const user = useAuthStore((state) => state.user);
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId
  );
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );

  if (!user) return null;

  const unreadCount = conversation.unreadCounts[user.id];
  const name = conversation.group?.name ?? "";

  const handleSelectionConversation = (id: string) => {
    setActiveConversation(id);
  };

  return (
    <Card
      isGroup
      conversationId={conversation._id}
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

export default memo(GroupCard);
