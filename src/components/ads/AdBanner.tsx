"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

// Replace with your actual AdSense publisher ID when ready
const ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXX"; // TODO: Replace with your AdSense ID

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load ads in production and if AdSense script is available
    if (typeof window !== "undefined" && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        // console.error("AdSense error:", error);
      }
    }
  }, []);

  // In development, show a placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`bg-zinc-900/50 border border-zinc-800 rounded-xl text-center ${className}`}
      >
        <span className="text-zinc-600 text-xs">Advertisement</span>
        <div className="h-24 flex items-center justify-center text-zinc-700">
          Ad Space ({slot})
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Predefined ad sizes for common placements
export function LeaderboardAd({ className = "" }: { className?: string }) {
  return (
    <AdBanner
      slot="1234567890" // TODO: Replace with actual slot ID
      format="horizontal"
      className={`mb-10 ${className}`}
    />
  );
}

export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <AdBanner
      slot="0987654321" // TODO: Replace with actual slot ID
      format="vertical"
      className={className}
    />
  );
}

export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <AdBanner
      slot="1122334455" // TODO: Replace with actual slot ID
      format="auto"
      className={`my-8 ${className}`}
    />
  );
}
