'use client';

import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { ScrollArea } from '../ui/scroll-area';
import { Dot, UserRoundPen } from 'lucide-react';
import Link from 'next/link';

export function PopularCities({
  preloadedPopularCities,
}: {
  preloadedPopularCities: Preloaded<typeof api.cities.getPopularCities>;
}) {
  const popularCities = usePreloadedQuery(preloadedPopularCities);

  return (
    <ScrollArea className="h-[180px]">
      <div className="flex flex-col gap-2">
        {popularCities.map((city) => {
          if (city.count > 1) {
            return (
              <Link
                href={`/cT/${city.cityInfo?.value}`}
                key={city.cityInfo?.city}
                className="border rounded-md p-2 flex items-center gap-4 text-sm hover:bg-gray-100 transition-all duration-200 ease-in-out"
              >
                <div className="flex items-center">
                  <img
                    src={city.cityInfo?.flag}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold">{city.cityInfo?.city},</p>
                  <p>{city.cityInfo?.region}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  <span className="text-muted-foreground">
                    {city.count} tweaks
                  </span>
                </div>
              </Link>
            );
          } else {
            return null;
          }
        })}
      </div>
    </ScrollArea>
  );
}
