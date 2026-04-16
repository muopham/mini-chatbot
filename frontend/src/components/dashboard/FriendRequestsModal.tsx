"use client";

import React, { useEffect, useState } from "react";
import { avatarUrl } from "@/lib/data";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import Image from "next/image";
import { X, Check, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FriendRequestsModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export default function FriendRequestsModal({
 isOpen,
 onClose,
}: FriendRequestsModalProps) {
 const { friendRequests, requestsLoading, fetchRequests, acceptRequest, declineRequest } =
 useFriendsStore();
 const [actionId, setActionId] = useState<string | null>(null);
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 if (isOpen) {
 fetchRequests();
 }
 }, [isOpen]);

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
 {friendRequests.length} request{friendRequests.length !== 1 ? "s" : ""}
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
 ) : friendRequests.length === 0 ? (
 <div className="py-12 text-center">
 <span className="material-symbols-outlined text-5xl text-stone-300">
 person_search
 </span>
 <p className="mt-4 text-sm font-bold uppercase tracking-widest text-stone-400">
 No pending requests
 </p>
 </div>
 ) : (
 <ul className="space-y-3">
 {friendRequests.map((req) => {
 const from = req.from;
 return (
 <li
 key={req._id}
 className="editorial-shadow flex items-center gap-3 border-4 border-black bg-white p-4"
 >
 <Image
 src={from?.avatarUrl || avatarUrl}
 alt={from?.displayName || "User"}
 width={48}
 height={48}
 className="h-12 w-12 flex-shrink-0 border-2 border-black object-cover"
 />
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-black uppercase">
 {from?.displayName}
 </p>
 <p className="truncate text-xs font-bold text-stone-500">
 @{from?.username}
 </p>
 {req.message && (
 <p className="mt-1 truncate text-xs italic text-stone-400">
 &ldquo;{req.message}&rdquo;
 </p>
 )}
 </div>
 <div className="flex gap-2">
 <button
 onClick={async () => {
 setActionId(req._id);
 try {
 await acceptRequest(req._id);
 toast.success(`You are now friends with ${from?.displayName}!`);
 } catch {
 toast.error("Failed to accept request.");
 } finally {
 setActionId(null);
 }
 }}
 disabled={actionId === req._id}
 className="flex size-9 items-center justify-center border-2 border-black bg-green-400 transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] disabled:opacity-50"
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
 await declineRequest(req._id);
 toast.success("Request declined.");
 } catch {
 toast.error("Failed to decline request.");
 } finally {
 setActionId(null);
 }
 }}
 disabled={actionId === req._id}
 className="flex size-9 items-center justify-center border-2 border-black bg-red-400 transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] disabled:opacity-50"
 title="Decline"
 >
 <XCircle size={14} strokeWidth={3} />
 </button>
 </div>
 </li>
 );
 })}
 </ul>
 )}
 </div>
 </div>
 </div>
 );
}
