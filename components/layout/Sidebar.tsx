"use client";

import { dashboardRoutes } from "@/data/routes";
import useDeviceType from "@/hooks/useDeviceType";
import { Menu } from "lucide-react"; // Assuming you're using lucide-react for icons
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "../features/auth/SignOutButton";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const Sidebar = () => {
  const device = useDeviceType();

  if (device === "mobile") {
    return <MobileSidebar />;
  }

  return <DesktopSidebar />;
};

export default Sidebar;

const MobileSidebar = () => {
  const path = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={30} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] flex flex-col justify-between"
          >
            <div>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                {dashboardRoutes.map((route) => {
                  const isActive = route.route === path;
                  return (
                    <Link key={route.route} href={route.route}>
                      <Button
                        className="w-full text-start items-start justify-start mb-2"
                        variant={isActive ? "secondary" : "ghost"}
                      >
                        {route.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="mt-auto">
              <SignOutButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

const DesktopSidebar = () => {
  const path = usePathname();

  return (
    <div className="w-64 h-screen bg-white border-r overflow-y-auto p-4 flex flex-col justify-between py-8">
      <div>
        <div className="pb-4 pl-4 mb-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <div className="grid gap-4 w-full">
          {dashboardRoutes.map((route) => {
            const isActive = route.route == path;

            return (
              <Link href={route.route} className="w-full">
                <Button
                  className="w-full text-start items-start justify-start"
                  variant={isActive ? "secondary" : "ghost"}
                >
                  {route.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <SignOutButton />
      </div>
    </div>
  );
};
