import { useEffect, useState } from "react";

type RecordType = Record<string, any>;

type NestField<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestField<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type Params<T> = {
  items: T[];
  field: NestField<T>;
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
          return value
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        });
        setFilteredItems(filtered);
      }
    }
  }, [searchQuery, items, field]);

  return { filteredItems, searchQuery, setSearchQuery };
};
