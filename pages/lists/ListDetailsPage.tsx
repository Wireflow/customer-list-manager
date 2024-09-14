"use client";

import NoData from "@/components/ui/no-data";
import { useListById } from "@/hooks/queries/lists/useListById";
import { useEffect, useState } from "react";
import ListFilter from "../../components/features/lists/ListFilter";
import ListItems from "../../components/features/lists/ListItems";
import ListDetailsActions from "@/components/features/lists/ListDetailsActions";

type ListDetailsPageProps = {
  id: string;
};

const ListDetailsPage = ({ id }: ListDetailsPageProps) => {
  const { data: list, isLoading, error } = useListById(id);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(list?.items ?? []);

  useEffect(() => {
    if (list?.items) {
      if (!searchQuery) {
        setFilteredItems(list.items);
      } else {
        const filtered = list.items.filter((item) =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredItems(filtered);
      }
    }
  }, [searchQuery, list?.items]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <NoData
        variant="error"
        message="Unable to fetch lists. Please try again later."
      />
    );
  }

  if (!list) {
    return (
      <NoData
        variant="no-records"
        message="No list found. Create your first list to get started!"
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-4 md:flex-row justify-between md:items-end">
        <ListFilter
          onChangeText={setSearchQuery}
          label="Search"
          description="Search list by item name..."
        />
        <ListDetailsActions />
      </div>
      <ListItems items={filteredItems} listId={id} />
    </div>
  );
};

export default ListDetailsPage;
