type Route = {
  route: string;
  label: string;
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
    label: "Products",
  },
  {
    route: "/dashboard/orders",
    label: "Orders",
  },
  {
    route: "/dashboard/accounts",
    label: "Accounts",
  },
  {
    route: "/dashboard/settings",
    label: "Settings",
  },
];
