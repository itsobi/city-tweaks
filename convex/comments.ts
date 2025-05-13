import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { enrichWithUsers } from '@/lib/helpers';
import { api } from './_generated/api';

export const getComments = query({
  args: {
    tweakId: v.id('tweaks'),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_tweak_id', (q) => q.eq('tweakId', args.tweakId))
      .filter((q) => q.eq(q.field('isParent'), true))
      .order('desc')
      .collect();

    return await enrichWithUsers(ctx, comments);
  },
});

export const getCommentsLength = query({
  args: {
    tweakId: v.id('tweaks'),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_tweak_id', (q) => q.eq('tweakId', args.tweakId))
      .collect();

    return comments.length;
  },
});

export const getReplies = query({
  args: {
    parentCommentId: v.id('comments'),
  },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query('comments')
      .withIndex('by_parent_comment_id', (q) =>
        q.eq('parentCommentId', args.parentCommentId)
      )
      .collect();

    const enrichedReplies = await enrichWithUsers(ctx, replies);

    return enrichedReplies;
  },
});

export const reply = mutation({
  args: {
    parentCommentId: v.id('comments'),
    tweakId: v.id('tweaks'),
    content: v.string(),
    isParent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authorized');

    const userExists = await ctx.runQuery(api.users.userExists, {
      clerkId: identity.subject,
    });

    if (!userExists) {
      return {
        success: false,
        message: 'Your account is not registered properly.',
      };
    }

    if (!args.parentCommentId) {
      return { success: false, message: 'Parent comment ID not set' };
    }

    const authorId = identity.subject;

    try {
      await ctx.db.insert('comments', {
        authorId,
        content: args.content,
        isParent: args.isParent,
        parentCommentId: args.parentCommentId,
        tweakId: args.tweakId,
      });
      // TODO: send notification to the tweak author
      return { success: true, message: 'Reply created successfully!' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'There was an issue creating your reply.',
      };
    }
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id('comments'), authorId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Unauthorized');

    const userId = identity.subject;

    if (userId !== args.authorId) {
      return {
        success: false,
        message: 'You are not authorized to delete this comment.',
      };
    }

    try {
      await ctx.db.delete(args.commentId);
      return {
        success: true,
        message: 'Comment deleted successfully!',
      };
    } catch (error) {
      console.error(error);
      return {
        success: true,
        message:
          error instanceof Error ? error.message : 'Unable to delete comment.',
      };
    }
  },
});
