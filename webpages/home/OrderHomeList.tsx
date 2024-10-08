"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import OrdersTable from "./OrdersTable";
import { Badge } from "@/components/ui/badge";

type Props = {};

const OrderHomeList = (props: Props) => {
  const router = useRouter();

  const handleNavigateToOrders = () => {
    router.replace("/dashboard/orders");
  };

  return (
    <Card className="h-[440px] flex flex-col md:flex-1 rounded-xl overflow-hidden ">
      <CardHeader className="flex-shrink-0 flex flex-row justify-between items-center border-b border-neutral-300  rounded-t-xl p-4">
        <Badge className="text-lg" variant={'outline'}>Latest Orders</Badge>
        <Button
          onClick={handleNavigateToOrders}
          variant="ghost"
          className="flex items-center gap-3"
          size={"sm"}
        >
          {/* <p className="font-bold mr-2">View All Orders</p> */}
        View All Orders <ArrowUpRight className="text-purple-500" size={30} />
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
