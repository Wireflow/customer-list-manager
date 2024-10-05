"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPhoneNumber } from "@/utils/utils";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Order Successful!
          </CardTitle>
          <CardDescription className="text-center">
            Thank you for your order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Your order has been successfully placed and confirmed for the phone
            number:
          </p>
          <p className="text-xl font-semibold text-center text-primary">
            {formatPhoneNumber(phone ?? "") || "Phone number not provided"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
