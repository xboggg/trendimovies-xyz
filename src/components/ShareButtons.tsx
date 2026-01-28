"use client";

import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=450");
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, "_blank", "width=550,height=450");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setShowOptions(true);
        }
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <Share2 className="w-5 h-5" />
        Share Article
      </button>

      {showOptions && (
        <div className="absolute bottom-full left-0 mb-2 bg-zinc-800 rounded-lg p-3 shadow-xl border border-zinc-700 min-w-[180px]">
          <div className="flex flex-col gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm py-1"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={shareToTwitter}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm py-1"
            >
              <Twitter className="w-4 h-4" />
              Share on X
            </button>
            <button
              onClick={shareToFacebook}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm py-1"
            >
              <Facebook className="w-4 h-4" />
              Share on Facebook
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
