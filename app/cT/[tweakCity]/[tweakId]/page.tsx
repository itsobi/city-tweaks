import { TweakLoadingSkeleton } from '@/components/tweaks/tweak-loading-skeleton';
import { TweakWrapper } from '@/components/tweaks/tweak-wrapper';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';

export default async function TweakPage({
  params,
}: {
  params: Promise<{ tweakCity: string; tweakId: Id<'tweaks'> }>;
}) {
  const { tweakId } = await params;
  const { userId } = await auth();
  const preloadedTweak = await preloadQuery(api.tweaks.getTweak, {
    tweakId,
  });

  return <TweakWrapper preloadedTweak={preloadedTweak} userId={userId} />;
}
