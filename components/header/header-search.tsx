'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { useEffect, useRef, useState } from 'react';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

export function HeaderSearch({
  preloadedCities,
}: {
  preloadedCities: Preloaded<typeof api.cities.getGroupedCities>;
}) {
  const groupedCities = usePreloadedQuery(preloadedCities);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const router = useRouter();
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <Command className="w-full" ref={commandRef}>
        <CommandInput
          placeholder="Search for city"
          onFocus={() => setOpen(true)}
          value={value}
          onValueChange={setValue}
        />
        {open && (
          <CommandList className="absolute top-full w-full z-50 mt-1 bg-white shadow-md">
            <CommandEmpty className="border rounded text-sm p-4">
              No cities found.
            </CommandEmpty>
            {groupedCities.new.length > 0 && (
              <CommandGroup heading="New Cities">
                {groupedCities.new.map((city) => (
                  <CommandItem
                    key={city.value}
                    value={city.value}
                    onSelect={(currentValue) => {
                      setValue(city.city);
                      setOpen(false);
                      router.push(`/cT/${currentValue}`);
                    }}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={city.flag}
                      alt={city.city}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <p className="text-sm">{city.city}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {groupedCities.existing.length > 0 && (
              <CommandGroup heading="Top 25 U.S. Cities">
                {groupedCities.existing.map((city) => (
                  <CommandItem
                    key={city.value}
                    value={city.value}
                    onSelect={(currentValue) => {
                      setValue(city.city);
                      setOpen(false);
                      router.push(`/cT/${currentValue}`);
                    }}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={city.flag}
                      alt={city.city}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <p className="text-sm">{city.city}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
