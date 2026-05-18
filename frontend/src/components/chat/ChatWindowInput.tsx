"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { Conversation } from "@/types/chat";
import { Smile } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import ImageUploadButton from "./ImageUploadButton";
import { TYPING_TIMEOUT_MS } from "@/shared/constants/chat";
const EmojiPicker = dynamic(() => import("./EmojiPicker"), {
  ssr: false,
  loading: () => (
    <div className="absolute bottom-14 right-0 z-50 border-2 border-black bg-surface p-4 text-xs font-black uppercase shadow-lg">
      Loading...
    </div>
  ),
});

export default function ChatInput({
  selectedConversation,
}: {
  selectedConversation: Conversation;
}) {
  const { user } = useAuthStore();
  const {
    sendDirectMessage,
    sendGroupMessage,
    clearTypingForConversation,
    setDraft,
    clearDraft,
  } = useChatStore();
  const { socket } = useSocketStore();
  const draft = useChatStore(
    (state) => state.drafts[selectedConversation._id] ?? ""
  );
  const [inputValue, setInputValue] = useState(draft);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitTyping = () => {
    if (!socket) return;
    socket.emit("typing", { conversationId: selectedConversation._id });
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("stop-typing", {
          conversationId: selectedConversation._id,
        });
      }
    }, TYPING_TIMEOUT_MS);
  };

  const emitStopTyping = () => {
    if (socket) {
      socket.emit("stop-typing", { conversationId: selectedConversation._id });
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const sendMessage = async (imgUrl?: string) => {
    if (!user) return;
    const content = inputValue.trim();
    if (!content && !imgUrl) return;
    emitStopTyping();
    const textToSend = content;
    setInputValue("");
    clearDraft(selectedConversation._id);
    try {
      if (selectedConversation.type === "direct") {
        const participants = selectedConversation.participants;
        const otherUser = participants.filter((p) => p._id !== user.id)[0];
        if (otherUser) {
          await sendDirectMessage(otherUser._id, textToSend, imgUrl);
        }
      } else {
        await sendGroupMessage(selectedConversation._id, textToSend, imgUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setInputValue((prev) => {
      const next = prev + emoji;
      setDraft(selectedConversation._id, next);
      return next;
    });
  };

  const handleImageUpload = async (url: string) => {
    setShowUpload(false);
    await sendMessage(url);
  };

  // Cleanup on unmount
  useEffect(() => {
    setInputValue(draft);
  }, [draft, selectedConversation._id]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.emit("stop-typing", {
          conversationId: selectedConversation._id,
        });
      }
      clearTypingForConversation(selectedConversation._id);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [clearTypingForConversation, selectedConversation._id, socket]);

  if (!user) return null;

  return (
    <div className="border-t-4 border-black bg-surface p-3 dark:border-dark-border dark:bg-dark-bg-sidebar md:p-6">
      {/* Upload panel */}
      {showUpload && (
        <div className="mb-4 border-4 border-black bg-surface-container p-4 dark:border-dark-border dark:bg-dark-bg-card">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-black uppercase dark:text-dark-text-primary">
              Attach Image
            </span>
            <button
              onClick={() => setShowUpload(false)}
              className="text-xs font-bold underline dark:text-dark-text-secondary"
            >
              Cancel
            </button>
          </div>
          <ImageUploadButton
            onUploadComplete={handleImageUpload}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-4">
        {/* Attach */}
        <button
          onClick={() => setShowUpload((prev) => !prev)}
          className="editorial-shadow editorial-active border-2 border-black bg-surface-container-high p-2 transition-all dark:border-dark-border-subtle dark:bg-dark-bg-card md:p-3"
        >
          <span className="material-symbols-outlined dark:text-dark-text-secondary">
            attach_file
          </span>
        </button>

        <div className="relative flex-1">
          <input
            onKeyPress={handleKeyPress}
            type="text"
            value={inputValue}
            onChange={(e) => {
              const nextValue = e.target.value;
              setInputValue(nextValue);
              if (nextValue) {
                setDraft(selectedConversation._id, nextValue);
              } else {
                clearDraft(selectedConversation._id);
              }
              emitTyping();
            }}
            placeholder="WRITE YOUR MESSAGE..."
            className="w-full border-4 border-black bg-surface-container-lowest p-3 pr-12 text-sm font-bold text-on-surface placeholder:text-stone-400 focus:border-secondary focus:shadow-[4px_4px_0px_0px_#FB7800] focus:outline-none dark:border-dark-border-subtle dark:bg-dark-bg-input dark:text-dark-text-primary dark:placeholder:text-dark-text-tertiary dark:focus:border-dark-accent dark:focus:shadow-amber-subtle md:p-4 md:pr-14 md:text-base"
          />

          <button
            onClick={() => setShowEmoji((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl dark:text-dark-text-secondary"
          >
            <Smile strokeWidth={3} />
          </button>

          {/* Picker */}
          {showEmoji && (
            <EmojiPicker
              onSelect={handleSelectEmoji}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </div>

        {/* Send */}
        <button
          onClick={() => sendMessage()}
          disabled={!inputValue.trim()}
          className="editorial-shadow editorial-active border-2 border-black bg-secondary-container p-3 text-white dark:border-dark-accent-deep dark:bg-dark-accent-deep md:p-4"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            send
          </span>
        </button>
      </div>
    </div>
  );
}
