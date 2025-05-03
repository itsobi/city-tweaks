import { enrichWithUsers } from '@/lib/helpers';
import { api } from './_generated/api';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createTweak = mutation({
  args: {
    isAnonymous: v.boolean(),
    title: v.string(),
    content: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    city: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    try {
      await ctx.db.insert('tweaks', {
        isAnonymous: args.isAnonymous,
        title: args.title,
        content: args.content,
        imageStorageId: args.imageStorageId,
        city: args.city,
        authorId: identity.subject,
      });
      return {
        success: true,
        message: 'Tweak created successfully!',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to create tweak',
      };
    }
  },
});

export const getTweaks = query({
  handler: async (ctx) => {
    const tweaks = await ctx.db.query('tweaks').order('desc').collect();

    const enrichedTweaks = await enrichWithUsers(ctx, tweaks);

    return await Promise.all(
      enrichedTweaks.map(async (tweak) => ({
        ...tweak,
        ...(tweak.imageStorageId
          ? { imageUrl: await ctx.storage.getUrl(tweak.imageStorageId) }
          : {}),
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteTweak = mutation({
  args: {
    tweakId: v.id('tweaks'),
    authorId: v.string(),
    storageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Unauthorized');

    if (identity.subject !== args.authorId) {
      throw new Error('You are not authorized to delete this tweak.');
    }

    try {
      await ctx.db.delete(args.tweakId);

      if (args.storageId) {
        await ctx.storage.delete(args.storageId);
      }
      return { success: true, message: 'City Tweak successfully deleted.' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'There was a problem deleting your City Tweak.',
      };
    }
  },
});

export const comment = mutation({
  args: {
    tweakId: v.id('tweaks'),
    parentCommentId: v.optional(v.id('comments')),
    content: v.string(),
    isParent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    if (!args.tweakId) {
      return { success: false, message: 'TweakId not set' };
    }

    const userId = identity.subject;

    try {
      await ctx.db.insert('comments', {
        tweakId: args.tweakId,
        authorId: userId,
        content: args.content,
        parentCommentId: args.parentCommentId,
        isParent: args.isParent,
      });
      return { success: true, message: 'Comment sent successfully!' };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'There was an issue creating your reply',
      };
    }
  },
});

export const getTweak = query({
  args: { tweakId: v.id('tweaks') },
  handler: async (ctx, args) => {
    const tweak = await ctx.db.get(args.tweakId);

    if (!tweak) {
      return null;
    }

    let imageUrl;

    if (tweak.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(tweak.imageStorageId);
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', tweak.authorId))
      .first();

    const enrichedTweak = {
      ...tweak,
      author: user || undefined,
      imageUrl,
    };

    return enrichedTweak;
  },
});
