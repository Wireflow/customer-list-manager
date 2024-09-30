"use client";

import List, { RenderItemFunction } from "@/components/ui/list";
import { ListWithItems } from "@/types/schema/lists";
import ListCard from "./ListCard";

type Props = {
  lists: ListWithItems[];
  loading: boolean;
  error: any;
};

const ListsList = ({ lists, loading, error }: Props) => {
  const renderListItem: RenderItemFunction<ListWithItems> = (list, index) => (
    <ListCard list={list} key={list.id} />
  );

  return (
    <List<ListWithItems>
      data={lists}
      renderItem={renderListItem}
      isLoading={loading}
      error={error}
      loadingMessage="Loading your lists..."
      errorMessage="Unable to fetch lists. Please try again later."
      emptyMessage="No lists found. Create your first list to get started!"
      containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    />
  );
};

export default ListsList;
