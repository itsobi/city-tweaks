import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const userRequest = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userRequest = await ctx.db
      .query('userRequests')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.userId))
      .first();

    return userRequest;
  },
});

export const updateUserRequest = mutation({
  args: {
    userTimezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized');
    }
    const userId = userIdentity.subject;

    const userRequest = await ctx.db
      .query('userRequests')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
      .first();

    const now = Date.now();
    const timezone = args.userTimezone || userRequest?.timezone || 'UTC'; // user timezone or default to UTC

    // get start of day in user's timezone
    const userDate = new Date().toLocaleString('en-US', {
      timeZone: timezone,
    });
    const startOfDay = new Date(userDate).setHours(0, 0, 0, 0);

    if (userRequest) {
      // Get start of last request's day in user's timezone
      const lastRequestDate = new Date(
        userRequest.lastRequestTimestamp
      ).toLocaleString('en-US', { timeZone: timezone });
      const lastRequestDay = new Date(lastRequestDate).setHours(0, 0, 0, 0);
      const isNewDay = lastRequestDay < startOfDay;

      if (isNewDay) {
        await ctx.db.patch(userRequest._id, {
          requestCount: 1,
          lastRequestTimestamp: now,
          timezone: timezone,
        });
      } else if (userRequest.requestCount >= 2) {
        return {
          success: false,
          message:
            'You have exceeded the daily amount of requests. Try again tomorrow.',
        };
      } else {
        // increment count for the same day
        await ctx.db.patch(userRequest._id, {
          requestCount: userRequest.requestCount + 1,
          lastRequestTimestamp: now,
        });
      }
    } else {
      // if no record found, create a new user request
      await ctx.db.insert('userRequests', {
        clerkId: userId,
        requestCount: 1,
        lastRequestTimestamp: now,
        timezone: timezone,
      });
    }

    return {
      success: true,
      message: 'User request updated',
    };
  },
});
