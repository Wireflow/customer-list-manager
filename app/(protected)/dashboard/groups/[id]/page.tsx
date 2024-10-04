import PageHeader from "@/components/layout/PageHeader";
import GroupDetailsPage from "@/webpages/groups/GroupDetailsPage";
import React from "react";

type Props = {};

const GroupDetails = (props: Props) => {
  return (
    <div className="overflow-auto h-full no-scrollbar">
      <PageHeader
        title="Group Details"
        description="View and manage your groups in one place!"
      />
      <GroupDetailsPage />
    </div>
  );
};

export default GroupDetails;
