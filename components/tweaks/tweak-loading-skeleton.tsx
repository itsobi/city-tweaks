'use client';

import { Skeleton } from '../ui/skeleton';

export function TweakLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex w-full border-b border-gray-200">
        {/* Voting skeleton */}
        <div className="w-6 flex flex-col items-center gap-0.5 py-2">
          <Skeleton className="w-3 h-8" />
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-3 h-8" />
        </div>

        {/* Post content skeleton */}
        <div className="flex flex-col gap-4 p-2 w-full">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>

          {/* Post content */}
          <div className="flex flex-col gap-2">
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-full h-2.5" />
            <Skeleton className="w-full h-2.5" />
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>
      <h3 className="font-semibold mt-2">Comments</h3>
      <div className="flex flex-col gap-4">
        {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
          (_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-[80px] h-2.5" />
                <Skeleton className="w-[80px] h-2.5" />
                <Skeleton className="w-[50px] h-2.5 ml-auto" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-2.5" />
                <Skeleton className="w-full h-2.5" />
              </div>
              <div>
                <Skeleton className="w-[50px] h-2.5" />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
