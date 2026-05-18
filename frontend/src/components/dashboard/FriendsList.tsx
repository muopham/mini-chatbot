import FriendCard from "./FriendCard";
import { useChatStore } from "@/lib/store/useChatStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import type { Friend } from "@/lib/friends";
import { useSocketStore } from "@/lib/store/useSocketStore";
import Card from "./Card";
import { cn } from "@/lib/utils";
import ConversationListSkeleton from "./ConversationListSkeleton";

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
                <Card
                  key={friend._id}
                  conversationId={friendUser._id}
                  name={friendUser.displayName}
                  isActive={false}
                  onSelect={createDirectConversation}
                  avatar={friendUser.avatarUrl}
                  subTitle={
                    <p
                      className={cn(
                        "truncate text-xs text-gray-500 dark:text-dark-text-tertiary"
                      )}
                    >
                      No messages yet
                    </p>
                  }
                  statusType={checkOnline ? "online" : "offline"}
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
