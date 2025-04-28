import { TweaksWrapper } from '@/components/tweaks/tweaks-wrapper';
import { api } from '@/convex/_generated/api';
import { preloadQuery } from 'convex/nextjs';

export default async function Home() {
  const preloadedTweaks = await preloadQuery(api.tweaks.getTweaks);
  return (
    <div>
      <TweaksWrapper preloadedTweaks={preloadedTweaks} />
    </div>
  );
}
