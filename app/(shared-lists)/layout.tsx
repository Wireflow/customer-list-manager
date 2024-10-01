import React from "react";

type Props = {
  children: React.ReactNode;
};

const SharedListsLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-6">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default SharedListsLayout;
