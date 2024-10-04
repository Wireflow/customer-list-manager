import { cn } from "@/lib/utils";
import { ReactNode } from "react";
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
};

export type QuickSelectProps = {
  options: SelectOptions[];
  onValueChange: (option?: string) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
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
  disabled = false,
  action,
}: QuickSelectProps) => {
  const hasOptions = options && options.length > 0;

  return (
    <ShadcnSelect
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
    >
      <SelectTrigger className={cn("bg-white capitalize", className)}>
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
              className="px-4 capitalize focus:bg-black focus:text-white"
              value={option.value}
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
