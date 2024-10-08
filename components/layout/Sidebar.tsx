"use client";

import { dashboardRoutes } from "@/data/routes";
import useDeviceType from "@/hooks/useDeviceType";
import { useSession } from "@/hooks/queries/auth/useSession";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SignOutButton from "../features/auth/SignOutButton";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { UserRole } from "@/types/validation/users";

const Sidebar = () => {
  const device = useDeviceType();
  return device === "mobile" ? <MobileSidebar /> : <DesktopSidebar />;
};

export default Sidebar;

const isRouteAllowed = (
  routeRoles: UserRole[] | undefined,
  userRole: UserRole | undefined
): boolean => {
  // If no roles are specified for the route, it's allowed for everyone
  if (!routeRoles || routeRoles.length === 0) return true;
  // If user role is undefined, don't allow access to role-specific routes
  if (!userRole) return false;
  // Check if the user's role is included in the route's allowed roles
  return routeRoles.includes(userRole);
};

const MobileSidebar = () => {
  const { session } = useSession();
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const userRole = session?.user.user_metadata.role as UserRole | undefined;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <Sheet open={open} onOpenChange={setOpen}>
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
                <SheetTitle className="pl-4">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                {dashboardRoutes.map((route) => {
                  const isActive = route.route === path;
                  const isAllowed = isRouteAllowed(route.roles, userRole);
                  return (
                    isAllowed && (
                      <Link
                        key={route.route}
                        href={route.route}
                        onClick={() => setOpen(false)}
                      >
                        <Button
                          className="w-full text-start items-start justify-start mb-2"
                          variant={isActive ? "secondary" : "ghost"}
                        >
                          {route.label}
                        </Button>
                      </Link>
                    )
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
  const { session } = useSession();
  const path = usePathname();
  const userRole = session?.user.user_metadata.role as UserRole | undefined;

  return (
    <div className="w-64 h-screen bg-white border-r overflow-y-auto p-4 flex flex-col justify-between py-8">
      <div>
        <div className="pb-4 pl-4 mb-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <div className="grid gap-4 w-full">
          {dashboardRoutes.map((route) => {
            const isActive = route.route === path;
            const isAllowed = isRouteAllowed(route.roles, userRole);

            return (
              isAllowed && (
                <Link href={route.route} className="w-full" key={route.route}>
                  <Button
                    className="w-full text-start items-start justify-start"
                    variant={isActive ? "secondary" : "ghost"}
                  >
                    {route.label}
                  </Button>
                </Link>
              )
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
