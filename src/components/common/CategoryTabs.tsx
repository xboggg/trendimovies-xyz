"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  baseUrl: string;
}

export function CategoryTabs({ categories, activeCategory, baseUrl }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`${baseUrl}?category=${cat.id}`}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeCategory === cat.id
              ? "bg-red-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          )}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
