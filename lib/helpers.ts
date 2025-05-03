import { Doc } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';

export async function enrichWithUsers<T extends { authorId: string }>(
  ctx: QueryCtx,
  items: T[]
): Promise<(T & { author: Doc<'users'> | undefined })[]> {
  // Get unique author IDs
  const uniqueClerkIds = [...new Set(items.map((item) => item.authorId))];

  // Fetch all users in parallel
  const users = await Promise.all(
    uniqueClerkIds.map((clerkId) =>
      ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
        .first()
    )
  );

  // Create user map
  const userMap = new Map(
    users.map((user, index) => [uniqueClerkIds[index], user ?? undefined])
  );

  // Enrich items with author information
  return items.map((item) => ({
    ...item,
    author: userMap.get(item.authorId),
  }));
}
