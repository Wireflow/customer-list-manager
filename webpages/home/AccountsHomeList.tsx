"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import AccountsTable from "./AccountsTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import AccountsHomePage from "./AccountsHomePage";

type Props = {};

const AccountsHomeList = (props: Props) => {
  const router = useRouter();

  const handleNavigateToAccounts = () => {
    router.push("/dashboard/accounts");
  };

  return (
    <Card className="h-[500px]  flex flex-col border-none   overflow-hidden">
      <CardHeader className="flex justify-between flex-row items-center border-b   rounded-t-xl p-4">
        <CardTitle className="text-2xl font-bold" >
          New Accounts
        </CardTitle>
        <Button
          className="h-0"
          onClick={handleNavigateToAccounts}
          variant={"none"}
          size={"sm"}
        >
          {/* <p className="font-bold">View All Accounts</p> */}
          <ArrowUpRight className="text-purple-500" size={30} />
        </Button>
      </CardHeader>
      <CardContent className=" overflow-auto no-scrollbar p-0 border-b">
        <div className=" h-full">
          <AccountsTable />
          {/* <AccountsHomePage /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsHomeList;
