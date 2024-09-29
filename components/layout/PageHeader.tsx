// components/PageHeader.tsx
import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  rightContent,
}) => {
  return (
    <div className="flex flex-col justify-between items-start md:flex-row mb-8 gap-5 ">
      <div className=" mt-20 md:mt-0">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        )}
      </div>
      <div>{rightContent && <div className="">{rightContent}</div>}</div>
    </div>
  );
};

export default PageHeader;
