import { Row } from "../supabase/table";

export type ListItemWithProduct = Row<"listItems"> & {
  product: Row<"products">;
};
