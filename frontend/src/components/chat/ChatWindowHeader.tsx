"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { Conversation } from "@/types/chat";
import { EllipsisVertical, Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ChatWindowHeader({
  chat,
  messageSearchQuery = "",
  onMessageSearchChange,
  onToggleInfo,
}: {
  chat?: Conversation;
  messageSearchQuery?: string;
  onMessageSearchChange?: (query: string) => void;
  onToggleInfo?: () => void;
}) {
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const { conversations, activeConversationId, typingUsers } = useChatStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  let otherUser;

  chat = chat ?? conversations.find((i) => i._id === activeConversationId);

  if (!chat) return;

  if (chat.type === "direct") {
    const otherUsers = chat.participants.filter((p) => p._id !== user?.id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return;
  }

  const isValidImage =
    otherUser?.avatarUrl &&
    (otherUser.avatarUrl.startsWith("http://") ||
      otherUser.avatarUrl.startsWith("https://") ||
      otherUser.avatarUrl.startsWith("/"));

  const onlineCount = chat.participants.filter(
    (p) => p._id !== user?.id && onlineUsers.includes(p._id)
  ).length;

  // Typing indicator
  const typingList = (typingUsers[chat._id] ?? []).filter(
    (u) => u.userId !== user?.id
  );
  const typingLabel = buildTypingLabel(typingList);

  const initial = chat.type === "group"
    ? chat.group?.name.charAt(0).toUpperCase() || "?"
    : otherUser?.displayName?.charAt(0).toUpperCase() || "?";
  return (
    <div className="flex items-center justify-between border-b-4 border-black dark:border-dark-border bg-surface dark:bg-dark-bg-sidebar p-6">
      <div className="flex items-center gap-4">
        {chat.type === "direct" ? (
          isValidImage && otherUser?.avatarUrl ? (
            <Image
              src={otherUser.avatarUrl}
              alt={otherUser.displayName || "avatar"}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-black dark:border-dark-border-subtle object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center bg-black dark:bg-dark-accent text-sm font-bold text-white dark:text-dark-accent-on">
              {initial}
            </div>
          )
        ) : (
          <div className="flex h-12 w-12 items-center justify-center bg-black dark:bg-dark-accent text-sm font-bold text-white dark:text-dark-accent-on">
            {initial}
          </div>
        )}
        <div>
          <h3 className="font-headline text-lg font-extrabold uppercase leading-none dark:text-dark-text-primary">
            {chat.type === "direct" ? otherUser?.displayName : chat.group?.name}
          </h3>
          {typingLabel ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-bold italic text-green-500">
              <span className="typing-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
              {typingLabel}
            </p>
          ) : chat.type === "group" ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-gray-400 dark:text-dark-text-tertiary">
              {onlineCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-green-500" />
              )}
              {chat.participants.length} members
            </p>
          ) : (
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-bold ${onlineUsers.includes(otherUser?._id ?? "") ? "text-green-500" : "text-gray-400 dark:text-dark-text-tertiary"} `}
            >
              <span
                className={`h-2 w-2 rounded-full ${onlineUsers.includes(otherUser?._id ?? "") ? "bg-green-500" : "bg-gray-400"} `}
              />
              {onlineUsers.includes(otherUser?._id ?? "") ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 dark:text-dark-text-secondary">
        {isSearchOpen && (
          <input
            type="search"
            value={messageSearchQuery}
            onChange={(event) => onMessageSearchChange?.(event.target.value)}
            placeholder="Search messages"
            className="w-44 border-2 border-black dark:border-dark-border-subtle bg-surface-container-lowest dark:bg-dark-bg-input px-3 py-2 text-xs font-bold text-on-surface dark:text-dark-text-primary outline-none dark:focus:border-dark-accent"
          />
        )}
        <button
          type="button"
          onClick={() => {
            if (isSearchOpen) {
              onMessageSearchChange?.("");
            }
            setIsSearchOpen((prev) => !prev);
          }}
          className="flex size-8 items-center justify-center border-2 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-card"
          aria-label={isSearchOpen ? "Close message search" : "Search messages"}
          title={isSearchOpen ? "Close message search" : "Search messages"}
        >
          {isSearchOpen ? (
            <X size={16} strokeWidth={3} />
          ) : (
            <Search size={16} strokeWidth={3} />
          )}
        </button>
        <button
          type="button"
          onClick={onToggleInfo}
          className="flex size-8 items-center justify-center border-2 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-card"
          aria-label="Conversation info"
          title="Conversation info"
        >
          <EllipsisVertical size={16} strokeWidth={3} />
        </button>
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
