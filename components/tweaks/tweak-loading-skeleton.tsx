'use client';

import { Skeleton } from '../ui/skeleton';

export function TweakLoadingSkeleton() {
  return (
    <div className="flex w-full border-b border-gray-200">
      {/* Voting skeleton */}
      <div className="w-6 flex flex-col items-center gap-0.5 py-2">
        <Skeleton className="w-5 h-8" />
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-5 h-8" />
      </div>

      {/* Post content skeleton */}
      <div className="flex flex-col gap-4 p-2 w-full">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>

        {/* Post content */}
        <div className="flex flex-col gap-1">
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-full h-20" />
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}
