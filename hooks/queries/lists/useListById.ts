import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useListById = (listId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["lists", listId],
    queryFn: () => fetchListById(listId),
    enabled,
  });
};

export const fetchListById = async (listId: string) => {
  const supabase = createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: list, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      items:listItems( 
        *,
        product:products!inner(
          *,
          imageUrls:product_images(*)
        )
      )
    `
    )
    .eq("id", listId)
    .order("createdAt", {
      foreignTable: "items.product.imageUrls",
      ascending: true,
    })
    .single();

  if (error) {
    throw error;
  }

  if (list && list.items) {
    list.items.forEach((item) => {
      if (item.product && item.product.imageUrls) {
        item.product.imageUrls.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });
  }

  return list;
};
