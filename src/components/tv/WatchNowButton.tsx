"use client";

import { Tv, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchNowButtonProps {
  tmdbId: number;
}

export function WatchNowButton({ tmdbId }: WatchNowButtonProps) {
  // Link directly to TV page on trendimovies.com using TMDB ID
  const href = `https://trendimovies.com/tv/${tmdbId}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
        <Tv className="w-5 h-5" />
        Watch Now
        <ExternalLink className="w-4 h-4" />
      </Button>
    </a>
  );
}
