import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createNotification = mutation({
  args: {
    authorId: v.string(),
    senderClerkId: v.string(),
    tweakId: v.id('tweaks'),
    type: v.union(v.literal('comment'), v.literal('reply')),
    city: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const userId = identity.subject;

    // Don't send notifications to yourself
    if (args.authorId === userId) {
      return;
    }

    await ctx.db.insert('notifications', {
      authorClerkId: args.authorId,
      senderClerkId: args.senderClerkId,
      tweakId: args.tweakId,
      type: args.type,
      city: args.city,
      read: false,
    });
  },
});

export const getNotifications = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId) return;

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_author_clerk_id', (q) =>
        q.eq('authorClerkId', args.clerkId)
      )
      .filter((q) => q.eq(q.field('read'), false))
      .collect();

    const uniqueSenderClerkIds = [
      ...new Set(
        notifications.map((notification) => notification.senderClerkId)
      ),
    ];

    const senderUsers = await Promise.all(
      uniqueSenderClerkIds.map((clerkId) =>
        ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
          .first()
      )
    );
    // Create user map
    const userMap = new Map(
      senderUsers.map((user, index) => [
        uniqueSenderClerkIds[index],
        user ?? undefined,
      ])
    );

    return notifications.map((notification) => ({
      ...notification,
      sender: userMap.get(notification.senderClerkId),
    }));
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
  },
});
