"use client";

import ListsActions from "@/components/features/lists/ListsActions";
import ListsList from "@/components/features/lists/ListsList";
import { useLists } from "@/hooks/queries/lists/useLists";

type ListsPageProps = {};

const ListsPage = (props: ListsPageProps) => {
  const { data: lists, error, isLoading } = useLists();

  return (
    <div className="grid ">
      <ListsActions />
      <div className="grid gap-4 mt-8 md:mt-2">
        <h1 className="text-lg font-semibold text-gray-900">Your Lists</h1>
        <ListsList lists={lists ?? []} error={error} loading={isLoading} />
      </div>
    </div>
  );
};

export default ListsPage;
