"use client";

import Image from "next/image";
import { Check, XCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { DEFAULT_AVATAR_URL } from "@/shared/constants/chat";
import type { FriendRequest } from "@/lib/friends";

interface FriendRequestListProps {
  friendRequests: FriendRequest[];
  itemClassName?: string;
  onAccept: (requestId: string) => Promise<void>;
  onDecline: (requestId: string) => Promise<void>;
  onStartChat?: (userId: string) => Promise<void> | void;
}

export default function FriendRequestList({
  friendRequests,
  itemClassName = "",
  onAccept,
  onDecline,
  onStartChat,
}: FriendRequestListProps) {
  const [actionId, setActionId] = useState<string | null>(null);

  if (friendRequests.length === 0) {
    return (
      <div className="py-12 text-center">
        <span className="material-symbols-outlined text-5xl text-stone-300">
          person_search
        </span>
        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-stone-400">
          No pending requests
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {friendRequests.map((req) => {
        const from = req.from;
        return (
          <li
            key={req._id}
            className={`editorial-shadow flex items-center gap-3 border-4 border-black bg-white p-4 dark:border-dark-border dark:bg-dark-bg-card ${itemClassName}`}
          >
            <Image
              src={from?.avatarUrl || DEFAULT_AVATAR_URL}
              alt={from?.displayName || "User"}
              width={48}
              height={48}
              className="h-12 w-12 flex-shrink-0 border-2 border-black object-cover dark:border-dark-border-subtle"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black uppercase dark:text-dark-text-primary">
                {from?.displayName}
              </p>
              <p className="truncate text-xs font-bold text-stone-500 dark:text-dark-text-tertiary">
                @{from?.username}
              </p>
              {req.message && (
                <p className="mt-1 truncate text-xs italic text-stone-400 dark:text-dark-text-tertiary">
                  &ldquo;{req.message}&rdquo;
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  setActionId(req._id);
                  try {
                    await onAccept(req._id);
                    if (onStartChat) {
                      toast.success(
                        `You are now friends with ${from?.displayName}!`,
                        {
                          action: {
                            label: "Send message",
                            onClick: () => onStartChat(from._id),
                          },
                          duration: 5000,
                        }
                      );
                    } else {
                      toast.success(
                        `You are now friends with ${from?.displayName}!`
                      );
                    }
                  } catch {
                    toast.error("Failed to accept request.");
                  } finally {
                    setActionId(null);
                  }
                }}
                disabled={actionId === req._id}
                className="flex size-9 items-center justify-center border-2 border-black bg-green-400 transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] disabled:opacity-50 dark:border-green-400 dark:bg-green-600"
                title="Accept"
              >
                {actionId === req._id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} strokeWidth={3} />
                )}
              </button>
              <button
                onClick={async () => {
                  setActionId(req._id);
                  try {
                    await onDecline(req._id);
                    toast.success("Request declined.");
                  } catch {
                    toast.error("Failed to decline request.");
                  } finally {
                    setActionId(null);
                  }
                }}
                disabled={actionId === req._id}
                className="flex size-9 items-center justify-center border-2 border-black bg-red-400 transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] disabled:opacity-50 dark:border-red-400 dark:bg-red-700"
                title="Decline"
              >
                <XCircle size={14} strokeWidth={3} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
