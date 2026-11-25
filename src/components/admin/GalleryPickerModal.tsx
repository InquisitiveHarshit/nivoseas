"use client";

import { useEffect, useState } from "react";
import { FiX, FiRefreshCw, FiImage, FiCheck } from "react-icons/fi";

interface GalleryItem {
  public_id: string;
  url: string;
  secure_url?: string;
  created_at?: string;
}

interface GalleryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, suggestedAlt: string) => void;
}

export default function GalleryPickerModal({
  isOpen,
  onClose,
  onSelect,
}: GalleryPickerModalProps) {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/upload");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setImages(json.data);
      } else {
        setError(json.error || "Could not load gallery images.");
      }
    } catch {
      setError("Network error while loading gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTitleFromId = (publicId: string) => {
    const base = publicId.split("/").pop() || "";
    return base
      .replace(/-\d{6}$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl border border-[#2A1810]/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A1810]/10 bg-[#F6F2EC]">
          <div>
            <h3 className="font-display text-lg text-[#2A1810]">
              Select from Uploaded Gallery
            </h3>
            <p className="text-xs text-[#4A2C1A]/70">
              Choose an existing Cloudinary blog image
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadImages}
              className="p-2 rounded-xl border border-[#2A1810]/15 text-[#2A1810] hover:bg-white text-xs flex items-center gap-1.5"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#2A1810]/60 hover:text-[#2A1810] hover:bg-white"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FiRefreshCw className="animate-spin text-2xl text-[#C8782A]" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-xs text-red-600">{error}</div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-[#4A2C1A]/60 space-y-2">
              <FiImage className="text-3xl mx-auto opacity-40" />
              <p className="text-sm">No blog images uploaded yet.</p>
              <p className="text-xs">
                Switch to &ldquo;Upload File&rdquo; to upload your first image.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img) => {
                const isSelected = selectedUrl === img.url;
                const suggestedAlt = formatTitleFromId(img.public_id);
                return (
                  <button
                    key={img.public_id}
                    type="button"
                    onClick={() => setSelectedUrl(img.url)}
                    onDoubleClick={() => {
                      onSelect(img.url, suggestedAlt);
                      onClose();
                    }}
                    className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all bg-[#F6F2EC] ${
                      isSelected
                        ? "border-[#C8782A] ring-2 ring-[#C8782A]/30"
                        : "border-transparent hover:border-[#2A1810]/20"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={suggestedAlt || "Blog gallery image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 text-[11px] text-[#2A1810] truncate font-medium">
                      {suggestedAlt || img.public_id}
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#C8782A] text-white flex items-center justify-center shadow">
                        <FiCheck className="text-xs" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#2A1810]/10 bg-[#F6F2EC] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#4A2C1A] hover:bg-white border border-[#2A1810]/15"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedUrl}
            onClick={() => {
              if (!selectedUrl) return;
              const match = images.find((i) => i.url === selectedUrl);
              const alt = match ? formatTitleFromId(match.public_id) : "";
              onSelect(selectedUrl, alt);
              onClose();
            }}
            className="btn-3d btn-3d-dark px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-40"
          >
            Use Selected Image
          </button>
        </div>
      </div>
    </div>
  );
}
