import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getVotes = query({
  args: {
    tweakId: v.id('tweaks'),
  },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_tweak_id', (q) => q.eq('tweakId', args.tweakId))
      .collect();

    return votes;
  },
});

export const vote = mutation({
  args: {
    tweakId: v.id('tweaks'),
    voteType: v.union(v.literal('up'), v.literal('down')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const userId = identity.subject;

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_tweak_id', (q) => q.eq('tweakId', args.tweakId))
      .first();

    if (!votes) {
      // create a new vote
      await ctx.db.insert('votes', {
        tweakId: args.tweakId,
        votes: [{ userId, voteType: args.voteType }],
      });
      return;
    }

    const existingVote = votes?.votes.find((vote) => vote.userId === userId);

    if (existingVote) {
      if (existingVote.voteType === args.voteType) {
        // Remove vote if clicking the same type
        await ctx.db.patch(votes._id, {
          votes: votes.votes.filter((vote) => vote.userId !== userId),
        });
        return;
      } else {
        // Switch vote type if clicking the opposite
        await ctx.db.patch(votes._id, {
          votes: [
            ...votes.votes.filter((vote) => vote.userId !== userId),
            { userId, voteType: args.voteType },
          ],
        });
        return;
      }
    } else {
      // Add new vote if no existing vote
      await ctx.db.patch(votes._id, {
        votes: [...votes.votes, { userId, voteType: args.voteType }],
      });
    }
  },
});
