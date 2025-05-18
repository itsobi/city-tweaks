'use client';

import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { Tweak } from './tweak';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function TweaksByCityWrapper({
  preloadedTweaks,
}: {
  preloadedTweaks: Preloaded<typeof api.tweaks.getTweaksByCityValue>;
}) {
  const tweaks = usePreloadedQuery(preloadedTweaks);
  const { user } = useUser();

  if (tweaks.length) {
    return (
      <>
        {tweaks.map((tweak, index) => (
          <Tweak
            key={tweak._id}
            tweak={tweak}
            userId={user?.id}
            isLast={tweaks.length === index + 1}
          />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-20 gap-4">
      <h1 className="text-sm text-muted-foreground">
        No City Tweaks found for this city
      </h1>
      <Link href="/" className="text-sm text-yellow-500 hover:underline">
        Go to Home Page
      </Link>
    </div>
  );
}
