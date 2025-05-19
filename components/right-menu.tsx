'use client';

import { NewCities } from './rightMenu/new-cities';
import { PopularCities } from './rightMenu/popular-cities';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export function RightMenu() {
  const { user } = useUser();
  const pathname = usePathname();

  const isManageAccountPage = pathname === '/manage-account';

  if (!user) return null;

  return (
    <div
      className={cn(
        'hidden xl:block w-1/3 border-l border-l-yellow-500 p-4 sticky top-[64px] h-[calc(100vh-64px)]',
        isManageAccountPage && 'xl:hidden'
      )}
    >
      <div className="flex flex-col gap-8">
        <PopularCities userId={user.id} />

        <NewCities userId={user.id} />
      </div>
    </div>
  );
}
