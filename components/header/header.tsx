import Image from 'next/image';
import logo from '../../public/logo.png';
import { HeaderSearch } from './header-search';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { CreatePostButton } from '../create-post-button';

export function Header() {
  return (
    <header className="flex justify-between items-center border-b border-gray-200 px-4 h-16">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-2" />
        <Image
          src={logo}
          alt="logo"
          className="hidden lg:block mr-2 lg:mr-0 w-[100px]"
        />
      </div>

      <div className="max-w-[500px] w-full mr-2 lg:mr-0">
        <HeaderSearch />
      </div>

      <div>
        {/* <Button variant={'outline'} className="">
          Sign In
        </Button> */}
        <CreatePostButton />
      </div>
    </header>
  );
}
