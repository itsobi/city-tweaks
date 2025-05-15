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
    const timezone = args.userTimezone || userRequest?.timezone || 'UTC';

    // Convert current timestamp to user's timezone and get start of day
    const userDate = new Date(now);
    const startOfDay = new Date(
      userDate.toLocaleString('en-US', { timeZone: timezone })
    ).setHours(0, 0, 0, 0);

    if (userRequest) {
      // Convert last request timestamp to user's timezone
      const lastRequestDate = new Date(userRequest.lastRequestTimestamp);
      const lastRequestDay = new Date(
        lastRequestDate.toLocaleString('en-US', { timeZone: timezone })
      ).setHours(0, 0, 0, 0);

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

// ... existing code ...

// Add this new scheduled task
export const resetDailyRequests = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all user requests
    const userRequests = await ctx.db.query('userRequests').collect();

    for (const request of userRequests) {
      const timezone = request.timezone || 'UTC';

      // Convert current timestamp to user's timezone and get start of day
      const userDate = new Date(now);
      const startOfDay = new Date(
        userDate.toLocaleString('en-US', { timeZone: timezone })
      ).setHours(0, 0, 0, 0);

      // Convert last request timestamp to user's timezone
      const lastRequestDate = new Date(request.lastRequestTimestamp);
      const lastRequestDay = new Date(
        lastRequestDate.toLocaleString('en-US', { timeZone: timezone })
      ).setHours(0, 0, 0, 0);

      // Reset if last request was from a previous day
      if (lastRequestDay < startOfDay) {
        await ctx.db.patch(request._id, {
          requestCount: 0,
        });
      }
    }
  },
});
