import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const cityExists = query({
  args: {
    city: v.string(),
    region: v.string(),
  },
  handler: async (ctx, args) => {
    const city = await ctx.db
      .query('cities')
      .filter((q) =>
        q.and(
          q.eq(q.field('city'), args.city),
          q.eq(q.field('region'), args.region)
        )
      )
      .first();

    if (city) {
      return true;
    }

    return false;
  },
});

export const addCity = mutation({
  args: {
    city: v.string(),
    region: v.string(),
    flag: v.string(),
  },
  handler: async (ctx, args) => {
    const cityValue = `${args.city.toLowerCase()}-new`;
    try {
      await ctx.db.insert('cities', {
        city: args.city,
        region: args.region,
        value: cityValue,
        flag: args.flag,
      });
      return {
        success: true,
        message: 'City added successfully'!,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Sorry, there was an issue adding this city',
      };
    }
  },
});

export const getGroupedCities = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db.query('cities').collect();

    // Group cities by value to separate on frontend
    const groupedCities = {
      existing: cities.filter((city) => !city.value.endsWith('-new')),
      new: cities.filter((city) => city.value.endsWith('-new')),
    };

    return groupedCities;
  },
});

export const getNewCities = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db.query('cities').order('desc').collect();
    return cities.filter((city) => city.value.endsWith('-new')).slice(0, 5);
  },
});

export const getPopularCities = query({
  args: {},
  handler: async (ctx) => {
    const tweaks = await ctx.db.query('tweaks').collect();

    // Count occurrences of each city
    const cityCounts = tweaks.reduce(
      (acc, tweak) => {
        acc[tweak.city] = (acc[tweak.city] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const popularCities = await Promise.all(
      Object.entries(cityCounts).map(async ([cityValue, count]) => {
        const cityInfo = await ctx.db
          .query('cities')
          .withIndex('by_value', (q) => q.eq('value', cityValue))
          .first();

        return {
          cityInfo, // Return the entire city document
          count: count, // Use the actual count for this specific city
        };
      })
    );

    return popularCities;
  },
});
