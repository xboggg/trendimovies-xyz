import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Placeholder SVG as data URL
const PLACEHOLDER_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect fill='%2327272a' width='300' height='450'/%3E%3Ctext fill='%2371717a' font-family='system-ui' font-size='24' text-anchor='middle' x='150' y='225'%3ENo Image%3C/text%3E%3C/svg%3E";
const PLACEHOLDER_BACKDROP = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1280' height='720' viewBox='0 0 1280 720'%3E%3Crect fill='%2327272a' width='1280' height='720'/%3E%3Ctext fill='%2371717a' font-family='system-ui' font-size='48' text-anchor='middle' x='640' y='360'%3ENo Image%3C/text%3E%3C/svg%3E";

export function getImageUrl(
  path: string | null | undefined,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return PLACEHOLDER_POSTER;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null | undefined,
  size: "w300" | "w780" | "w1280" | "original" = "w1280"
): string {
  if (!path) return PLACEHOLDER_BACKDROP;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function formatDate(date: string): string {
  if (!date) return "TBA";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatYear(date: string): string {
  if (!date) return "TBA";
  return new Date(date).getFullYear().toString();
}

export function formatRuntime(minutes: number): string {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatMoney(amount: number): string {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatVoteAverage(vote: number): string {
  return vote.toFixed(1);
}

export function getVoteColor(vote: number): string {
  if (vote >= 7) return "text-green-500";
  if (vote >= 5) return "text-yellow-500";
  return "text-red-500";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function getYouTubeEmbedUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}`;
}

export function getYouTubeThumbnail(key: string): string {
  return `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
}
