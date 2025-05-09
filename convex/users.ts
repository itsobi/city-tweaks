import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { api } from './_generated/api';

export const userExists = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    return !!user;
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userExists = await ctx.runQuery(api.users.userExists, {
      clerkId: args.clerkId,
    });

    if (!userExists) return;

    await ctx.db.insert('users', {
      clerkId: args.clerkId,
      username: args.username,
      imageUrl: args.imageUrl,
    });
  },
});

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateFields: any = {};

    if (args.username !== undefined || null)
      updateFields.username = args.username;
    if (args.imageUrl !== undefined) updateFields.imageUrl = args.imageUrl;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (!user) throw new Error('User does not exist');

    await ctx.db.patch(user._id, updateFields);
  },
});
