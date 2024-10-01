import { createClient } from "@/utils/supabase/server";
import CustomListPage from "@/webpages/shared-list/CustomListPage";
import FullListPage from "@/webpages/shared-list/FullListPage";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

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

  // Check if current date is after the expiration date
  if (currentDate > expirationDate) {
    return <div>This link expired</div>;
  }

  if (sharedList.type === "full") {
    const { data: fullList, error } = await supabase
      .from("products")
      .select("*")
      .eq("branchId", sharedList.branchId);

    return <CustomListPage products={fullList ?? []} />;
  }

  if (sharedList.type === "custom" && sharedList.listId) {
    const { data: customList, error } = await supabase
      .from("listItems")
      .select("*, product:products!inner(*)")
      .eq("listId", sharedList?.listId);

    const formattedListItems = customList?.map((item) => ({
      ...item.product,
    }));

    return <CustomListPage products={formattedListItems ?? []} />;
  }

  return <div>Not Found</div>;
};

export default SharedList;
