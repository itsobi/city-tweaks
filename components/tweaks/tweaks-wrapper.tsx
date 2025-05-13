'use client';

import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Tweak } from './tweak';
import { useUser } from '@clerk/nextjs';

export function TweaksWrapper({
  preloadedTweaks,
}: {
  preloadedTweaks: Preloaded<typeof api.tweaks.getTweaks>;
}) {
  const tweaks = usePreloadedQuery(preloadedTweaks);
  const { user } = useUser();

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
