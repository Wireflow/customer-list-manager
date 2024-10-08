"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import ListTable from "./ListTable";
import ListTimeLine from "./ListTimeLine";
import PageHeader from "@/components/layout/PageHeader";

type Props = {};

const SharedLists = (props: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-bold pb-2 border-b">Shared Lists</h2>
      <Card className="h-[400px] lg:w-[400px] flex flex-col rounded-xl shadow-none border-none">
      
        <CardContent className="flex-grow overflow-hidden p-0 border-b py-3">
          <div className="h-full overflow-auto no-scrollbar">
            {/* <ListTable /> */}
            <ListTimeLine />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedLists;
