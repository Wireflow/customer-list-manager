import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useListById = (listId: string) => {
  return useQuery({
    queryKey: ["list", listId],
    queryFn: () => fetchListById(listId),
  });
};

export const fetchListById = async (listId: string) => {
  const supabase = createClient();

  if (!supabase.auth.getSession()) {
    throw new Error("Unauthorized");
  }

  const { data: list, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      items:listItems( 
        *,
        product:products!inner(*)
      )
    `
    )
    .eq("id", listId)
    .single();

  if (error) {
    throw error;
  }

  return list;
};
