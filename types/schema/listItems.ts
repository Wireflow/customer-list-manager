import { Row } from "../supabase/table.types";

export type ListItemWithProduct = Row<"listItems"> & {
  product: Row<"products">;
};
