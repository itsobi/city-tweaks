'use client';

import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { Tweak } from './tweak';
import { useEffect } from 'react';
import { Comment } from '../comments/comment';

interface TweaksWrapperProps {
  preloadedTweak: Preloaded<typeof api.tweaks.getTweak>;
  preloadedComments: Preloaded<typeof api.comments.getComments>;
  preloadedNumberOfComments: Preloaded<typeof api.comments.getCommentsLength>;
  userId: string | null;
}

export function TweakWrapper({
  preloadedTweak,
  preloadedComments,
  preloadedNumberOfComments,
  userId,
}: TweaksWrapperProps) {
  const tweak = usePreloadedQuery(preloadedTweak);
  const comments = usePreloadedQuery(preloadedComments);
  const numberOfComments = usePreloadedQuery(preloadedNumberOfComments);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!userId || !tweak) {
    // TODO: Alert Dialog here
    return null;
  }

  return (
    <div className="flex flex-col gap-8 p-2">
      <Tweak isLast={false} tweak={tweak} userId={userId} />
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">Comments ({numberOfComments ?? 0})</h3>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            tweakId={tweak._id}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}
