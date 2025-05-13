import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    imageUrl: v.string(),
  }).index('by_clerk_id', ['clerkId']),
  tweaks: defineTable({
    authorId: v.string(),
    isAnonymous: v.boolean(),
    title: v.string(),
    content: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    city: v.string(),
  }).index('by_city', ['city']),
  comments: defineTable({
    tweakId: v.id('tweaks'),
    parentCommentId: v.optional(v.id('comments')),
    authorId: v.string(),
    content: v.string(),
    isParent: v.boolean(),
  })
    .index('by_tweak_id', ['tweakId'])
    .index('by_parent_comment_id', ['parentCommentId']),
  votes: defineTable({
    tweakId: v.id('tweaks'),
    votes: v.array(
      v.object({
        userId: v.string(),
        voteType: v.union(v.literal('up'), v.literal('down')),
      })
    ),
  }).index('by_tweak_id', ['tweakId']),
  cities: defineTable({
    city: v.string(),
    region: v.string(),
    value: v.string(),
    flag: v.string(),
  }),
  userRequests: defineTable({
    clerkId: v.string(),
    lastRequestTimestamp: v.number(),
    requestCount: v.number(),
    timezone: v.string(), // timezone of the user
  }).index('by_clerk_id', ['clerkId']),
  notifications: defineTable({
    authorClerkId: v.string(),
    type: v.union(v.literal('comment'), v.literal('reply')),
    read: v.boolean(),
    tweakId: v.id('tweaks'),
    city: v.string(),
    senderClerkId: v.string(),
  }).index('by_author_clerk_id', ['authorClerkId']),
});
