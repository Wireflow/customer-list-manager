import PageHeader from "@/components/layout/PageHeader";
import FinancialsPage from "@/webpages/financials/FinancialsPage";
import GroupsPage from "@/webpages/groups/GroupsPage";
import React from "react";

type Props = {};

const Groups = (props: Props) => {
  return (
    <div>
      <PageHeader
        title="Groups"
        description="View and manage your groups in one place!"
      />
      <GroupsPage />
    </div>
  );
};

export default Groups;
