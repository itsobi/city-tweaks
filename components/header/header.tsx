import { HeaderSearch } from './header-search';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { CreateCityTweakButton } from '../create-city-tweak-button';
import { SignedIn } from '@clerk/nextjs';
import { SignedOut, SignInButton } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';
import { Notifications } from './notifications';

import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';

export async function Header() {
  const { userId } = await auth();
  const preloadedNotifications = await preloadQuery(
    api.notifications.getNotifications,
    {
      clerkId: userId ?? '',
    }
  );
  return (
    <header className="flex items-center justify-between gap-4 px-4 border-b border-yellow-500 sticky top-0 bg-background h-16 z-50">
      <SidebarTrigger />

      {/* Hidden div for spacing */}
      <div className="hidden md:block" />

      <div className="w-[300px]">
        <HeaderSearch />
      </div>

      <div className="flex items-center gap-1.5">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="hidden lg:flex items-center">
              <LogIn /> Sign In
            </Button>
          </SignInButton>
          <SignInButton mode="modal">
            <Button variant="outline" size={'icon'} className="lg:hidden">
              <LogIn />
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Notifications preloadedNotifications={preloadedNotifications} />
          <div>
            <CreateCityTweakButton />
          </div>
        </SignedIn>
      </div>
    </header>
  );
}
