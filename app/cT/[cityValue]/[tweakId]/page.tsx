import { Alert } from '@/components/alert';
import { TweakWrapper } from '@/components/tweaks/tweak-wrapper';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';

export default async function TweakPage({
  params,
}: {
  params: Promise<{ cityValue: string; tweakId: Id<'tweaks'> }>;
}) {
  const { tweakId } = await params;
  const { userId } = await auth();

  try {
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
  } catch (error) {
    return (
      <Alert
        title="City Tweak not found"
        description="Sorry, this tweak does not exist. You will be redirect back to the home screen."
      />
    );
  }
}
