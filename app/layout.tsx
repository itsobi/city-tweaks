import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from './convex-client-provider';
import { Toaster } from 'sonner';
import { RightMenu } from '@/components/right-menu';

export const metadata: Metadata = {
  title: 'City Tweaks',
  description: 'What about your city would you tweak?',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SidebarProvider>
            <ConvexClientProvider>
              <AppSidebar />
              <main className="flex-1 flex flex-col min-h-screen">
                <Header />
                <div className="flex">
                  <div className="flex flex-1">
                    <div className="overflow-auto w-full">{children}</div>
                    <div className="hidden xl:block w-1/3 border-l border-l-yellow-500 p-4 sticky top-[64px] h-[calc(100vh-64px)]">
                      <RightMenu />
                    </div>
                  </div>
                </div>
              </main>
              <Toaster richColors />
            </ConvexClientProvider>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
