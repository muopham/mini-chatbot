"use client";

import { avatarUrl } from "@/lib/data";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { chat } from "@/lib/chat";
import Image from "next/image";
import { X, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface GroupCreateModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export default function GroupCreateModal({
 isOpen,
 onClose,
}: GroupCreateModalProps) {
 const { allFriends, fetchAllFriends } = useFriendsStore();
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
 }, [isOpen]);

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
 await chat.createGroup(name.trim(), selected);
 await useChatStore.getState().fetchConversation();
 toast.success(`Group "${name}" created!`);
 onClose();
 } catch (err: any) {
 toast.error(err?.response?.data?.message || "Failed to create group.");
 } finally {
 setLoading(false);
 }
 };

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
 <h3 className="font-headline text-2xl font-black uppercase">
 Create Group
 </h3>
 <button
 onClick={onClose}
 className="flex size-10 items-center justify-center border-2 border-black bg-white transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11]"
 >
 <X size={18} strokeWidth={3} />
 </button>
 </div>

 {/* Body */}
 <div className="flex flex-col gap-6 p-6">
 {/* Group name */}
 <div>
 <label className="text-xs font-black uppercase tracking-widest">
 Group Name
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Enter group name..."
 className="mt-2 w-full border-4 border-black bg-white p-3 font-bold placeholder:text-stone-300 focus:outline-none"
 />
 </div>

 {/* Members */}
 <div>
 <label className="text-xs font-black uppercase tracking-widest">
 Select Members ({selected.length})
 </label>
 {allFriends.length === 0 ? (
 <p className="mt-2 text-xs font-bold text-stone-400">
 No friends yet. Add friends first!
 </p>
 ) : (
  <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
 {allFriends.map((friend) => {
 const other =
 friend.userA._id !== undefined
 ? friend.userA
 : friend.userB;
 const isSelected = selected.includes(other._id);
 return (
 <li key={friend._id}>
 <button
 type="button"
 onClick={() => toggleMember(other._id)}
 className={`flex w-full items-center gap-3 border-4 p-3 transition-all ${
 isSelected
 ? "border-black bg-primary-container"
 : "border-transparent bg-white hover:border-stone-300"
 }`}
 >
 <Image
 src={other.avatarUrl || avatarUrl}
 alt={other.displayName}
 width={32}
 height={32}
 className="h-8 w-8 border-2 border-black object-cover"
 />
 <div className="min-w-0 flex-1 text-left">
 <p className="truncate text-xs font-black uppercase">
 {other.displayName}
 </p>
 <p className="truncate text-[10px] font-bold text-stone-500">
 @{other.username}
 </p>
 </div>
 <div
 className={`flex size-6 items-center justify-center border-2 border-black ${
 isSelected ? "bg-black text-white" : "bg-white"
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
 <div className="flex gap-3 border-t-4 border-black p-6">
 <button
 onClick={onClose}
 className="flex-1 border-4 border-black bg-white py-3 font-black uppercase shadow-[4px_4px_0px_0px_#1E1C11] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
 >
 Cancel
 </button>
 <button
 onClick={handleCreate}
 disabled={loading || !name.trim() || selected.length === 0}
 className="flex flex-1 items-center justify-center gap-2 border-4 border-black bg-yellow-300 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#1E1C11] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
 >
 {loading && <Loader2 size={14} className="animate-spin" />}
 Create Group
 </button>
 </div>
 </div>
 </div>
 );
}
