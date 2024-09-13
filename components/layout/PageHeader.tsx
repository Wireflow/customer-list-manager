// components/PageHeader.tsx
import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8 mt-20 md:mt-0">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-gray-700">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
