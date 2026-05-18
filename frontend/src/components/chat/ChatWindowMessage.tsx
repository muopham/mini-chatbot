"use client";

import { useChatStore } from "@/lib/store/useChatStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { formatMessageTime } from "@/lib/utils";
import { Conversation, Message, Participant } from "@/types/chat";
import Image from "next/image";
import EmptyChatState from "../dashboard/EmptyChatState";
import EmptyStateMain from "../dashboard/EmptyStateMain";
import { useEffect, useRef, useState, memo } from "react";
import { CircleCheck, RotateCcw } from "lucide-react";
import { useMessagePagination } from "@/hooks/useMessagePagination";
import { useMessageScroll } from "@/hooks/useMessageScroll";
import { CHAT_SCROLL_CONTAINER_ID } from "@/shared/constants/chat";

export default function ChatWindowMessage({
  searchQuery = "",
}: {
  searchQuery?: string;
}) {
  const {
    conversations,
    activeConversationId,
    messages: allMessages,
    messageLoading,
    fetchMessages,
    retryMessage,
  } = useChatStore();
  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");
  const messages = allMessages[activeConversationId!]?.items ?? [];
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const visibleMessages = normalizedSearchQuery
    ? messages.filter((message) =>
        message.content?.toLowerCase().includes(normalizedSearchQuery)
      )
    : messages;
  const currentUserId = useAuthStore((state) => state.user?.id);
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const lastMessageId = messages[messages.length - 1]?._id ?? null;
  const selectedConversation = conversations.find(
    (i) => i._id === activeConversationId
  );
  const unreadAnchorRef = useRef<{
    conversationId: string | null;
    unreadCount: number;
  }>({ conversationId: null, unreadCount: 0 });
  // Guard: only show messages after we've explicitly fetched for this conversation.
  // Prevents stale messages from a previous conversation from briefly flashing.
  const didFetchForActive =
    allMessages[activeConversationId!]?.didFetch ?? false;

  if (activeConversationId !== unreadAnchorRef.current.conversationId) {
    unreadAnchorRef.current = {
      conversationId: activeConversationId,
      unreadCount:
        currentUserId && selectedConversation?.unreadCounts
          ? (selectedConversation.unreadCounts[currentUserId] ?? 0)
          : 0,
    };
  }

  const firstUnreadIndex =
    !normalizedSearchQuery && unreadAnchorRef.current.unreadCount > 0
      ? Math.max(messages.length - unreadAnchorRef.current.unreadCount, 0)
      : -1;

  const { getScrollContainer, messageEndRef, prependAnchorRef } =
    useMessageScroll({
      activeConversationId,
      lastMessageId,
      messagesLength: messages.length,
      scrollContainerId: CHAT_SCROLL_CONTAINER_ID,
    });

  useMessagePagination({
    activeConversationId,
    fetchMessages,
    getScrollContainer,
    hasMore,
    prependAnchorRef,
  });

  useEffect(() => {
    const lastMessage = selectedConversation?.lastMessage;
    if (!lastMessage) return;
    const seenBy = selectedConversation?.seenBy ?? [];
    const seenByOthers = seenBy.filter((u) => u._id !== currentUserId);
    setLastMessageStatus(seenByOthers.length > 0 ? "seen" : "delivered");
  }, [selectedConversation, currentUserId]);

  // Initial load when switching to a conversation that has no cached messages
  useEffect(() => {
    if (!activeConversationId) return;
    const existing = allMessages[activeConversationId];
    if (!existing?.items?.length) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, allMessages, fetchMessages]);

  const sendHello = async () => {
    if (!selectedConversation || !currentUserId) return;
    if (selectedConversation.type === "direct") {
      const other = selectedConversation.participants.find(
        (p) => p._id !== currentUserId
      );
      if (other) {
        await useChatStore.getState().sendDirectMessage(other._id, "Hello!");
      }
    } else {
      await useChatStore.getState().sendGroupMessage(
        selectedConversation._id,
        "Hello!"
      );
    }
  };

  if (!selectedConversation) return <EmptyStateMain />;
  if (!didFetchForActive) return null;
  if (!messages?.length) return <EmptyChatState onSendHello={sendHello} />;
  if (!visibleMessages.length) return <EmptyChatState onSendHello={sendHello} />;

  return (
    <div className="flex flex-col gap-1 p-4">
      {messageLoading && hasMore && (
        <p className="py-2 text-center text-xs font-bold text-stone-400">
          Loading...
        </p>
      )}
      {visibleMessages.map((item, index) => (
        <div key={item._id ?? index}>
          {index === firstUnreadIndex && <UnreadSeparator />}
          <MessageItem
            message={item}
            index={index}
            messages={visibleMessages}
            selectedConvo={selectedConversation}
            lastMessageStatus={lastMessageStatus}
            onRetry={retryMessage}
          />
        </div>
      ))}
      <div ref={messageEndRef}></div>
    </div>
  );
}

function UnreadSeparator() {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-0.5 flex-1 bg-red-400" />
      <span className="border-2 border-black bg-red-400 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
        New messages
      </span>
      <div className="h-0.5 flex-1 bg-red-400" />
    </div>
  );
}

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
  onRetry: (conversationId: string, messageId: string) => Promise<void>;
}

const MessageItem = memo(function MessageItem({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
  onRetry,
}: MessageItemProps) {
  const prev = index > 0 ? messages[index - 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000;

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id?.toString() === message.senderId?.toString()
  );

  const isOwn = message.isOwn;

  const isLastMessage = index === messages.length - 1;
  const shouldShowStatus = isOwn && isLastMessage;
  const isFailed = message.status === "failed";
  const isSending = message.status === "sending";
  const otherUser = selectedConvo.participants.find(
    (p: Participant) => p._id?.toString() !== message.senderId?.toString()
  );

  return (
    <div
      className={`mt-[2px] flex w-full gap-4 ${
        isOwn ? "flex-row-reverse self-end" : ""
      }`}
    >
      {isGroupBreak ? (
        <div className="flex-shrink-0">
          {participant?.avatarUrl ? (
            <Image
              src={participant.avatarUrl}
              alt={participant?.displayName}
              width={48}
              height={48}
              className="h-12 w-12 border-4 border-on-surface object-cover"
            />
          ) : (
            <div
              className={`flex h-12 w-12 items-center justify-center border-4 border-on-surface dark:border-dark-border-subtle text-sm font-black ${
                isOwn ? "bg-primary-container dark:bg-dark-accent/25" : "bg-white dark:bg-dark-bg-card"
              }`}
            >
              {participant?.displayName?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
      ) : (
        <div className="w-12 flex-shrink-0" />
      )}

      {/* Content */}
      <div
        className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}
      >
        {isGroupBreak && (
          <span
            className={`text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-dark-text-tertiary ${
              isOwn ? "mr-1" : "ml-1"
            }`}
          >
            {isOwn ? "You" : participant?.displayName} •{" "}
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`editorial-shadow relative max-w-[min(72vw,520px)] overflow-hidden border-4 border-black dark:border-dark-border-subtle ${
            isOwn ? "bg-primary-container dark:bg-dark-accent/15" : "bg-surface-container-lowest dark:bg-dark-bg-card"
          }`}
        >
          {message.imgUrl && (
            <Image
              src={message.imgUrl}
              alt="Shared image"
              width={520}
              height={360}
              className="max-h-80 w-full object-cover"
            />
          )}
          {message.content && (
            <p className="break-words p-4 font-body text-on-background dark:text-dark-text-primary">
              {message.content}
            </p>
          )}
        </div>

        {shouldShowStatus && (
          <div className="mr-1 mt-1 flex items-center justify-end">
            {isFailed ? (
              <button
                type="button"
                onClick={() => onRetry(message.conversationId, message._id)}
                className="flex items-center gap-1 border-2 border-black dark:border-dark-border bg-red-400 dark:bg-red-700 px-2 py-1 text-[10px] font-black uppercase text-white"
              >
                <RotateCcw size={12} strokeWidth={3} />
                Retry
              </button>
            ) : isSending ? (
              <span className="text-[10px] font-black uppercase text-stone-400 dark:text-dark-text-tertiary">
                Sending
              </span>
            ) : (
              <MessageStatusIcon
                status={lastMessageStatus}
                participant={otherUser}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

function MessageStatusIcon({
  status,
  participant,
}: {
  status: "delivered" | "seen";
  participant?: Participant;
}) {
  if (status === "delivered") {
    return (
      <span className="text-xs text-gray-400 dark:text-dark-text-tertiary">
        <CircleCheck size={16} />
      </span>
    );
  }

  if (status === "seen") {
    return participant?.avatarUrl ? (
      <Image
        src={participant.avatarUrl}
        alt={participant.displayName}
        width={16}
        height={16}
        className="h-4 w-4 rounded-full object-cover"
      />
    ) : (
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black dark:bg-dark-accent text-[10px] text-white dark:text-dark-accent-on">
        {participant?.displayName?.charAt(0)}
      </div>
    );
  }

  return null;
}
