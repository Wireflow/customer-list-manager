"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";

type Props = {
  onChangeText: (text: string) => void;
  label?: string;
  description?: string;
  className?: string;
};

const ListFilter = ({ onChangeText, label, description, className }: Props) => {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);

  useEffect(() => {
    onChangeText(query);
  }, [debounced]);

  return (
    <div className="flex flex-col w-full md:max-w-[500px] gap-2">
      {label && <Label>{label}</Label>}
      <Input
        placeholder="Item name"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className={cn("md:max-w-[500px]", className)}
      />
      {description && <p className="text-gray-600 text-xs">{description}</p>}
    </div>
  );
};

export default ListFilter;
