"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import ListTable from "./ListTable";
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
    <Card className="h-[400px]  lg:flex-1 overflow-x-auto flex flex-col no-scrollbar rounded-xl">
      <CardHeader className="flex justify-between flex-row items-center min-w-[600px] bg-neutral-600 text-white rounded-t-xl">
        <CardTitle>New Accounts</CardTitle>
        <Button className="h-0" onClick={handleNavigateToAccounts} variant={"none"} size={"sm"}>
          <p className="font-bold">View All Accounts</p>
          <ArrowUpRight />
        </Button>
      </CardHeader>
      <CardContent className=" min-w-[600px] overflow-hidden  overflow-x-hidden ">
        <div className="h-full w-full overflow-x-auto   no-scrollbar">
          <AccountsTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsHomeList;
