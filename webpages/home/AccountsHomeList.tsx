"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import AccountsTable from "./AccountsTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {};

const AccountsHomeList = (props: Props) => {
  const router = useRouter();

  const handleNavigateToAccounts = () => {
    router.push("/dashboard/accounts");
  };

  return (
    <Card className="h-[400px] lg:flex-1 flex flex-col rounded-xl overflow-hidden">
      <CardHeader className="flex justify-between flex-row items-center border-b border-neutral-300  rounded-t-xl p-4">
        <CardTitle>New Accounts</CardTitle>
        <Button className="h-0" onClick={handleNavigateToAccounts} variant={"none"} size={"sm"}>
          {/* <p className="font-bold">View All Accounts</p> */}
          <ArrowUpRight />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto no-scrollbar">
        <div className="min-w-[600px] h-full">
          <AccountsTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsHomeList;