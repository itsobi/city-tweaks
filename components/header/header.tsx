import { HeaderSearch } from './header-search';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { CreateCityTweakButton } from '../create-city-tweak-button';
import { SignedIn } from '@clerk/nextjs';
import { SignedOut, SignInButton } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 border-b border-yellow-500 sticky top-0 bg-background h-16 overflow-x-hidden">
      <SidebarTrigger />

      {/* Hidden div for spacing */}
      <div className="hidden md:block" />

      <HeaderSearch />

      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline">
              <LogIn /> Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <CreateCityTweakButton />
        </SignedIn>
      </div>
    </header>
  );
}
