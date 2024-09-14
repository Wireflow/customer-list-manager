import { Row } from "../supabase/table";
import { ListItemWithProduct } from "./listItems";

export type ListWithItems = Row<"lists"> & {
  items: Row<"listItems">[];
};

export type ListWithItemProduct = Row<"lists"> & {
  items: ListItemWithProduct[];
};
