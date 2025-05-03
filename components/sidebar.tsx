"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import DashLogo from "./dashlogo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { closeSidebar } from "@/store/sideBar";
import { useDispatch } from "react-redux";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "iconamoon:home-light" },
  {
    name: "Portfolio",
    href: "/dashboard/portfolio",
    icon: "bytesize:portfolio",
  },
  { name: "Buy/Sell", href: "/dashboard/buy-sell", icon: "icon-park-outline:exchange" },
  { name: "CopyTrade", href: "/dashboard/copytrade", icon: "ph:copy-light" },
  { name: "Deposit", href: "/dashboard/deposit", icon: "ph:hand-deposit" },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: "ph:hand-withdraw" },
  { name: "History", href: "/dashboard/history", icon: "solar:history-bold" },
];

const secondaryNavigation = [
  {
    name: "Support",
    href: "/dashboard/support",
    icon: "tabler:lifebuoy",
  },
  { 
    name: "Help", 
    href: "/dashboard/help", 
    icon: "tabler:help" 
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  return (
    <div className="flex h-full w-56 flex-col border-r bg-white dark:bg-appDark">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <DashLogo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => dispatch(closeSidebar())}
              className={cn(
                "group flex items-center gap-3 text-appDarkCard dark:text-white rounded-lg px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-appCardGold dark:text-appDarkCard"
                  : "hover:bg-appGold20"
              )}
            >
              <Icon
                strokeWidth={1.5}
                icon={`${item.icon}`}
                className="h-5 w-5 text-3xl"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <nav className="mt-auto space-y-1 border-t px-3 py-4">
        <span
          onClick={() => {
            toggleTheme();
            dispatch(closeSidebar());
          }}
          className="group cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium dark:text-white text-appDarkCard hover:bg-appGold20"
        >
          <Icon
            icon={
              theme === "light"
                ? "iconamoon:mode-dark-light"
                : "entypo:light-up"
            }
            strokeWidth={1.5}
            className="h-5 w-5 text-3xl"
          />
          {theme === "light" ? "Dark mode" : "Light mode"}
        </span>
        {secondaryNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => dispatch(closeSidebar())}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium dark:text-white text-appDarkCard hover:bg-appGold20",
              pathname === item.href
                ? "bg-appCardGold dark:text-appDarkCard"
                : ""
            )}
          >
            <Icon
              strokeWidth={1.5}
              icon={`${item.icon}`}
              className="h-5 w-5 text-3xl"
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}