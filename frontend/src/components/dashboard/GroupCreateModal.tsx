"use client";

import { DEFAULT_AVATAR_URL } from "@/shared/constants/chat";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { chat } from "@/lib/chat";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useSocketStore } from "@/lib/store/useSocketStore";
import Image from "next/image";
import { X, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupCreateModal({
  isOpen,
  onClose,
}: GroupCreateModalProps) {
  const { allFriends, fetchAllFriends } = useFriendsStore();
  const { user } = useAuthStore();
  const { socket } = useSocketStore();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      fetchAllFriends();
      setName("");
      setSelected([]);
    }
  }, [fetchAllFriends, isOpen]);

  const toggleMember = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Group name is required.");
      return;
    }
    if (selected.length === 0) {
      toast.error("Please select at least one member.");
      return;
    }
    setLoading(true);
    try {
      const conversation = await chat.createGroup(name.trim(), selected);
      useChatStore.getState().setActiveConversation(conversation._id);
      socket?.emit("join-conversation", conversation._id);
      await useChatStore.getState().fetchConversation();
      toast.success(`Group "${name}" created!`);
      onClose();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message as string | undefined)
          : undefined;
      toast.error(message || "Failed to create group.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col overflow-hidden border-4 border-black dark:border-dark-border bg-[#fff9e8] dark:bg-dark-bg-card shadow-[12px_12px_0px_0px_#1E1C11] dark:shadow-amber-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black dark:border-dark-border bg-yellow-300 dark:bg-dark-bg-sidebar p-6">
          <h3 className="font-headline text-2xl font-black uppercase dark:text-dark-text-primary">
            Create Group
          </h3>
          <button
            onClick={onClose}
            className="flex size-10 items-center justify-center border-2 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-card transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] dark:hover:shadow-amber-subtle"
          >
            <X size={18} strokeWidth={3} className="dark:text-dark-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6">
          {/* Group name */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest dark:text-dark-text-secondary">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name..."
              className="mt-2 w-full border-4 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-input p-3 font-bold text-on-surface dark:text-dark-text-primary placeholder:text-stone-300 dark:placeholder:text-dark-text-tertiary focus:outline-none"
            />
          </div>

          {/* Members */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest dark:text-dark-text-secondary">
              Select Members ({selected.length})
            </label>
            {allFriends.length === 0 ? (
              <p className="mt-2 text-xs font-bold text-stone-400 dark:text-dark-text-tertiary">
                No friends yet. Add friends first!
              </p>
            ) : (
              <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
                {allFriends.map((friend) => {
                  const other =
                    friend.userA._id === user?.id ? friend.userB : friend.userA;
                  const isSelected = selected.includes(other._id);
                  return (
                    <li key={friend._id}>
                      <button
                        type="button"
                        onClick={() => toggleMember(other._id)}
                        className={`flex w-full items-center gap-3 border-4 p-3 transition-all ${
                          isSelected
                            ? "border-black dark:border-dark-accent bg-primary-container dark:bg-dark-accent/15"
                            : "border-transparent bg-white dark:bg-dark-bg-card hover:border-stone-300 dark:hover:border-dark-border-subtle"
                        }`}
                      >
                        <Image
                          src={other.avatarUrl || DEFAULT_AVATAR_URL}
                          alt={other.displayName}
                          width={32}
                          height={32}
                          className="h-8 w-8 border-2 border-black dark:border-dark-border-subtle object-cover"
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <p className="truncate text-xs font-black uppercase dark:text-dark-text-primary">
                            {other.displayName}
                          </p>
                          <p className="truncate text-[10px] font-bold text-stone-500 dark:text-dark-text-tertiary">
                            @{other.username}
                          </p>
                        </div>
                        <div
                          className={`flex size-6 items-center justify-center border-2 border-black dark:border-dark-border ${
                            isSelected ? "bg-black dark:bg-dark-accent text-white dark:text-dark-accent-on" : "bg-white dark:bg-dark-bg-card"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t-4 border-black dark:border-dark-border p-6">
          <button
            onClick={onClose}
            className="flex-1 border-4 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-card py-3 font-black uppercase text-on-surface dark:text-dark-text-primary shadow-[4px_4px_0px_0px_#1E1C11] dark:shadow-amber transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim() || selected.length === 0}
            className="flex flex-1 items-center justify-center gap-2 border-4 border-black dark:border-dark-accent-deep bg-yellow-300 dark:bg-dark-accent-deep py-3 font-black uppercase text-on-surface dark:text-dark-accent-on shadow-[4px_4px_0px_0px_#1E1C11] dark:shadow-amber-send transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Create Group
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
