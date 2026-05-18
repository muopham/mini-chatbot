"use client";

import React, { useEffect, useState } from "react";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { X, Loader2 } from "lucide-react";
import FriendRequestList from "./FriendRequestList";

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FriendRequestsModal({
  isOpen,
  onClose,
}: FriendRequestsModalProps) {
  const {
    friendRequests,
    requestsLoading,
    fetchRequests,
    acceptRequest,
    declineRequest,
  } = useFriendsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      fetchRequests();
    }
  }, [fetchRequests, isOpen]);

  if (!isOpen || !mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col overflow-hidden border-4 border-black bg-[#fff9e8] shadow-[12px_12px_0px_0px_#1E1C11]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black bg-yellow-300 p-6">
          <div>
            <h3 className="font-headline text-2xl font-black uppercase">
              Friend Requests
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-600">
              {friendRequests.length} request
              {friendRequests.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-10 items-center justify-center border-2 border-black bg-white transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11]"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {requestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <FriendRequestList
              friendRequests={friendRequests}
              onAccept={acceptRequest}
              onDecline={declineRequest}
            />
          )}
        </div>
      </div>
    </div>
  );
}
