import React from "react";

type Props = {};

const PageNotFound = (props: Props) => {
  return (
    <div className="h-screen w-full grid place-items-center">
      <div className="grid">
        <p className="text-[100px] font-bold">404</p>
        <p className="text-2xl text-center font-bold">Page Not Found</p>
      </div>
    </div>
  );
};

export default PageNotFound;
