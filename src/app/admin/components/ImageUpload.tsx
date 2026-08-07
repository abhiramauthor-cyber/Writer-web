"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/app/admin/media/actions";

interface ImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ currentImageUrl, onUploadSuccess, label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("file", file);
      
      const { url } = await uploadImage(formData, currentImageUrl);
      onUploadSuccess(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">
        {label}
      </label>
      
      {currentImageUrl && (
        <div className="relative w-32 h-32 border border-border overflow-hidden bg-paper-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImageUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-ink-soft
            file:mr-4 file:py-2 file:px-4
            file:border file:border-border
            file:text-[11px] file:font-ui file:uppercase file:tracking-widest
            file:bg-paper-card file:text-ink
            hover:file:bg-paper
            disabled:opacity-50"
        />
        {isUploading && <span className="text-sm text-indigo">Uploading...</span>}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
