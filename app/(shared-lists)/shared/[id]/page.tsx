import { createClient } from "@/utils/supabase/server";
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

    return <div>{JSON.stringify(fullList, null, 2)}</div>;
  }

  if (sharedList.type === "custom" && sharedList.listId) {
    const { data: customList, error } = await supabase
      .from("listItems")
      .select("*, product:products!inner(*)")
      .eq("listId", sharedList?.listId);

    return <div>{JSON.stringify(customList, null, 2)}</div>;
  }

  return <div>Not Found</div>;
};

export default SharedList;
