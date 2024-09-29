import { createClient } from "@/utils/supabase/server";
import ConsentPage from "@/webpages/consent/ConsentPage";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const Consent = async ({ params }: Props) => {
  const supabase = createClient();

  const { data: branch } = await supabase
    .from("branch")
    .select("id")
    .eq("id", params.id);

  if (!branch) {
    return redirect("/not-found");
  }

  return <ConsentPage />;
};

export default Consent;
