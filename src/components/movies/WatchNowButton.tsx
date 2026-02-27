"use client";

import { useState, useEffect } from "react";
import { Tv, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchNowButtonProps {
  tmdbId: number;
  movieTitle: string;
}

export function WatchNowButton({ tmdbId, movieTitle }: WatchNowButtonProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlug() {
      try {
        // Try to get slug from trendimovies.com PostgREST API
        const response = await fetch(
          `https://trendimovies.com/api/movies?tmdb_id=eq.${tmdbId}&select=slug`,
          { cache: "force-cache" }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0 && data[0].slug) {
            setSlug(data[0].slug);
          }
        }
      } catch {
        // Fallback: generate slug from movie title
        const generatedSlug = movieTitle
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        setSlug(generatedSlug);
      } finally {
        setLoading(false);
      }
    }

    fetchSlug();
  }, [tmdbId, movieTitle]);

  const href = slug
    ? `https://trendimovies.com/movie/${slug}`
    : `https://trendimovies.com/search?q=${encodeURIComponent(movieTitle)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700" disabled={loading}>
        <Tv className="w-5 h-5" />
        Watch Now
        <ExternalLink className="w-4 h-4" />
      </Button>
    </a>
  );
}
