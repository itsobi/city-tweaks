import { TweaksByCityWrapper } from '@/components/tweaks/tweaks-by-city-wrapper';
import { api } from '@/convex/_generated/api';
import { preloadQuery } from 'convex/nextjs';

export default async function CityTweaksPage({
  params,
}: {
  params: Promise<{ cityValue: string }>;
}) {
  const { cityValue } = await params;

  const preloadedTweaks = await preloadQuery(api.tweaks.getTweaksByCityValue, {
    cityValue,
  });

  return <TweaksByCityWrapper preloadedTweaks={preloadedTweaks} />;
}
