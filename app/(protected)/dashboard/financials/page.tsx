import PageHeader from "@/components/layout/PageHeader";
import FinancialsPage from "@/webpages/financials/FinancialsPage";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <PageHeader
        title="Financials"
        description="View your financials in one place!"
      />
      <FinancialsPage />
    </div>
  );
};

export default page;
