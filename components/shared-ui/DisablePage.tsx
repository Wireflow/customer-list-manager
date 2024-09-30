import React from "react";

type DisableProps = {
  disabled: boolean;
  message?: string;
  children: React.ReactNode;
};

const Disable: React.FC<DisableProps> = ({
  disabled,
  message = "This page is currently disabled",
  children,
}) => {
  return (
    <div className="relative mt-14 md:mt-0 md:h-[calc(100vh-50px)]">
      {children}
      {disabled && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Disable;
