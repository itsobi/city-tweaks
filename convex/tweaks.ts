import { enrichWithUsers } from '@/lib/helpers';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

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

    const userExists = await ctx.runQuery(api.users.userExists, {
      clerkId: identity.subject,
    });

    if (!userExists) {
      return {
        success: false,
        message: 'Your account is not registered properly.',
      };
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

    // Get votes for each tweak individually
    const votes = await Promise.all(
      tweaks.map((tweak) =>
        ctx.db
          .query('votes')
          .withIndex('by_tweak_id', (q) => q.eq('tweakId', tweak._id))
          .collect()
      )
    );

    // Create a map of vote counts for each tweak
    const voteCountMap = new Map();
    votes.flat().forEach((voteDoc) => {
      const upvotes = voteDoc.votes.filter((v) => v.voteType === 'up').length;
      const downvotes = voteDoc.votes.filter(
        (v) => v.voteType === 'down'
      ).length;
      voteCountMap.set(voteDoc.tweakId, upvotes - downvotes);
    });

    // Sort tweaks by vote count
    const sortedTweaks = tweaks.sort((a, b) => {
      const aVotes = voteCountMap.get(a._id) || 0;
      const bVotes = voteCountMap.get(b._id) || 0;
      return bVotes - aVotes; // Sort in descending order
    });

    const enrichedTweaks = await enrichWithUsers(ctx, sortedTweaks);

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

export const getTweaksByCityValue = query({
  args: { cityValue: v.string() },
  handler: async (ctx, args) => {
    const tweaks = await ctx.db
      .query('tweaks')
      .withIndex('by_city', (q) => q.eq('city', args.cityValue))
      .order('desc')
      .collect();

    // Get votes for each tweak individually
    const votes = await Promise.all(
      tweaks.map((tweak) =>
        ctx.db
          .query('votes')
          .withIndex('by_tweak_id', (q) => q.eq('tweakId', tweak._id))
          .collect()
      )
    );

    // Create a map of vote counts for each tweak
    const voteCountMap = new Map();
    votes.flat().forEach((voteDoc) => {
      const upvotes = voteDoc.votes.filter((v) => v.voteType === 'up').length;
      const downvotes = voteDoc.votes.filter(
        (v) => v.voteType === 'down'
      ).length;
      voteCountMap.set(voteDoc.tweakId, upvotes - downvotes);
    });

    // Sort tweaks by vote count
    const sortedTweaks = tweaks.sort((a, b) => {
      const aVotes = voteCountMap.get(a._id) || 0;
      const bVotes = voteCountMap.get(b._id) || 0;
      return bVotes - aVotes; // Sort in descending order
    });

    const enrichedTweaks = await enrichWithUsers(ctx, sortedTweaks);

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
      // delete comments associated with that tweak.
      const commentsToDelete = await ctx.db
        .query('comments')
        .withIndex('by_tweak_id', (q) => q.eq('tweakId', args.tweakId))
        .collect();

      if (commentsToDelete.length > 0) {
        for (const comment of commentsToDelete) {
          await ctx.db.delete(comment._id);
        }
      }

      // Delete the tweak itself
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
    tweakAuthorId: v.string(),
    city: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    if (!args.tweakId) {
      return { success: false, message: 'TweakId not set' };
    }

    const userExists = await ctx.runQuery(api.users.userExists, {
      clerkId: identity.subject,
    });

    if (!userExists) {
      return {
        success: false,
        message: 'Your account is not registered properly.',
      };
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
      // TODO: send notification to the tweak author

      await ctx.runMutation(api.notifications.createNotification, {
        type: 'comment',
        authorId: args.tweakAuthorId,
        city: args.city,
        tweakId: args.tweakId,
        senderClerkId: userId,
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
