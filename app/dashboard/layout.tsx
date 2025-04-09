"use client";
import "@/app/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Header } from "@/components/header";
import { MobileSidebar } from "@/components/mobile-sidebar";
import Sidebar from "@/components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/constants/wagmi";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { updateUserMetadata } from "../actions/role";

// export const metadata = {
//   title: "CopyTradeMarkets: UserDashboard",
//   description: "Make transactions and purchase stocks with CopyTradeMarkets",
// };

const queryClient = new QueryClient();

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useUser();
  console.log("Public metadata", user?.publicMetadata);
  console.log("User", user);
  const userName = user?.username || null;

  // Initialize metadata if it doesn't exist
  useEffect(() => {
    const initializeMetadata = async () => {
      if (user) {
        const metadata = user.publicMetadata;

        // Check if metadata is empty
        if (Object.keys(metadata).length === 0) {
          try {
            // Update metadata with default values
            await updateUserMetadata({
              userId: user.id,
              metadata: {
                role: "user",
                currentValue: 0,
                totalInvestment: 0,
                roi: 0,
                kycStatus: false,
                accountStatus: false,
              },
            });
            console.log("Metadata initialized successfully");
          } catch (err) {
            console.error("Failed to initialize metadata:", err);
          }
        }
      }
    };

    initializeMetadata();
  }, [user]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="flex font-poppins h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            <MobileSidebar />
            <div className="w-full md:flex-grow h-full">
              <Header userName={userName} />
              <div className="lg:h-[calc(100dvh-6rem)] p-4 md:p-12">{children}</div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Layout;