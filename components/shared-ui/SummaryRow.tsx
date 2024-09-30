import React from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

const SummaryRow = ({ label, value, className }: Props) => {
  return (
    <div className={cn(className)}>
      <Label className="font-normal">{label}</Label>
      <p className="font-semibold"> {value} </p>
    </div>
  );
};

export default SummaryRow;
