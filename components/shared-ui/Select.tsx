import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from "../ui/select";

export type SelectOptions = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type QuickSelectProps = {
  options: SelectOptions[];
  onValueChange: (option?: string) => void;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  emptyMessage?: string;
  action?: ReactNode;
};

const Select = ({
  options,
  onValueChange,
  defaultValue,
  className,
  placeholder,
  emptyMessage = "No options available",
  value,
  action,
}: QuickSelectProps) => {
  const hasOptions = options && options.length > 0;

  return (
    <ShadcnSelect
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
    >
      <SelectTrigger
        className={cn("bg-white capitalize h-11 text-base", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        ref={(ref) =>
          // temporary workaround from https://github.com/shadcn-ui/ui/issues/1220
          ref?.addEventListener("touchend", (e) => e.preventDefault())
        }
      >
        {hasOptions ? (
          options.map((option) => (
            <SelectItem
              key={option.value}
              className={cn(
                "px-4 py-3 capitalize focus:bg-black focus:text-white",
                option.disabled && "opacity-50 cursor-not-allowed"
              )}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label.toLowerCase()}
            </SelectItem>
          ))
        ) : (
          <div className="h-12 px-4 py-2 text-sm text-gray-500">
            {emptyMessage}
          </div>
        )}
        {action}
      </SelectContent>
    </ShadcnSelect>
  );
};

export default Select;
