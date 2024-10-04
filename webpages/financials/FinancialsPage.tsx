import InfoCard from "@/components/shared-ui/InfoCard";
import React from "react";
import { DataTable } from "./DataTable";
import { RadialDataChart } from "./RadialDataChart";

type Props = {};

const FinancialsPage = (props: Props) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row gap-5 items-center">
        <InfoCard title="Total Stock Value" value="100" />
        <InfoCard title="Net profit" value="100" />
        <InfoCard title="Revenue" value="100" />
      </div>
      <div className="flex flex-col lg:flex-row gap-5 items-center">
        <RadialDataChart />
        <DataTable />
      </div>
    </div>
  );
};

export default FinancialsPage;
