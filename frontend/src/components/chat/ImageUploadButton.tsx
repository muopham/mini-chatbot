"use client";

import { useRef, useState } from "react";
import { upload } from "@/lib/upload";
import { toast } from "sonner";
import { X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadButtonProps {
 onUploadComplete: (url: string) => void;
 onCancel: () => void;
}

export default function ImageUploadButton({
 onUploadComplete,
 onCancel,
}: ImageUploadButtonProps) {
 const inputRef = useRef<HTMLInputElement>(null);
 const [preview, setPreview] = useState<string | null>(null);
 const [uploading, setUploading] = useState(false);
 const [selectedFile, setSelectedFile] = useState<File | null>(null);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setSelectedFile(file);
 const reader = new FileReader();
 reader.onload = (ev) => setPreview(ev.target?.result as string);
 reader.readAsDataURL(file);
 };

 const handleUpload = async () => {
 if (!selectedFile) return;
 setUploading(true);
 try {
 const url = await upload.uploadImage(selectedFile);
 onUploadComplete(url);
 } catch {
 toast.error("Failed to upload image. Please try again.");
 setUploading(false);
 }
 };

 const handleCancel = () => {
 if (preview) URL.revokeObjectURL(preview);
 setPreview(null);
 setSelectedFile(null);
 onCancel();
 };

 return (
 <div className="flex flex-col gap-3">
 {!preview ? (
 <button
 onClick={() => inputRef.current?.click()}
 className="editorial-shadow flex flex-col items-center gap-2 border-4 border-black bg-surface-container p-4 transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11]"
 >
 <ImageIcon size={20} />
 <span className="text-xs font-bold uppercase">Choose Image</span>
 <input
 ref={inputRef}
 type="file"
 accept="image/*"
 className="hidden"
 onChange={handleFileChange}
 />
 </button>
 ) : (
 <>
 <div className="relative">
 <img
 src={preview}
 alt="Preview"
 className="max-h-48 w-full border-4 border-black object-cover"
 />
 <button
 onClick={handleCancel}
 className="absolute -right-2 -top-2 flex size-8 items-center justify-center border-2 border-black bg-red-500 text-white"
 >
 <X size={14} strokeWidth={3} />
 </button>
 </div>
 <div className="flex gap-2">
 <button
 onClick={handleCancel}
 className="flex-1 border-4 border-black bg-white py-2 text-xs font-black uppercase"
 >
 Cancel
 </button>
 <button
 onClick={handleUpload}
 disabled={uploading}
 className="flex flex-1 items-center justify-center gap-2 border-4 border-black bg-primary-container py-2 text-xs font-black uppercase disabled:opacity-50"
 >
 {uploading && <Loader2 size={12} className="animate-spin" />}
 {uploading ? "Uploading..." : "Upload & Send"}
 </button>
 </div>
 </>
 )}
 </div>
 );
}
