"use client";

import AccountsList from "@/components/features/accounts/AccountsList";
import AccountAutoComplete from "@/components/features/groups/common/AccountAutoComplete";
import InfoCard from "@/components/shared-ui/InfoCard";
import NoData from "@/components/ui/no-data";
import { useGroupDetailsById } from "@/hooks/queries/groups/useGroupDetailsById";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

type Props = {};

const GroupDetailsPage = (props: Props) => {
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(
    null
  );

  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading, isError } = useGroupDetailsById(id);

  const accounts = useMemo(() => {
    if (!group) return [];
    return group.accounts.map((account) => account.account);
  }, [group]);

  if (isLoading)
    return <NoData variant="loading" message="Loading group details..." />;

  if (isError)
    return <NoData variant="error" message="Failed to load group details..." />;

  return (
    <div className="h-full">
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard title="Group Name" value={group?.name ?? "Not Specified"} />
        <InfoCard
          title="Accounts"
          value={group?.accounts_count[0].count ?? 0}
        />
      </div>
      {/* <div>
        <AccountAutoComplete onChange={setSelectedAccount} />
      </div> */}
      <div className="mt-4 overflow-y-auto">
        <div className="min-w-[500px]">
          <AccountsList accounts={accounts ?? []} />
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;
2;
