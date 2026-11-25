"use client";

import { useState } from "react";
import { FiX, FiUploadCloud, FiRefreshCw } from "react-icons/fi";

interface TiptapImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
}

export default function TiptapImageModal({
  isOpen,
  onClose,
  onInsert,
}: TiptapImageModalProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        setUrl(json.url);
      } else {
        setError(json.error || "Upload failed.");
      }
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please provide an image URL or upload a file.");
      return;
    }
    onInsert(url.trim(), alt.trim());
    setUrl("");
    setAlt("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#2A1810]/15 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A1810]/10 bg-[#F6F2EC]">
          <h3 className="font-display text-lg text-[#2A1810]">Insert Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#2A1810]/60 hover:text-[#2A1810]"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
              Upload Image
            </label>
            <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[#2A1810]/25 hover:border-[#C8782A] text-xs text-[#4A2C1A] cursor-pointer bg-[#F6F2EC]/50">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                  e.target.value = "";
                }}
              />
              {uploading ? (
                <>
                  <FiRefreshCw className="animate-spin text-[#C8782A]" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FiUploadCloud className="text-base text-[#C8782A]" />
                  <span>Choose image file (max 5 MB)</span>
                </>
              )}
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
              Image URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/media/... or https://..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC] text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
              Alt Text (SEO &amp; Accessibility)
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the lighting fixture or interior"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC] text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#2A1810]/10 bg-[#F6F2EC] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#4A2C1A] border border-[#2A1810]/15 hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="btn-3d btn-3d-dark px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-40"
          >
            Insert into Article
          </button>
        </div>
      </form>
    </div>
  );
}
