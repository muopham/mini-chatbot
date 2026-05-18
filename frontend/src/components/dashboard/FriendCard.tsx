import { Conversation } from "@/types/chat";
import Card from "./Card";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { cn } from "@/lib/utils";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { memo } from "react";

function FriendCard({
  conversation,
}: {
  conversation: Conversation;
}) {
  const user = useAuthStore((state) => state.user);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  if (!user) return null;

  const ortherUser = conversation.participants.find(
    (item) => item._id !== user.id
  );

  if (!ortherUser) return null;

  const unreadCount = conversation.unreadCounts[user.id];
  const lassMessage = conversation.lastMessage?.content ?? "";
  const checkOnline = onlineUsers.includes(ortherUser?._id ?? "");

  const handleSelectionConversation = (id: string) => {
    setActiveConversation(id);
  };

  return (
    <Card
      conversationId={conversation._id}
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
            unreadCount > 0 ? "font-semibold text-black dark:text-dark-text-primary" : "text-gray-500 dark:text-dark-text-tertiary"
          )}
        >
          {lassMessage}
        </p>
      }
      statusType={checkOnline ? "online" : "offline"}
    />
  );
}

export default memo(FriendCard);
