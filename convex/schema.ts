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
});
