"use client";
import { useChatStore } from "@/lib/store/useChatStore";
import EmptyStateMain from "../dashboard/EmptyStateMain";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatInput from "./ChatWindowInput";
import ChatWindowMessage from "./ChatWindowMessage";
import { useEffect } from "react";

export default function ChatWindow() {
  const {
    activeConversationId,
    conversations,
    markAsSeen,
  } = useChatStore();

  const selectedConversation =
    conversations.find((item) => item._id === activeConversationId) ?? null;

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
    <main className="flex flex-1 flex-col bg-surface-container">
      {/* Chat Header */}
      <ChatWindowHeader chat={selectedConversation} />
      {/* Messages */}
      <div
        id="chat-window-scroll-container"
        className="flex flex-1 flex-col gap-8 overflow-y-auto p-8 pb-16"
      >
        <ChatWindowMessage />
      </div>
      {/* Input Area */}
      <ChatInput selectedConversation={selectedConversation} />
    </main>
  );
}
