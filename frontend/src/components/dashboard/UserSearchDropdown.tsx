"use client";

import { avatarUrl } from "@/lib/data";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Image from "next/image";
import { UserPlus, Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface UserSearchDropdownProps {
  query: string;
  onClose: () => void;
}

export default function UserSearchDropdown({
  query,
  onClose,
}: UserSearchDropdownProps) {
  const {
    searchResults,
    searchLoading,
    sentRequests,
    allFriends,
    sendRequest,
    fetchSentRequests,
  } = useFriendsStore();
  const { user } = useAuthStore();
  const [sendingId, setSendingId] = useState<string | null>(null);

  const filtered = searchResults.filter((u) => u._id !== user?.id);

  const isPending = (userId: string) => sentRequests.includes(userId);
  const isFriend = (userId: string) =>
    allFriends.some((f) => f.userA._id === userId || f.userB._id === userId);

  const handleSendRequest = async (userId: string, displayName: string) => {
    setSendingId(userId);
    try {
      await sendRequest(userId);
      // Optimistically add to sentRequests
      useFriendsStore.setState((s) => ({
        sentRequests: [...s.sentRequests, userId],
      }));
      toast.success(`Friend request sent to ${displayName}!`);
    } catch {
      toast.error("Failed to send friend request.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 border-4 border-black bg-white shadow-[4px_4px_0px_0px_#1E1C11]">
      {searchLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="animate-spin" size={16} />
          <span className="ml-2 text-xs font-bold">Searching...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-4 text-center text-xs font-bold text-stone-400">
          No users found
        </div>
      ) : (
        <ul>
          {filtered.map((u) => {
            const pending = isPending(u._id);
            const friend = isFriend(u._id);
            const isActionable = !pending && !friend;

            return (
              <li
                key={u._id}
                className="flex items-center gap-3 border-b border-black/10 p-3 last:border-0 hover:bg-surface-container-lowest"
              >
                <Image
                  src={u.avatarUrl || avatarUrl}
                  alt={u.displayName}
                  width={36}
                  height={36}
                  className="h-9 w-9 flex-shrink-0 border-2 border-black object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black uppercase">
                    {u.displayName}
                  </p>
                  <p className="truncate text-[10px] font-bold text-stone-500">
                    @{u.username}
                  </p>
                </div>
                {friend ? (
                  <span
                    className="flex size-8 flex-shrink-0 items-center justify-center border-2 border-black bg-stone-200 text-stone-400"
                    title="Already friends"
                  >
                    <UserCheck size={12} />
                  </span>
                ) : pending ? (
                  <span
                    className="flex size-8 flex-shrink-0 items-center justify-center border-2 border-black bg-stone-200 text-stone-400"
                    title="Request pending"
                  >
                    <Loader2 size={12} className="animate-spin" />
                  </span>
                ) : (
                  <button
                    onClick={async () => {
                      await handleSendRequest(u._id, u.displayName);
                    }}
                    disabled={sendingId === u._id}
                    className="flex size-8 flex-shrink-0 items-center justify-center border-2 border-black bg-primary-container text-xs transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] disabled:opacity-50"
                    title="Send friend request"
                  >
                    {sendingId === u._id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <UserPlus size={12} />
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
