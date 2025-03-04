import { SignedIn, UserButton } from '@clerk/nextjs'
import ToggleSidebar from "./toggle-sidebar";
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
    userName: string | null;
}


export function Header({ userName }: HeaderProps){
    const { isConnected } = useAccount();

  return (
    <header className="flex items-center justify-between w-full border-b px-4 md:px-6 h-16 md:h-24 py-4">
      <ToggleSidebar />
      <div className="sm:flex hidden flex-col md:gap-1">
        <h1 className="text-base sm:text-lg md:text-2xl font-semibold">
            Welcome {userName || "Guest"}!
        </h1>
        <p className="text-xs sm:text-xs md:text-sm text-muted-foreground">
            {isConnected ? "Connected" : "Connect wallet for a seamless transaction"}
        </p>
      </div>
      <div className="flex items-center gap-4">

        <ConnectButton />

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
