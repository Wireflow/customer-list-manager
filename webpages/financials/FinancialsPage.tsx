import InfoCard from "@/components/shared-ui/InfoCard";
import React from "react";
import { DataTable } from "./DataTable";
import { RadialDataChart } from "./RadialDataChart";

type Props = {};

const FinancialsPage = (props: Props) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row gap-5 items-center ">
        <RadialDataChart />
        <RadialDataChart />
        <RadialDataChart />
      </div>
      <div>
        <DataTable />
      </div>
    </div>
  );
};

export default FinancialsPage;
