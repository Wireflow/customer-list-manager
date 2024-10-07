"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import ListTable from "./ListTable";

type Props = {};

const SharedLists = (props: Props) => {
  return (
    <Card className="h-[400px] lg:w-[400px] flex flex-col rounded-xl">
      <CardHeader className="flex  border-b border-neutral-300    rounded-t-xl p-4">
        <CardTitle>Shared lists</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden ">
        <div className="h-full overflow-auto no-scrollbar">
          <ListTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default SharedLists;
