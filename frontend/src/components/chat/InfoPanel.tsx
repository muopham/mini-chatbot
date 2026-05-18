"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { Conversation, Participant } from "@/types/chat";
import { X, Users, Calendar, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { chat } from "@/lib/chat";

type InfoPanelProps = {
  conversation: Conversation;
  onClose: () => void;
};

type MediaItem = {
  _id: string;
  imgUrl: string;
  createdAt: string;
  sender: {
    _id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
};

export default function InfoPanel({ conversation, onClose }: InfoPanelProps) {
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);

  const otherParticipants = conversation.participants.filter(
    (p) => p._id !== user?.id
  );
  const isGroup = conversation.type === "group";

  const isValidAvatar = (url?: string | null) =>
    url &&
    (url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/"));

  const isOnline = (p: Participant) => onlineUsers.includes(p._id);

  const createdAt = conversation.createdAt
    ? new Date(conversation.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "Unknown";

  const createdByParticipant = conversation.group?.createdBy
    ? conversation.participants.find(
        (p) => p._id === conversation.group?.createdBy
      )
    : null;

  useEffect(() => {
    const fetchMedia = async () => {
      setMediaLoading(true);
      try {
        const res = await chat.fetchSharedMedia(conversation._id);
        setMedia(res.media ?? []);
      } catch {
        setMedia([]);
      } finally {
        setMediaLoading(false);
      }
    };
    fetchMedia();
  }, [conversation._id]);

  return (
    <aside className="flex h-full w-80 flex-col overflow-hidden border-l-4 border-black bg-[#F4EEDB] dark:border-dark-border dark:bg-dark-bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-black bg-yellow-300 p-4 dark:border-dark-border dark:bg-dark-bg-sidebar">
        <h3 className="text-sm font-black uppercase tracking-widest dark:text-dark-text-primary">
          {isGroup ? "Group Info" : "Contact Info"}
        </h3>
        <button onClick={onClose} className="dark:text-dark-text-secondary">
          <X strokeWidth={3} size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile card */}
        {isGroup ? (
          <div className="flex flex-col items-center border-b-4 border-black bg-surface p-6 text-center dark:border-dark-border dark:bg-dark-bg-card">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-black text-2xl font-bold text-white dark:border-dark-border-subtle dark:bg-dark-accent dark:text-dark-accent-on">
              {conversation.group?.name.charAt(0).toUpperCase() || "?"}
            </div>
            <h2 className="mt-3 font-headline text-lg font-black uppercase dark:text-dark-text-primary">
              {conversation.group?.name}
            </h2>
            <p className="mt-1 text-xs font-bold text-stone-500 dark:text-dark-text-tertiary">
              Created {createdAt}
            </p>
          </div>
        ) : otherParticipants.length === 1 ? (
          <div className="flex flex-col items-center border-b-4 border-black bg-surface p-6 text-center dark:border-dark-border dark:bg-dark-bg-card">
            {isValidAvatar(otherParticipants[0].avatarUrl) ? (
              <Image
                src={otherParticipants[0].avatarUrl!}
                alt={otherParticipants[0].displayName}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full border-4 border-black object-cover dark:border-dark-border-subtle"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-black text-2xl font-bold text-white dark:border-dark-border-subtle dark:bg-dark-accent dark:text-dark-accent-on">
                {otherParticipants[0].displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="mt-3 font-headline text-lg font-black uppercase dark:text-dark-text-primary">
              {otherParticipants[0].displayName}
            </h2>
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`h-2 w-2 rounded-full ${isOnline(otherParticipants[0]) ? "bg-green-500" : "bg-gray-400"}`}
              />
              <span className="text-xs font-bold text-stone-500 dark:text-dark-text-tertiary">
                {isOnline(otherParticipants[0]) ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        ) : null}

        {/* Shared Media */}
        <div className="border-b-4 border-black p-4 dark:border-dark-border">
          <div className="mb-3 flex items-center gap-2">
            <ImageIcon size={14} className="dark:text-dark-text-secondary" />
            <h4 className="text-xs font-black uppercase tracking-widest dark:text-dark-text-secondary">
              Shared Media ({media.length})
            </h4>
          </div>
          {mediaLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-stone-400" />
            </div>
          ) : media.length === 0 ? (
            <p className="py-6 text-center text-xs font-bold text-stone-400 dark:text-dark-text-tertiary">
              No shared media yet
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {media.map((item) => (
                <div
                  key={item._id}
                  className="group relative aspect-square cursor-pointer overflow-hidden border-2 border-black dark:border-dark-border-subtle"
                >
                  <Image
                    src={item.imgUrl}
                    alt="Shared media"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Participants (only for groups) */}
        {isGroup && (
          <div className="border-b-4 border-black p-4 dark:border-dark-border">
            <div className="mb-3 flex items-center gap-2">
              <Users size={14} className="dark:text-dark-text-secondary" />
              <h4 className="text-xs font-black uppercase tracking-widest dark:text-dark-text-secondary">
                {conversation.participants.length} Members
              </h4>
            </div>
            <div className="space-y-2">
              {conversation.participants.map((p) => {
                const isMe = p._id === user?.id;
                const online = isOnline(p);
                const name = isMe ? `${p.displayName} (You)` : p.displayName;

                return (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 rounded border-2 border-black bg-white p-2 dark:border-dark-border-subtle dark:bg-dark-bg-card"
                  >
                    {isValidAvatar(p.avatarUrl) ? (
                      <Image
                        src={p.avatarUrl!}
                        alt={name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full border-2 border-black object-cover dark:border-dark-border-subtle"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-xs font-bold text-white dark:border-dark-border-subtle dark:bg-dark-accent dark:text-dark-accent-on">
                        {p.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold dark:text-dark-text-primary">
                        {name}
                      </p>
                    </div>
                    <span
                      className={`h-2 w-2 flex-shrink-0 rounded-full ${online ? "bg-green-500" : "bg-gray-400"}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Conversation details */}
        <div className="border-b-4 border-black p-4 dark:border-dark-border">
          <div className="mb-3 flex items-center gap-2">
            <Calendar size={14} className="dark:text-dark-text-secondary" />
            <h4 className="text-xs font-black uppercase tracking-widest dark:text-dark-text-secondary">
              Details
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 dark:text-dark-text-tertiary">
                Type
              </span>
              <span className="text-xs font-black uppercase dark:text-dark-text-primary">
                {isGroup ? "Group" : "Direct"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 dark:text-dark-text-tertiary">
                Created
              </span>
              <span className="text-xs font-bold dark:text-dark-text-primary">
                {createdAt}
              </span>
            </div>
            {createdByParticipant && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-dark-text-tertiary">
                  Created by
                </span>
                <span className="text-xs font-bold dark:text-dark-text-primary">
                  {createdByParticipant.displayName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
