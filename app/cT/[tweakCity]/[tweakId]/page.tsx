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
  const preloadedComments = await preloadQuery(api.comments.getComments, {
    tweakId,
  });
  const preloadedNumberOfComments = await preloadQuery(
    api.comments.getCommentsLength,
    {
      tweakId,
    }
  );

  return (
    <TweakWrapper
      preloadedTweak={preloadedTweak}
      userId={userId}
      preloadedComments={preloadedComments}
      preloadedNumberOfComments={preloadedNumberOfComments}
    />
  );
}
