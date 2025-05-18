import { api } from '@/convex/_generated/api';
import { NewCities } from './rightMenu/new-cities';
import { PopularCities } from './rightMenu/popular-cities';

import { preloadQuery } from 'convex/nextjs';
import { Button } from './ui/button';
import { ChevronRightIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { CreateCityTweakButton } from './create-city-tweak-button';
import { auth } from '@clerk/nextjs/server';

export async function RightMenu() {
  const { userId } = await auth();
  const preloadedNewCities = await preloadQuery(api.cities.getNewCities);
  const preloadedPopularCities = await preloadQuery(
    api.cities.getPopularCities
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-muted-foreground">
            🔥 Popular City Tweaks
          </p>
          {userId && <CreateCityTweakButton plusIcon />}
        </div>
        <PopularCities preloadedPopularCities={preloadedPopularCities} />
      </div>
      <div>
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
        <NewCities preloadedNewCities={preloadedNewCities} />
      </div>
    </div>
  );
}
