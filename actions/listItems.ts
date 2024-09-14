"use server";

import { Insert, Row } from "@/types/supabase/table.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const deleteListItem = async (listItemId: number) => {
  const supabase = createClient();

  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("listItems")
    .delete()
    .eq("id", listItemId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const createBulkListItems = async ({
  products,
  listId,
}: {
  products: Row<"products">[];
  listId: string;
}) => {
  const supabase = createClient();

  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const listItems: Insert<"listItems">[] = products.map((product) => ({
    listId: listId,
    productId: product.id,
  }));

  const { error } = await supabase.from("listItems").insert(listItems);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
