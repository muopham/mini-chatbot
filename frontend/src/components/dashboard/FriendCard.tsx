import { Conversation } from "@/types/chat";
import Card from "./Card";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { cn } from "@/lib/utils";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { memo, useState } from "react";

function FriendCard({ conversation }: { conversation: Conversation }) {
  const user = useAuthStore((state) => state.user);
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId
  );
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const [hovered, setHovered] = useState(false);

  if (!user) return null;

  const otherUser = conversation.participants.find(
    (item) => item._id !== user.id
  );

  if (!otherUser) return null;

  const unreadCount = conversation.unreadCounts[user.id];
  const lastMessage = conversation.lastMessage?.content ?? "";
  const checkOnline = onlineUsers.includes(otherUser?._id ?? "");
  const isActive = activeConversationId === conversation._id;

  const handleSelectionConversation = (id: string) => {
    setActiveConversation(id);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        conversationId={conversation._id}
        name={otherUser.displayName ?? ""}
        timestamp={
          conversation.lastMessage?.createdAt
            ? new Date(conversation.lastMessage?.createdAt)
            : undefined
        }
        isActive={isActive}
        unreadCount={unreadCount}
        onSelect={handleSelectionConversation}
        avatar={otherUser.avatarUrl!}
        subTitle={
          <p
            className={cn(
              "truncate text-xs",
              unreadCount > 0
                ? "font-semibold text-black dark:text-dark-text-primary"
                : "text-gray-500 dark:text-dark-text-tertiary"
            )}
          >
            {lastMessage}
          </p>
        }
        statusType={checkOnline ? "online" : "offline"}
      />

      {hovered && !isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveConversation(conversation._id);
          }}
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center border-2 border-black bg-accent-yellow transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] dark:border-dark-border-subtle dark:bg-dark-accent"
          title="Open chat"
        >
          <span className="material-symbols-outlined text-sm leading-none">
            chat
          </span>
        </button>
      )}
    </div>
  );
}

export default memo(FriendCard);
