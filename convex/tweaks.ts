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

    const uniqueClerkIds = [...new Set(tweaks.map((tweak) => tweak.authorId))];

    const users = await Promise.all(
      uniqueClerkIds.map((clerkId) =>
        ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
          .collect()
      )
    ).then((users) => users.flat()); // Flatten the array of arrays

    const userMap = new Map(users.map((user) => [user.clerkId, user]));

    const enrichedTweaks = await Promise.all(
      tweaks.map(async (tweak) => ({
        ...tweak,
        author: userMap.get(tweak.authorId),
        ...(tweak.imageStorageId
          ? { imageUrl: await ctx.storage.getUrl(tweak.imageStorageId) }
          : {}),
      }))
    );

    return enrichedTweaks;
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
