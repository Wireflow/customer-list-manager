import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
  trigger: React.ReactNode;
  content: React.ReactNode | React.ReactNode[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const PopoverActions = ({
  trigger,
  content,
  open,
  onOpenChange,
  className,
}: Props) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={className}>{content}</PopoverContent>
    </Popover>
  );
};

export default PopoverActions;
