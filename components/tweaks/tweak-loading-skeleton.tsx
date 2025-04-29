export function TweakLoadingSkeleton() {
  return (
    <div className="flex w-full border-b border-gray-200 animate-pulse">
      {/* Upvote/Downvote Skeleton */}
      <div className="w-6 flex flex-col items-center gap-1 py-2">
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-3 w-3 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
      </div>

      {/* Post Skeleton */}
      <div className="flex flex-col gap-4 p-2 w-full">
        {/* Top Row */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-5 w-5 bg-gray-200 rounded-full" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        {/* Post Content */}
        <div className="flex flex-col gap-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center gap-4">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
