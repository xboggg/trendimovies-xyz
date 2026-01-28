import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-800",
        className
      )}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-900 overflow-hidden">
      <Skeleton className="aspect-[2/3]" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-zinc-900">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div>
      {/* Backdrop */}
      <Skeleton className="h-[50vh] w-full" />

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <Skeleton className="w-64 h-96 rounded-xl flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 space-y-4 pt-32 md:pt-0">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
