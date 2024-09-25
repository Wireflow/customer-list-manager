import React from "react";

type Props = {};

const OrderDetailsPage = (props: Props) => {
  return (
    <div>
      <div>
        <h1 className="font-semibold text-2xl">Order #{order?.OrderNumber}</h1>
        <p className="text-sm text-gray-500">
          Account{" "}
          <span className="font-bold">
            #{formatPhoneNumber(account?.phoneNumber)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
