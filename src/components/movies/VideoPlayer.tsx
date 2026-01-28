"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/utils";

interface VideoPlayerProps {
  videoKey: string;
  title: string;
  children: React.ReactNode;
}

export function VideoPlayer({ videoKey, title, children }: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <>
      <div onClick={openModal} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-5xl mx-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 p-2 text-white hover:text-red-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`${getYouTubeEmbedUrl(videoKey)}?autoplay=1&rel=0`}
                title={`${title} - Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
