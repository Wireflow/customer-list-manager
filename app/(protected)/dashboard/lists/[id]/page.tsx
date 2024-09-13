import PageHeader from "@/components/layout/PageHeader";
import NoData from "@/components/ui/no-data";
import ListDetailsPage from "@/pages/lists/ListDetailsPage";
import { createClient } from "@/utils/supabase/server";
import React, { Suspense } from "react";

type Props = {
  params: {
    id: string;
  };
};

const ListDetails = async ({ params: { id } }: Props) => {
  const supabase = createClient();

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
    .eq("id", id)
    .single();

  return (
    <div>
      <PageHeader title="List Details" />

      <Suspense fallback={<p>loading...</p>}>
        {error ? (
          <NoData
            variant="error"
            message="Unable to fetch lists. Please try again later."
          />
        ) : list ? (
          <ListDetailsPage list={list} />
        ) : (
          <NoData
            variant="no-records"
            message="No lists found. Create your first list to get started!"
          />
        )}
      </Suspense>
    </div>
  );
};

export default ListDetails;
