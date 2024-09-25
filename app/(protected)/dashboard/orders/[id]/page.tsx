"use client";

import PageHeader from "@/components/layout/PageHeader";
import { useAccountById } from "@/hooks/queries/account/useGetAccountById";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { formatPhoneNumber } from "@/utils/utils";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const page = ({ params: { id } }: Props) => {
  return (
    <div>
      <PageHeader title="Order Details" />

    </div>
  );
};

export default page;
