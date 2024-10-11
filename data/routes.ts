import { UserRole } from "@/types/validation/users";

type Route = {
  route: string;
  label: string;
  roles?: UserRole[];
};

export const dashboardRoutes: Route[] = [
  {
    route: "/dashboard/home",
    label: "Home",
  },
  {
    route: "/dashboard/lists",
    label: "Lists",
  },
  {
    route: "/dashboard/products",
    label: "Inventory",
  },
  {
    route: "/dashboard/orders",
    label: "Orders",
  },
  {
    route: "/dashboard/groups",
    label: "Groups",
  },
  {
    route: "/dashboard/accounts",
    label: "Accounts",
  },
  {
    route: "/dashboard/financials",
    label: "Financials",
    roles: ["admin", "superadmin", "owner"],
  },
  {
    route: "/dashboard/settings",
    label: "Settings",
    roles: ["admin", "superadmin", "owner"],
  },
];
