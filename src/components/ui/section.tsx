"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  href?: string;
  viewAllText?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function Section({
  title,
  href,
  viewAllText = "View All",
  children,
  className,
  icon,
}: SectionProps) {
  return (
    <section className={cn("py-8", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-2xl font-bold text-theme">{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            {viewAllText}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

interface ContentGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function ContentGrid({
  children,
  columns = 5,
  className,
}: ContentGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

interface ScrollRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollRow({ children, className }: ScrollRowProps) {
  return (
    <div
      className={cn(
        "flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent",
        className
      )}
    >
      {children}
    </div>
  );
}
