import { useEffect, useState } from "react";

type RecordType = Record<string, any>;

type Params<T> = {
  items: T[];
  field: string;
};

const getNestedValue = (obj: RecordType, path: string): any => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const useFilterItems = <T extends RecordType>(params: Params<T>) => {
  const { items, field } = params;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<T[]>(items ?? []);

  useEffect(() => {
    if (items) {
      if (!searchQuery) {
        setFilteredItems(items);
      } else {
        const filtered = items.filter((item) => {
          const value = getNestedValue(item, field);
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
        setFilteredItems(filtered);
      }
    }
  }, [searchQuery, items, field]);

  return { filteredItems, searchQuery, setSearchQuery };
};
