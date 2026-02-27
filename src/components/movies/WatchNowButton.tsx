"use client";

import { Tv, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchNowButtonProps {
  movieTitle: string;
  year: string;
}

export function WatchNowButton({ movieTitle, year }: WatchNowButtonProps) {
  // Generate slug: lowercase, remove special chars, replace spaces with hyphens, add year
  const slug = movieTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Link directly to movie page on trendimovies.com
  const href = `https://trendimovies.com/movie/${slug}-${year}`;

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
