"use client";

import { ListWithItemProduct } from "@/types/schema/lists";
import { useEffect, useState } from "react";
import ListFilter from "./ListFilter";
import ListItems from "./ListItems";

type ListDetailsPageProps = {
  list: ListWithItemProduct;
};

const ListDetailsPage = ({ list }: ListDetailsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState(list.items ?? []);

  useEffect(() => {
    if (!searchQuery) {
      setItems(list.items);
    } else {
      const filteredItems = list.items.filter((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setItems(filteredItems);
    }
  }, [searchQuery]);

  return (
    <div className="grid gap-4">
      <ListFilter
        onChangeText={(text) => setSearchQuery(text)}
        label="Search"
        description="Search list by item name..."
      />
      <ListItems items={items || []} disableSelect />
    </div>
  );
};

export default ListDetailsPage;
