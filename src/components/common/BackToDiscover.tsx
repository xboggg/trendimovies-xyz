import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackToDiscover() {
  return (
    <Link
      href="/discover"
      className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors group"
    >
      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Back to Discover
    </Link>
  );
}
