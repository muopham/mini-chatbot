"use client";

import { useState } from "react";
import Image from "next/image";
import { messages, contacts } from "@/lib/data";
import type { Message } from "@/types";

const activeContact = contacts[0];

function MessageBubble({ msg }: { msg: Message }) {
  const isMine = msg.senderId === "me";

  if (msg.type === "image") {
    return (
      <div className="flex max-w-[80%] flex-col items-start">
        <div className="editorial-shadow relative border-4 border-black bg-surface-container-lowest p-2">
          <Image
            src={msg.imageUrl!}
            alt={msg.fileName ?? "image"}
            width={400}
            height={225}
            className="aspect-video w-full border-2 border-black object-cover"
          />
          <p className="p-2 text-sm font-bold">{msg.fileName}</p>
          <div className="absolute -bottom-6 left-0 font-headline text-[10px] font-black uppercase text-stone-400">
            {msg.timestamp}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex max-w-[80%] flex-col ${isMine ? "items-end self-end" : "items-start"}`}
    >
      <div
        className={`editorial-shadow relative border-4 border-black p-4 ${
          isMine ? "bg-accent-yellow" : "bg-surface-container-lowest"
        }`}
      >
        <p className="font-body text-on-background">{msg.content}</p>
        <div
          className={`absolute -bottom-6 font-headline text-[10px] font-black uppercase text-stone-400 ${
            isMine ? "right-0" : "left-0"
          }`}
        >
          {msg.timestamp}
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="flex flex-1 flex-col bg-surface-container">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b-4 border-black bg-surface p-6">
        <div className="flex items-center gap-4">
          <Image
            src={activeContact.avatar!}
            alt={activeContact.name}
            width={48}
            height={48}
            className="border-2 border-black"
          />
          <div>
            <h3 className="font-headline text-lg font-extrabold uppercase leading-none">
              {activeContact.name}
            </h3>
            <p className="flex items-center gap-1 text-xs font-bold text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined cursor-pointer hover:text-primary">
            search
          </span>
          <span className="material-symbols-outlined cursor-pointer hover:text-primary">
            more_vert
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-8 pb-16">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* Typing indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase text-stone-500">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-500" />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-500"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-500"
            style={{ animationDelay: "0.4s" }}
          />
          Anna is typing
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t-4 border-black bg-surface p-6">
        <div className="flex items-center gap-4">
          <button className="editorial-shadow editorial-active border-2 border-black bg-surface-container-high p-3">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="WRITE YOUR MESSAGE..."
              className="w-full border-4 border-black bg-surface-container-lowest p-4 font-bold placeholder:text-stone-400 focus:border-secondary focus:shadow-[4px_4px_0px_0px_#FB7800] focus:outline-none focus:ring-0"
            />
          </div>
          <button className="editorial-shadow editorial-active border-2 border-black bg-secondary-container p-4 text-white">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
