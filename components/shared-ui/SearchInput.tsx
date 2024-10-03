import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input, InputProps } from "../ui/input";
import { Label } from "../ui/label";

type Props = Omit<InputProps, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  inputClassName?: string;
};

const SearchInput = ({
  value,
  onChange,
  placeholder,
  description,
  inputClassName,
  label,
  ...props
}: Props) => {
  const [query, setQuery] = useState(value);
  const debounced = useDebounce(query, 500);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  return (
    <div className={cn("space-y-1 w-full ", props.className)}>
      {label && <Label>{label}</Label>}
      <div className="relative w-full ">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder ?? "Search..."}
          className={cn("pl-10 pr-4 w-full", inputClassName)}
          style={{ width: "100%" }}
          {...props}
        />
      </div>
      {description && <p className="text-gray-600 text-xs">{description}</p>}
    </div>
  );
};

export default SearchInput;
