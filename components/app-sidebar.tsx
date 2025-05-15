'use client';

import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

import { ChevronUp, LogIn, LogOut, SquarePlus, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import logo from '@/public/logo.png';
import {
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { Button } from './ui/button';
import Link from 'next/link';
import { CreateCityTweakButton } from './create-city-tweak-button';
import { usePathname } from 'next/navigation';
import { useCityTweakStore } from '@/lib/store';

export function AppSidebar() {
  const { user } = useUser();
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      className="border-r-4 border-yellow-500 shadow z-50"
    >
      <div className="flex justify-center">
        <Link
          href={'/'}
          onClick={() => {
            if (isMobile) toggleSidebar();
          }}
        >
          <Image src={logo} alt="logo" className="h-32 w-32 object-contain" />
        </Link>
      </div>
      <SignedIn>
        <SidebarGroup className="mt-12">
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <CreateCityTweakButton sidebar={true} />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/add-city'}>
                  <Link
                    onClick={() => {
                      if (isMobile) toggleSidebar();
                    }}
                    href="/add-city"
                  >
                    <SquarePlus />
                    Add City
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SignedIn>
      <SidebarContent />
      <SidebarFooter>
        <SidebarMenu>
          <SignedIn>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Image
                      src={user?.imageUrl || ''}
                      alt={user?.username || ''}
                      className="rounded-full"
                      width={24}
                      height={24}
                    />
                    {user?.username}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/manage-account"
                      onClick={() => {
                        if (isMobile) toggleSidebar();
                      }}
                    >
                      <User />
                      Manage Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <SignOutButton>
                      <span
                        onClick={() => {
                          if (isMobile) toggleSidebar();
                        }}
                      >
                        <LogOut /> Sign Out
                      </span>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SignedIn>

          <SignedOut>
            <SidebarMenuItem>
              <SignInButton mode="modal">
                <Button variant={'outline'} className="w-full">
                  <LogIn /> Sign In
                </Button>
              </SignInButton>
            </SidebarMenuItem>
          </SignedOut>
        </SidebarMenu>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Brought to you by{' '}
          <a
            href="https://justobii.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            justobii.com
          </a>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
