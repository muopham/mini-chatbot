"use client";

import { DEFAULT_AVATAR_URL } from "@/shared/constants/chat";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Image from "next/image";
import { useState } from "react";
import ProfileModal from "../layout/ProfileModal";
import { EllipsisVertical } from "lucide-react";

export default function UserProfileSwitcher() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center justify-between border-t-4 border-black dark:border-dark-border bg-[#f9f3e1] dark:bg-dark-bg-card p-4 transition-colors hover:bg-[#eee8d5] dark:hover:bg-dark-bg-input"
      >
        {/* Left */}
        <div className="flex items-center gap-3 overflow-hidden">
          <Image
            src={user?.avatarUrl || DEFAULT_AVATAR_URL}
            alt="User profile"
            className="h-10 w-10 flex-shrink-0 border-2 border-black dark:border-dark-border-subtle object-cover"
            width={40}
            height={40}
          />
          <div className="overflow-hidden">
            <p className="truncate text-xs font-black uppercase tracking-tighter dark:text-dark-text-primary">
              {user?.displayName}
            </p>
            <p className="truncate text-[10px] font-bold text-stone-500 dark:text-dark-text-tertiary">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* Right icon */}
        <EllipsisVertical className="dark:text-dark-text-tertiary" />
      </div>
      <ProfileModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
