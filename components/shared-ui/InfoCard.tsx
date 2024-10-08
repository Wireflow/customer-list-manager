import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  value: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
  backgroundColor?: string;
  textColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  action,
  className,
  titleClassName,
  valueClassName,
  backgroundColor,
  textColor,
}) => {
  return (
    <Card
      className={cn(
        "flex w-full flex-col justify-between gap-2 overflow-hidden rounded-md p-4 shadow-none",
        backgroundColor,
        className
      )}
    >
      <div className="flex flex-col gap-2 w-full">
        <CardDescription
          className={cn("font-bold w-full", textColor, titleClassName)}
        >
          {title}
        </CardDescription>
        <CardTitle className={cn("text-2xl w-full", textColor, valueClassName)}>
          {value}
        </CardTitle>
      </div>
      {action && <div className="w-full mt-2">{action}</div>}
    </Card>
  );
};

export default InfoCard;
