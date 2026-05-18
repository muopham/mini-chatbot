import FriendCard from "./FriendCard";
import { useChatStore } from "@/lib/store/useChatStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import type { Friend } from "@/lib/friends";
import { useSocketStore } from "@/lib/store/useSocketStore";
import Card from "./Card";
import { cn } from "@/lib/utils";
import ConversationListSkeleton from "./ConversationListSkeleton";
import { useState } from "react";

export default function FriendsList() {
  const user = useAuthStore((state) => state.user);
  const conversations = useChatStore((state) => state.conversations);
  const converLoading = useChatStore((state) => state.converLoading);
  const createDirectConversation = useChatStore(
    (state) => state.createDirectConversation
  );
  const allFriends = useFriendsStore((state) => state.allFriends);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  if (!conversations) return null;

  const directConversations = conversations.filter(
    (item) => item.type === "direct"
  );
  const conversationParticipantIds = new Set(
    directConversations.flatMap((conversation) =>
      conversation.participants.map((participant) => participant._id)
    )
  );
  const friendsWithoutConversation = user
    ? allFriends.filter((friend) => {
        const friendUser = getFriendUser(friend, user.id);
        return friendUser && !conversationParticipantIds.has(friendUser._id);
      })
    : [];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-headline text-[10px] font-black uppercase tracking-widest text-stone-500 dark:text-dark-text-secondary">
          Friends
        </h2>
      </div>
      <div className="space-y-2">
        {converLoading ? (
          <ConversationListSkeleton count={3} />
        ) : (
          <>
            {directConversations.map((item) => (
              <FriendCard conversation={item} key={item._id} />
            ))}
            {friendsWithoutConversation.map((friend) => {
              const friendUser = user ? getFriendUser(friend, user.id) : null;
              if (!friendUser) return null;
              const checkOnline = onlineUsers.includes(friendUser._id);
              return (
                <NoConversationFriendCard
                  key={friend._id}
                  friendId={friendUser._id}
                  displayName={friendUser.displayName}
                  avatarUrl={friendUser.avatarUrl}
                  isOnline={checkOnline}
                  onCreate={createDirectConversation}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function getFriendUser(friend: Friend, currentUserId: string) {
  return friend.userA._id === currentUserId ? friend.userB : friend.userA;
}

function NoConversationFriendCard({
  friendId,
  displayName,
  avatarUrl,
  isOnline,
  onCreate,
}: {
  friendId: string;
  displayName: string;
  avatarUrl?: string;
  isOnline: boolean;
  onCreate: (id: string) => Promise<unknown> | void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        conversationId={friendId}
        name={displayName}
        isActive={false}
        onSelect={onCreate}
        avatar={avatarUrl}
        subTitle={
          <p
            className={cn(
              "truncate text-xs text-gray-500 dark:text-dark-text-tertiary"
            )}
          >
            No messages yet
          </p>
        }
        statusType={isOnline ? "online" : "offline"}
      />

      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreate(friendId);
          }}
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center border-2 border-black bg-accent-yellow transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] dark:border-dark-border-subtle dark:bg-dark-accent"
          title="Send message"
        >
          <span className="material-symbols-outlined text-sm leading-none">
            send
          </span>
        </button>
      )}
    </div>
  );
}
