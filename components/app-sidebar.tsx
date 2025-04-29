'use client';

import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

import { ChevronUp, LogIn, LogOut, SquarePen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import logo from '@/public/logo.png';
import { SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { Button } from './ui/button';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';

export function AppSidebar() {
  const { user } = useUser();
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <Sidebar variant="sidebar" className="border-r-4 border-yellow-500 shadow">
      <Link
        href={'/'}
        onClick={() => {
          if (isMobile) toggleSidebar();
        }}
        className="flex justify-center w-full h-10"
      >
        <Image src={logo} alt="logo" className="h-32 w-32 object-contain" />
      </Link>
      <SidebarGroup className="mt-12">
        <SidebarGroupLabel>Actions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SignedIn>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/cities">
                    <SquarePen />
                    Add City
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SignedIn>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
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
