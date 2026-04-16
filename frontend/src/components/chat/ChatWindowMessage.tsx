"use client";

import { useChatStore } from "@/lib/store/useChatStore";
import { formatMessageTime } from "@/lib/utils";
import { Conversation, Message, Participant } from "@/types/chat";
import Image from "next/image";
import EmptyChatState from "../dashboard/EmptyChatState";
import EmptyStateMain from "../dashboard/EmptyStateMain";
import {
 useEffect,
 useLayoutEffect,
 useRef,
 useState,
 useCallback,
} from "react";
import { CircleCheck } from "lucide-react";

const CHAT_SCROLL_CONTAINER_ID = "chat-window-scroll-container";

export default function ChatWindowMessage() {
 const {
 conversations,
 activeConversationId,
 messages: allMessages,
 messageLoading,
 fetchMessages,
 } = useChatStore();
 const [lastMessageStatus, setLastMessageStatus] = useState<
 "delivered" | "seen"
 >("delivered");
 const messages = allMessages[activeConversationId!]?.items ?? [];
 const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
 const lastMessageId = messages[messages.length - 1]?._id ?? null;
 const messageEndRef = useRef<HTMLDivElement>(null);
 const selectConvesation = conversations.find(
 (i) => i._id === activeConversationId
 );
 const prevLastMessageIdRef = useRef<string | null>(null);
 const prevActiveIdRef = useRef<string | null>(null);
 const prependAnchorRef = useRef<{ prevHeight: number; prevTop: number } | null>(
 null
 );
 // Guard: only show messages after we've explicitly fetched for this conversation.
 // Prevents stale messages from a previous conversation from briefly flashing.
 const didFetchForActive = allMessages[activeConversationId!]?.didFetch ?? false;

 const getScrollContainer = useCallback(() => {
 return document.getElementById(CHAT_SCROLL_CONTAINER_ID);
 }, []);

 useEffect(() => {
 const lastMessage = selectConvesation?.lastMessage;
 if (!lastMessage) return;
 const seenBy = selectConvesation?.seenBy ?? [];
 setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
 }, [selectConvesation]);

 // Initial load when switching to a conversation that has no cached messages
 useEffect(() => {
 if (!activeConversationId) return;
 const existing = allMessages[activeConversationId];
 if (!existing?.items?.length) {
 fetchMessages(activeConversationId);
 }
 }, [activeConversationId, allMessages, fetchMessages]);

 // When switching conversations, scroll to bottom ONCE.
 // We set prevActiveIdRef so the auto-scroll effect below doesn't fire
 // prematurely while the new batch of messages is loading.
 useLayoutEffect(() => {
 if (activeConversationId && activeConversationId !== prevActiveIdRef.current) {
 prevActiveIdRef.current = activeConversationId;
 prevLastMessageIdRef.current = null;
 if (messageEndRef.current) {
 messageEndRef.current.scrollIntoView({ block: "end" });
 }
 }
 });

 // Auto-scroll only when a new message is appended at the bottom.
 // Do not force-scroll when older messages are prepended during pagination.
 useEffect(() => {
 if (!lastMessageId) return;
 // Only scroll if prevLastMessageIdRef is already set (not a fresh switch)
 if (prevLastMessageIdRef.current === null) return;

 const isNewBottomMessage = prevLastMessageIdRef.current !== lastMessageId;

 if (isNewBottomMessage) {
 if (!messageEndRef.current) return;
 messageEndRef.current.scrollIntoView({
 block: "end",
 behavior: "smooth",
 });
 }
 prevLastMessageIdRef.current = lastMessageId;
 }, [lastMessageId]);

 const handleLoadMore = useCallback(() => {
 if (!activeConversationId || messageLoading || !hasMore) return;
 const container = getScrollContainer();
 if (container) {
 prependAnchorRef.current = {
 prevHeight: container.scrollHeight,
 prevTop: container.scrollTop,
 };
 }
 fetchMessages(activeConversationId);
 }, [
 activeConversationId,
 fetchMessages,
 getScrollContainer,
 hasMore,
 messageLoading,
 ]);

 useEffect(() => {
 const container = getScrollContainer();
 if (!container) return;

 const onScroll = () => {
 if (container.scrollTop <= 80) {
 handleLoadMore();
 }
 };

 container.addEventListener("scroll", onScroll);
 return () => container.removeEventListener("scroll", onScroll);
 }, [getScrollContainer, handleLoadMore, activeConversationId]);

 useLayoutEffect(() => {
 const anchor = prependAnchorRef.current;
 if (!anchor) return;
 const container = getScrollContainer();
 if (!container) return;

 container.scrollTop =
 container.scrollHeight - anchor.prevHeight + anchor.prevTop;
 prependAnchorRef.current = null;
 }, [messages.length, getScrollContainer]);

 if (!selectConvesation) return <EmptyStateMain />;
 if (!didFetchForActive || messageLoading) return <EmptyChatState />;
 if (!messages?.length) return <EmptyChatState />;

 return (
 <div className="flex flex-col gap-1 p-4">
 {messageLoading && hasMore && (
 <p className="py-2 text-center text-xs font-bold text-stone-400">
 Loading...
 </p>
 )}
 {messages.map((item, index) => (
 <MessageItem
 key={item._id ?? index}
 message={item}
 index={index}
 messages={messages}
 selectedConvo={selectConvesation}
 lastMessageStatus={lastMessageStatus}
 />
 ))}
 <div ref={messageEndRef}></div>
 </div>
 );
}

interface MessageItemProps {
 message: Message;
 index: number;
 messages: Message[];
 selectedConvo: Conversation;
 lastMessageStatus: "delivered" | "seen";
}

function MessageItem({
 message,
 index,
 messages,
 selectedConvo,
 lastMessageStatus,
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
 className={`flex h-12 w-12 items-center justify-center border-4 border-on-surface text-sm font-black ${
 isOwn ? "bg-primary-container" : "bg-white"
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
 className={`text-[10px] font-black uppercase tracking-widest text-stone-400 ${
 isOwn ? "mr-1" : "ml-1"
 }`}
 >
 {isOwn ? "You" : participant?.displayName} •{" "}
 {formatMessageTime(new Date(message.createdAt))}
 </span>
 )}

 {/* Bubble */}
 <div
 className={`editorial-shadow relative border-4 border-black p-4 ${
 isOwn ? "bg-primary-container" : "bg-surface-container-lowest"
 }`}
 >
 <p className="font-body text-on-background">{message.content}</p>
 </div>

 {shouldShowStatus && (
 <div className="mr-1 mt-1 flex items-center justify-end">
 <MessageStatusIcon
 status={lastMessageStatus}
 participant={otherUser}
 />
 </div>
 )}
 </div>
 </div>
 );
}

function MessageStatusIcon({
 status,
 participant,
}: {
 status: "delivered" | "seen";
 participant?: Participant;
}) {
 if (status === "delivered") {
 return (
 <span className="text-xs text-gray-400">
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
 <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
 {participant?.displayName?.charAt(0)}
 </div>
 );
 }

 return null;
}
