import ToggleSidebar from "./toggle-sidebar";
import { SignedIn, UserButton } from '@clerk/nextjs'

interface HeaderProps {
    userName: string | null | undefined;
}


export function AdminHeader({ userName }: HeaderProps){

  return (
    <header className="flex items-center justify-between w-full border-b px-4 md:px-6 h-16 md:h-24 py-4">
      <ToggleSidebar />
      <div className="sm:flex hidden flex-col md:gap-1">
        <h1 className="text-base sm:text-lg md:text-2xl font-semibold">
            Welcome {userName || "Guest"}!
        </h1>
      </div>
      <div className="flex items-center gap-4">


      <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
