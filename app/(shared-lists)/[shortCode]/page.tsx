import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    shortCode: string;
  };
};

const ShortendUrl = async ({ params: { shortCode } }: Props) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("shortUrls")
    .select("originalUrl")
    .eq("shortCode", shortCode)
    .single();

  if (error) {
    return redirect("/not-found");
  }

  return redirect(data.originalUrl);
};

export default ShortendUrl;
