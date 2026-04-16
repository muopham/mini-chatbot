"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { Conversation } from "@/types/chat";
import { Smile } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import EmojiPicker from "./EmojiPicker";
import ImageUploadButton from "./ImageUploadButton";

const TYPING_TIMEOUT = 2000;

export default function ChatInput({
 selectedConversation,
}: {
 selectedConversation: Conversation;
}) {
 const { user } = useAuthStore();
 const { sendDirectMessage, sendGroupMessage, clearTyping } = useChatStore();
 const { socket } = useSocketStore();
 const [inputValue, setInputValue] = useState("");
 const [showEmoji, setShowEmoji] = useState(false);
 const [showUpload, setShowUpload] = useState(false);
 const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 if (!user) return;

 const emitTyping = () => {
 if (!socket) return;
 socket.emit("typing", { conversationId: selectedConversation._id });
 if (typingTimerRef.current) {
 clearTimeout(typingTimerRef.current);
 }
 typingTimerRef.current = setTimeout(() => {
 if (socket) {
 socket.emit("stop-typing", { conversationId: selectedConversation._id });
 }
 }, TYPING_TIMEOUT);
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
 const content = inputValue.trim();
 if (!content && !imgUrl) return;
 emitStopTyping();
 const textToSend = content;
 setInputValue("");
 try {
 if (selectedConversation.type === "direct") {
 const participants = selectedConversation.participants;
 const otherUser = participants.filter((p) => p._id !== user.id)[0];
 await sendDirectMessage(otherUser._id, textToSend, imgUrl);
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
 setInputValue((prev) => prev + emoji);
 };

 const handleImageUpload = async (url: string) => {
 setShowUpload(false);
 await sendMessage(url);
 };

 // Cleanup on unmount
 useEffect(() => {
 return () => {
 emitStopTyping();
 };
 }, []);

 return (
 <div className="border-t-4 border-black bg-surface p-6">
 {/* Upload panel */}
 {showUpload && (
 <div className="mb-4 border-4 border-black bg-surface-container p-4">
 <div className="mb-2 flex items-center justify-between">
 <span className="text-xs font-black uppercase">Attach Image</span>
 <button
 onClick={() => setShowUpload(false)}
 className="text-xs font-bold underline"
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

 <div className="flex items-center gap-4">
 {/* Attach */}
 <button
 onClick={() => setShowUpload((prev) => !prev)}
 className="editorial-shadow editorial-active border-2 border-black bg-surface-container-high p-3 transition-all"
 >
 <span className="material-symbols-outlined">attach_file</span>
 </button>

 <div className="relative flex-1">
 <input
 onKeyPress={handleKeyPress}
 type="text"
 value={inputValue}
 onChange={(e) => {
 setInputValue(e.target.value);
 emitTyping();
 }}
 placeholder="WRITE YOUR MESSAGE..."
 className="w-full border-4 border-black bg-surface-container-lowest p-4 pr-14 font-bold placeholder:text-stone-400 focus:border-secondary focus:shadow-[4px_4px_0px_0px_#FB7800] focus:outline-none"
 />

 <button
 onClick={() => setShowEmoji((prev) => !prev)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
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
 className="editorial-shadow editorial-active border-2 border-black bg-secondary-container p-4 text-white"
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
