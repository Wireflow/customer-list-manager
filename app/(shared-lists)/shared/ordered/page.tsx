import NoData from "@/components/ui/no-data";
import OrderSuccessPage from "@/webpages/orders/OrderSuccessPage";
import React, { Suspense } from "react";

type Props = {};

const Ordered = (props: Props) => {
  return (
    <Suspense fallback={<NoData variant="loading" message="Loading..." />}>
      <OrderSuccessPage />
    </Suspense>
  );
};

export default Ordered;
