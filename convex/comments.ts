import { v } from 'convex/values';
import { query } from './_generated/server';

export const getComments = query({
  args: {
    tweakId: v.id('tweaks'),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_tweak_id', (q) => q.eq('tweakId', args.tweakId))
      .collect();

    return {
      comments,
      count: comments.length,
    };
  },
});
