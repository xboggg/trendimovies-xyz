"use client";

import { Share2 } from "lucide-react";
import { Button } from "./button";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareText = text || `Check out ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          fallbackShare(shareUrl);
        }
      }
    } else {
      fallbackShare(shareUrl);
    }
  };

  const fallbackShare = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      prompt("Copy this link:", shareUrl);
    });
  };

  return (
    <Button variant="outline" size="lg" className="gap-2" onClick={handleShare}>
      <Share2 className="w-5 h-5" />
      Share
    </Button>
  );
}
