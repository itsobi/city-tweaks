'use client';

import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { Tweak } from './tweak';
import { useEffect } from 'react';

interface TweaksWrapperProps {
  preloadedTweak: Preloaded<typeof api.tweaks.getTweak>;
  userId: string | null;
}

export function TweakWrapper({ preloadedTweak, userId }: TweaksWrapperProps) {
  const tweak = usePreloadedQuery(preloadedTweak);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!userId || !tweak) {
    // TODO: Alert Dialog here
    return null;
  }

  return <Tweak isLast={true} tweak={tweak} userId={userId} />;
}
