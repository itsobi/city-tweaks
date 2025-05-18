'use client';

import { Comment as CommentType } from '@/lib/types';
import { ChevronUp, Reply } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import TimeStamp from '../tweaks/time-stamp';
import { useState } from 'react';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DeleteCommentButton } from './delete-comment-button';
import { Id } from '@/convex/_generated/dataModel';
import { CreateReplyForm } from '../tweaks/create-reply-form';

interface CommentProps {
  comment: CommentType;
  city: string;
  tweakId: Id<'tweaks'>;
  userId: string | null;
}

export function Comment({ comment, tweakId, userId, city }: CommentProps) {
  const [reply, setReply] = useState(false);
  const replies = useQuery(api.comments.getReplies, {
    parentCommentId: comment._id,
  });

  return (
    <div className="flex gap-2 w-full py-1">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 w-full">
          <Avatar className="h-5 w-5 lg:h-6 lg:w-6">
            <AvatarImage src={comment.author?.imageUrl} />
            <AvatarFallback>{comment.author?.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs lg:text-sm text-black">
            {comment.author?.username}
          </span>
          <TimeStamp date={new Date(comment._creationTime)} />
          {userId === comment.authorId && (
            <div className="ml-auto flex-shrink-0">
              <DeleteCommentButton
                commentId={comment._id}
                authorId={comment.authorId}
              />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm lg:text-base">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground text-xs">
          {reply ? (
            <button
              onClick={() => setReply(!reply)}
              className="flex items-center gap-1 cursor-pointer hover:text-yellow-500"
            >
              <ChevronUp className="w-3 h-3" /> Close
            </button>
          ) : (
            <button
              onClick={() => setReply(!reply)}
              className="flex items-center gap-1 cursor-pointer hover:text-yellow-500"
            >
              <Reply className="w-3 h-3" /> Reply
            </button>
          )}
        </div>
        {reply && (
          <CreateReplyForm
            commentId={comment._id}
            tweakId={tweakId}
            reply={true}
            setReply={setReply}
            tweakAuthorId={comment.authorId}
            city={city}
          />
        )}

        {/* Replies to comments */}
        <div className="pl-4 border-l border-l-gray-200">
          {replies?.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              tweakId={tweakId}
              userId={userId}
              city={city}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
