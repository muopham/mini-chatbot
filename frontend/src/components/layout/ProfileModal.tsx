"use client";

import { DEFAULT_AVATAR_URL } from "@/shared/constants/chat";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { upload } from "@/lib/upload";
import { Pencil, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  // Read user directly from store — always fresh, no stale prop
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync form when modal opens or user data changes
  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.displayName || "");
      setBio(user.bio || "");
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [isOpen, user]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleAvatarRemove = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      let newAvatarUrl: string | undefined;
      if (avatarFile) {
        setUploadingAvatar(true);
        try {
          newAvatarUrl = await upload.uploadImage(avatarFile);
        } finally {
          setUploadingAvatar(false);
        }
      }
      await updateProfile(
        displayName.trim(),
        bio.trim() || undefined,
        newAvatarUrl
      );
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
      <div className="flex w-full max-w-2xl flex-col overflow-hidden border-4 border-black dark:border-dark-border bg-[#fff9e8] dark:bg-dark-bg-card shadow-[12px_12px_0px_0px_#1E1C11] dark:shadow-amber-lg md:flex-row">
        {/* Sidebar */}
        <div className="flex flex-col gap-6 border-r-4 border-black dark:border-dark-border bg-yellow-300 dark:bg-dark-bg-sidebar p-8 md:w-1/3">
          <div className="relative mx-auto h-32 w-32 border-4 border-black dark:border-dark-border bg-white dark:bg-dark-bg-card shadow-[4px_4px_0px_0px_#1E1C11] dark:shadow-amber">
            <Image
              src={avatarPreview || user?.avatarUrl || DEFAULT_AVATAR_URL}
              alt="avatar"
              width={128}
              height={128}
              className="h-full w-full object-cover"
              unoptimized={!!avatarPreview}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center border-2 border-black bg-orange-500 transition-colors hover:bg-orange-400"
            >
              <Pencil size={14} />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
          </div>

          <div className="text-center">
            <h2 className="mb-1 text-2xl font-black uppercase tracking-tight dark:text-dark-text-primary">
              {user?.displayName}
            </h2>
            {avatarPreview && (
              <button
                onClick={handleAvatarRemove}
                className="text-[10px] font-bold uppercase text-stone-500 dark:text-dark-text-tertiary underline"
              >
                Remove preview
              </button>
            )}
          </div>

          <div className="mt-auto space-y-2">
            <p className="text-[10px] font-black uppercase opacity-60 dark:text-dark-text-secondary">
              Username
            </p>
            <p className="break-all text-sm font-bold dark:text-dark-text-primary">@{user?.username}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-8 p-8 md:p-10">
          <div className="flex items-start justify-between">
            <h3 className="text-3xl font-black uppercase dark:text-dark-text-primary">Profile Settings</h3>
            <button onClick={onClose} className="dark:text-dark-text-secondary">
              <X strokeWidth={3} />
            </button>
          </div>

          {/* Displayname */}
          <div>
            <label className="text-xs font-black uppercase dark:text-dark-text-secondary">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={user?.displayName}
              className="mt-2 w-full border-4 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-input p-3 font-bold text-on-surface dark:text-dark-text-primary placeholder:text-stone-300 dark:placeholder:text-dark-text-tertiary focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-black uppercase dark:text-dark-text-secondary">
              Bio <span className="font-normal text-stone-400 dark:text-dark-text-tertiary">(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="mt-2 w-full resize-none border-4 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-input p-3 font-bold text-on-surface dark:text-dark-text-primary placeholder:text-stone-300 dark:placeholder:text-dark-text-tertiary focus:outline-none"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-black uppercase dark:text-dark-text-secondary">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email}
              readOnly
              className="mt-2 w-full cursor-not-allowed border-4 border-black dark:border-dark-border-subtle bg-stone-100 dark:bg-dark-bg-input p-3 font-bold text-stone-400 dark:text-dark-text-tertiary"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 border-4 border-black dark:border-dark-border-subtle bg-white dark:bg-dark-bg-card py-3 font-black uppercase text-on-surface dark:text-dark-text-primary shadow-[4px_4px_0px_0px_#1E1C11] dark:shadow-amber transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || uploadingAvatar}
              className="editorial-active flex flex-1 items-center justify-center gap-2 border-4 border-black dark:border-dark-accent-deep bg-yellow-300 dark:bg-dark-accent-deep py-3 font-black uppercase text-on-surface dark:text-dark-accent-on shadow-[4px_4px_0px_0px_#1E1C11] dark:shadow-amber-send disabled:opacity-60"
            >
              {(saving || uploadingAvatar) ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {uploadingAvatar ? "Uploading..." : "Saving..."}
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
