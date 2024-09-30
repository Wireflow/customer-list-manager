import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  orderId: string;
};

const PrintInvoice = ({ orderId }: Props) => {
  return <Button className="w-full flex-1">Print Invoice</Button>;
};

export default PrintInvoice;
