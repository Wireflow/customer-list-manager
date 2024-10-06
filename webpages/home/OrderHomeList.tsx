"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import OrdersTable from "./OrdersTable";

type Props = {};

const OrderHomeList = (props: Props) => {
  const router = useRouter();

  const handleNavigateToOrders = () => {
    router.replace("/dashboard/orders");
  };

  return (
    <Card className="h-[500px] flex flex-col rounded-xl overflow-hidden ">
      <CardHeader className="flex-shrink-0 flex flex-row justify-between items-center bg-neutral-600 text-white rounded-t-xl p-4">
        <CardTitle>Latest Orders</CardTitle>
        <Button
          onClick={handleNavigateToOrders}
          variant="ghost"
          className="text-white"
        >
          <p className="font-bold mr-2">View All Orders</p>
          <ArrowUpRight />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-0 no-scrollbar">
        <div className="min-w-[800px]">
          <OrdersTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderHomeList;
