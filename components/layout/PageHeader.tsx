// components/PageHeader.tsx
import { cn } from "@/lib/utils";
import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
  disableMargin?: boolean;
  textColor?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  rightContent,
  disableMargin = false,
  textColor,
}) => {
  return (
    <div className="flex flex-col justify-between items-start lg:flex-row mb-8 gap-5 ">
      <div className={cn({ "mt-20 md:mt-0": !disableMargin })}>
        <h1 className={cn("text-3xl font-bold text-gray-900", textColor)}>
          {title}
        </h1>
        {description && (
          <p className={cn("mt-2 text-sm text-gray-700", textColor)}>
            {description}
          </p>
        )}
      </div>
      <div className="w-full lg:w-auto">
        {rightContent && <div className="">{rightContent}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
