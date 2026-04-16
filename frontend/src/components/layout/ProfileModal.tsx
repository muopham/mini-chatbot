"use client";

import { avatarUrl } from "@/lib/data";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { User } from "@/types/user";
import { Pencil, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type ProfileModalProps = {
 isOpen: boolean;
 onClose: () => void;
 user: User;
};

export default function ProfileModal({
 isOpen,
 onClose,
 user,
}: ProfileModalProps) {
 const { updateProfile, loading } = useAuthStore();
 const [mounted, setMounted] = useState(false);
 const [displayName, setDisplayName] = useState(user?.displayName || "");
 const [bio, setBio] = useState("");
 const [saving, setSaving] = useState(false);

 useEffect(() => {
 setMounted(true);
 if (user) {
 setDisplayName(user.displayName || "");
 setBio("");
 }
 }, [user]);

 const handleSave = async () => {
 if (!displayName.trim()) {
 toast.error("Display name cannot be empty.");
 return;
 }
 setSaving(true);
 try {
 await updateProfile(displayName.trim(), bio.trim() || undefined);
 onClose();
 } catch {
 // error toast handled in store
 } finally {
 setSaving(false);
 }
 };

 if (!isOpen || !mounted) return null;
 return createPortal(
 <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-8 backdrop-blur-sm">
 {/* Modal */}
 <div className="flex w-full max-w-2xl flex-col overflow-hidden border-4 border-black bg-[#fff9e8] shadow-[12px_12px_0px_0px_#1E1C11] md:flex-row">
 {/* Sidebar */}
 <div className="flex flex-col gap-6 border-r-4 border-black bg-yellow-300 p-8 md:w-1/3">
 <div className="relative mx-auto h-32 w-32 border-4 border-black bg-white shadow-[4px_4px_0px_0px_#1E1C11]">
 <Image
 src={user?.avatarUrl || avatarUrl}
 alt="avatar"
 width={128}
 height={128}
 className="h-full w-full object-cover"
 />
 <div className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center border-2 border-black bg-orange-500">
 <Pencil />
 </div>
 </div>

 <div className="text-center">
 <h2 className="mb-1 text-2xl font-black uppercase tracking-tight">
 {user?.displayName}
 </h2>
 </div>

 <div className="mt-auto space-y-2">
 <p className="text-[10px] font-black uppercase opacity-60">Username</p>
 <p className="break-all text-sm font-bold">@{user?.username}</p>
 </div>
 </div>

 {/* Content */}
 <div className="flex flex-1 flex-col gap-8 p-8 md:p-10">
 <div className="flex items-start justify-between">
 <h3 className="text-3xl font-black uppercase">Profile Settings</h3>
 <button onClick={onClose}>
 <X strokeWidth={3} />
 </button>
 </div>

 {/* Displayname */}
 <div>
 <label className="text-xs font-black uppercase">Display Name</label>
 <input
 type="text"
 value={displayName}
 onChange={(e) => setDisplayName(e.target.value)}
 placeholder={user?.displayName}
 className="mt-2 w-full border-4 border-black bg-white p-3 font-bold placeholder:text-stone-300 focus:outline-none"
 />
 </div>

 {/* Bio */}
 <div>
 <label className="text-xs font-black uppercase">
 Bio <span className="font-normal text-stone-400">(optional)</span>
 </label>
 <textarea
 value={bio}
 onChange={(e) => setBio(e.target.value)}
 placeholder={user?.avatarUrl ? "" : "Tell us about yourself..."}
 rows={3}
 className="mt-2 w-full resize-none border-4 border-black bg-white p-3 font-bold placeholder:text-stone-300 focus:outline-none"
 />
 </div>

 {/* Email (read-only) */}
 <div>
 <label className="text-xs font-black uppercase">Email Address</label>
 <input
 type="email"
 value={user?.email}
 readOnly
 className="mt-2 w-full cursor-not-allowed border-4 border-black bg-stone-100 p-3 font-bold text-stone-400"
 />
 </div>

 {/* Actions */}
 <div className="flex gap-4">
 <button
 onClick={onClose}
 className="flex-1 border-4 border-black bg-white py-3 font-black uppercase shadow-[4px_4px_0px_0px_#1E1C11] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
 >
 Cancel
 </button>
 <button
 onClick={handleSave}
 disabled={saving || loading}
 className="editorial-active flex flex-1 items-center justify-center gap-2 border-4 border-black bg-yellow-300 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#1E1C11]"
 >
 {saving && <Loader2 size={14} className="animate-spin" />}
 Save Changes
 </button>
 </div>
 </div>
 </div>
 </div>,
 document.body
 );
}
