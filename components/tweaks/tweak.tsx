'use client';

import { TweakType } from '@/lib/types';
import {
  ArrowDown,
  ArrowUp,
  CircleUserRound,
  MessageSquare,
  Reply,
} from 'lucide-react';
import TimeStamp from './time-stamp';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { DeleteButton } from './delete-button';

interface TweakProps {
  tweak: TweakType;
  userId: string | null | undefined;
  isLast: boolean;
}

export function Tweak({ tweak, userId, isLast }: TweakProps) {
  const votes = useQuery(api.votes.getVotes, {
    tweakId: tweak._id,
  });
  const [isPending, startTransition] = useTransition();
  const vote = useMutation(api.votes.vote);

  return (
    <div
      className={cn(
        'flex w-full border-b border-gray-200',
        isLast && 'border-none'
      )}
    >
      {/* Upvote/Downvote */}
      <div className="w-6 flex flex-col items-center text-muted-foreground ">
        <button
          onClick={() => {
            startTransition(async () => {
              vote({
                tweakId: tweak._id,
                voteType: 'up',
              });
            });
          }}
          disabled={isPending}
          className={cn(
            'cursor-pointer hover:text-green-500',
            votes?.[0]?.votes.some((vote) => vote.voteType === 'up') &&
              'text-green-500'
          )}
        >
          <ArrowUp />
        </button>
        <span className="text-xs">{votes?.[0]?.votes.length ?? 0}</span>
        <button
          onClick={() => {
            startTransition(async () => {
              vote({
                tweakId: tweak._id,
                voteType: 'down',
              });
            });
          }}
          disabled={isPending}
          className={cn(
            'cursor-pointer hover:text-red-500',
            votes?.[0]?.votes.some((vote) => vote.voteType === 'down') &&
              'text-red-500'
          )}
        >
          <ArrowDown />
        </button>
      </div>

      {/* Post */}
      <div className="flex flex-col gap-4 p-2 w-full">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>cT/{tweak.city.toLocaleLowerCase()}</span>
            <span>•</span>
            {/* Avatar */}
            {tweak.isAnonymous ? (
              <div className="flex items-center gap-1">
                <CircleUserRound className="h-4 w-4 lg:h-5 lg:w-5" />
                <span>Posted by Anonymous</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5 lg:h-6 lg:w-6">
                  <AvatarImage src={tweak.author?.imageUrl} />
                  <AvatarFallback>
                    {tweak.author?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>Posted by {tweak.author?.username}</span>
              </div>
            )}
            <span>•</span>
            <TimeStamp date={new Date(tweak._creationTime)} />
          </div>
          <div className="flex items-center text-muted-foreground text-xs">
            {userId === tweak.authorId && (
              <DeleteButton
                tweakId={tweak._id}
                imageStorageId={tweak.imageStorageId}
                userId={userId}
              />
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium">{tweak.title}</h3>

          <p className="text-sm lg:text-base">{tweak.content}</p>
          {/* Image */}
          {tweak.imageUrl && (
            <div className="max-w-2xl">
              <img
                src={tweak.imageUrl}
                alt={tweak.title}
                className="max-h-[512px] w-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center gap-4 text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> 10 Comments
          </span>
          <span className="flex items-center gap-1">
            <Reply className="w-3 h-3" /> Reply
          </span>
        </div>
      </div>
    </div>
  );
}
