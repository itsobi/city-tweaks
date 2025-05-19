'use client';

import { api } from '@/convex/_generated/api';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function NewCities({ userId }: { userId: string }) {
  const newCities = useQuery(api.cities.getNewCities);

  // getNewCities

  if (newCities?.length) {
    return (
      <>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-muted-foreground">🆕 New Cities</p>
          {userId && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/add-city">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
        <ScrollArea className="h-[180px]">
          <div className="flex flex-col gap-2">
            {newCities.map((city) => (
              <Link
                href={`/cT/${city.value}`}
                key={city._id}
                className=" border rounded-md p-2 flex items-center gap-4 text-sm hover:bg-gray-100 transition-all duration-200 ease-in-out"
              >
                <div className="flex items-center">
                  <img
                    src={city.flag}
                    alt={city.city}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold">{city.city},</p>
                  <p>{city.region}</p>
                </div>
                <div className="border border-transparent rounded-full p-1 text-xs font-bold bg-yellow-500 text-white">
                  NEW
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </>
    );
  }
  return null;
}
