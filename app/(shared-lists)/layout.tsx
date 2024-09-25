import React from "react";

type Props = {
  children: React.ReactNode;
};

const SharedListsLayout = ({ children }: Props) => {
  return (
    <div className="p-6">
      <main>{children}</main>
    </div>
  );
};

export default SharedListsLayout;
