"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-600 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          Prev
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-zinc-500">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page as number)}
              className={cn(
                "min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-colors",
                currentPage === page
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              )}
            >
              {page}
            </Link>
          )
        ))}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-600 cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
