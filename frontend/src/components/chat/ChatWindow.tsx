"use client";
import { useChatStore } from "@/lib/store/useChatStore";
import EmptyStateMain from "../dashboard/EmptyStateMain";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatInput from "./ChatWindowInput";
import ChatWindowMessage from "./ChatWindowMessage";
import InfoPanel from "./InfoPanel";
import { useEffect, useState } from "react";
import { CHAT_SCROLL_CONTAINER_ID } from "@/shared/constants/chat";

export default function ChatWindow() {
  const {
    activeConversationId,
    conversations,
    markAsSeen,
  } = useChatStore();
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const selectedConversation =
    conversations.find((item) => item._id === activeConversationId) ?? null;

  useEffect(() => {
    setMessageSearchQuery("");
    setShowInfo(false);
  }, [activeConversationId]);

  useEffect(() => {
    if (!selectedConversation) return;
    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.log(error);
      }
    };
    markSeen();
  }, [markAsSeen, selectedConversation]);

  if (!selectedConversation) return <EmptyStateMain />;

  return (
    <div className="flex min-h-0 flex-1">
      <main className="flex min-h-0 flex-1 flex-col bg-surface-container dark:bg-dark-bg-surface">
        {/* Chat Header */}
        <ChatWindowHeader
          chat={selectedConversation}
          messageSearchQuery={messageSearchQuery}
          onMessageSearchChange={setMessageSearchQuery}
          onToggleInfo={() => setShowInfo((prev) => !prev)}
        />
        {/* Messages */}
        <div
          id={CHAT_SCROLL_CONTAINER_ID}
          className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 pb-12 md:gap-8 md:p-8 md:pb-16"
        >
          <ChatWindowMessage searchQuery={messageSearchQuery} />
        </div>
        {/* Input Area */}
        <ChatInput selectedConversation={selectedConversation} />
      </main>
      {showInfo && (
        <InfoPanel
          conversation={selectedConversation}
          onClose={() => setShowInfo(false)}
        />
      )}
    </div>
  );
}
