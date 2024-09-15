"use client";

import ListsActions from "@/components/features/lists/ListsActions";
import ListsList from "@/components/features/lists/ListsList";
import NoData from "@/components/ui/no-data";
import { useLists } from "@/hooks/queries/lists/useLists";

type ListsPageProps = {};

const ListsPage = (props: ListsPageProps) => {
  const { data: lists, error } = useLists();

  return (
    <div className="grid ">
      <ListsActions />
      <div className="grid gap-4 mt-8 md:mt-2">
        <h1 className="text-lg font-semibold text-gray-900">Your Lists</h1>
        {error ? (
          <NoData
            variant="error"
            message="Unable to fetch lists. Please try again later."
          />
        ) : lists && lists.length > 0 ? (
          <ListsList lists={lists} />
        ) : (
          <NoData
            variant="no-records"
            message="No lists found. Create your first list to get started!"
          />
        )}
      </div>
    </div>
  );
};

export default ListsPage;
