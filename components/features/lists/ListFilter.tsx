"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";

type Props = {
  onChangeText: (text: string) => void;
  label?: string;
  description?: string;
};

const ListFilter = ({ onChangeText, label, description }: Props) => {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);

  useEffect(() => {
    onChangeText(query);
  }, [debounced]);

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <Input
        placeholder="Item name"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className="md:max-w-[400px]"
      />
      {description && <p className="text-gray-600 text-xs">{description}</p>}
    </div>
  );
};

export default ListFilter;
