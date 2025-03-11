"use client";
import { AdminMobileSidebar } from "@/components/admin-mobile-sidebar";
import AdminSidebar from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { useUser } from "@clerk/nextjs";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useUser()
  const userName = user?.username;

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="hidden md:block">
            <AdminSidebar />
        </div>
        <AdminMobileSidebar />
        <div className="w-full md:flex-grow h-full">
            <AdminHeader userName={userName} />{" "}
            <div className="h-[calc(100dvh-6rem)] md:p-12">
                {children}
            </div>
        </div>
    </div>
  );
};

export default Layout;

