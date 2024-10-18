import { createClient } from "@/utils/supabase/server";
import CustomListPage from "@/webpages/shared-list/CustomListPage";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export const revalidate = 3000; // 3 seconds

const SharedList = async ({ params: { id } }: Props) => {
  const supabase = createClient();

  const { data: sharedList, error } = await supabase
    .from("sharedLists")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !sharedList) {
    return redirect("/not-found");
  }

  const currentDate = new Date().getTime();
  const expirationDate = new Date(sharedList.expirationTime).getTime();

  if (currentDate > expirationDate || sharedList.forceExpire) {
    return redirect("/not-found");
  }

  if (sharedList.type === "full") {
    const { data: fullList } = await supabase
      .from("products")
      .select("*, imageUrls:product_images(*)")
      .order("createdAt", {
        referencedTable: "product.imageUrls",
        ascending: true,
      })
      .eq("branchId", sharedList.branchId);

    return (
      <CustomListPage
        sharedList={sharedList}
        products={fullList ?? []}
        branchId={sharedList.branchId}
      />
    );
  }

  if (sharedList.type === "custom" && sharedList.listId) {
    const { data: customList } = await supabase
      .from("listItems")
      .select("*, product:products!inner(*, imageUrls:product_images(*))")
      .order("createdAt", {
        referencedTable: "product.imageUrls",
        ascending: true,
      })
      .eq("listId", sharedList?.listId);

    const formattedListItems = customList?.map((item) => ({
      ...item.product,
    }));

    return (
      <CustomListPage
        sharedList={sharedList}
        products={formattedListItems ?? []}
        branchId={sharedList.branchId}
      />
    );
  }

  return redirect("/not-found");
};

export default SharedList;
