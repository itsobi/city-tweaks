'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Tweak } from './tweak';
import { useUser } from '@clerk/nextjs';

export function TweaksWrapper({
  preloadedTweaks,
}: {
  preloadedTweaks: Preloaded<typeof api.tweaks.getTweaks>;
}) {
  const tweaks = usePreloadedQuery(preloadedTweaks);
  console.log(tweaks);
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <>
      {tweaks.map((tweak) => (
        <Tweak key={tweak._id} tweak={tweak} userId={user.id} />
      ))}
    </>
  );
}
