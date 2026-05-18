"use client";

import Image from "next/image";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { DEFAULT_AVATAR_URL } from "@/shared/constants/chat";
import type { Friend } from "@/lib/friends";
import { cn } from "@/lib/utils";
import ConversationListSkeleton from "./ConversationListSkeleton";

interface AllFriendsListProps {
  onStartChat: (friendId: string) => Promise<void> | void;
}

function getFriendUser(friend: Friend, currentUserId: string) {
  return friend.userA._id === currentUserId ? friend.userB : friend.userA;
}

export default function AllFriendsList({ onStartChat }: AllFriendsListProps) {
  const user = useAuthStore((state) => state.user);
  const allFriends = useFriendsStore((state) => state.allFriends);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const conversations = useChatStore((state) => state.conversations);

  const directConversations = conversations.filter((c) => c.type === "direct");
  const friendsWithChat = new Set(
    directConversations.flatMap((c) => c.participants.map((p) => p._id))
  );

  if (!user) return null;

  if (allFriends.length === 0) {
    return (
      <div className="py-8 text-center">
        <span className="material-symbols-outlined text-4xl text-stone-300 dark:text-dark-text-tertiary">
          group
        </span>
        <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-dark-text-tertiary">
          No friends yet
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {allFriends.map((friend) => {
        const friendUser = getFriendUser(friend, user.id);
        if (!friendUser) return null;

        const isOnline = onlineUsers.includes(friendUser._id);
        const hasConversation = friendsWithChat.has(friendUser._id);

        const isValidImage =
          friendUser.avatarUrl &&
          (friendUser.avatarUrl.startsWith("http://") ||
            friendUser.avatarUrl.startsWith("https://") ||
            friendUser.avatarUrl.startsWith("/"));

        return (
          <li
            key={friend._id}
            className="flex items-center gap-3 border-2 border-transparent bg-white p-3 transition-all hover:border-black dark:bg-dark-bg-card dark:hover:border-dark-border"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {isValidImage ? (
                <Image
                  src={friendUser.avatarUrl!}
                  alt={friendUser.displayName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white dark:bg-dark-accent dark:text-dark-accent-on">
                  {friendUser.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-dark-bg-sidebar",
                  isOnline ? "bg-green-500" : "bg-gray-400"
                )}
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium dark:text-dark-text-primary">
                {friendUser.displayName}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isOnline
                    ? "font-semibold text-green-600 dark:text-green-400"
                    : "text-stone-400 dark:text-dark-text-tertiary"
                )}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>

            {/* Message button */}
            <button
              onClick={() => onStartChat(friendUser._id)}
              className={cn(
                "flex flex-shrink-0 items-center gap-1 border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wide transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] dark:border-dark-border-subtle",
                hasConversation
                  ? "bg-stone-100 text-stone-600 dark:bg-dark-bg-input dark:text-dark-text-secondary"
                  : "bg-accent-yellow text-black"
              )}
              title={hasConversation ? "Continue chat" : "Send message"}
            >
              <span className="material-symbols-outlined text-sm leading-none">
                {hasConversation ? "chat" : "send"}
              </span>
              <span>{hasConversation ? "Chat" : "Message"}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
