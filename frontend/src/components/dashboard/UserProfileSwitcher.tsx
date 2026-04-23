"use client";

import { avatarUrl } from "@/lib/data";
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
        className="flex cursor-pointer items-center justify-between border-t-4 border-black bg-[#f9f3e1] p-4 transition-colors hover:bg-[#eee8d5]"
      >
        {/* Left */}
        <div className="flex items-center gap-3 overflow-hidden">
          <Image
            src={user?.avatarUrl || avatarUrl}
            alt="User profile"
            className="h-10 w-10 flex-shrink-0 border-2 border-black object-cover"
            width={40}
            height={40}
          />
          <div className="overflow-hidden">
            <p className="truncate text-xs font-black uppercase tracking-tighter">
              {user?.displayName}
            </p>
            <p className="truncate text-[10px] font-bold text-stone-500">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* Right icon */}
        <EllipsisVertical />
      </div>
      <ProfileModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
