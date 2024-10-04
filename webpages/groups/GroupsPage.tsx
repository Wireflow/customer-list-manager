"use client";

import CreateGroupForm from "@/components/features/groups/forms/CreateGroupForm";
import GroupsList from "@/components/features/groups/GroupsList";
import InfoCard from "@/components/shared-ui/InfoCard";
import Pagination from "@/components/shared-ui/Pagination";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import NoData from "@/components/ui/no-data";
import { usePaginatedGroups } from "@/hooks/queries/groups/usePaginatedGroups";

type Props = {};

const GroupsPage = (props: Props) => {
  const {
    groups,
    isLoading,
    isError,
    isFetching,
    page,
    setPage,
    totalPages,
    refetch,
    setSearchQuery,
    searchQuery,
  } = usePaginatedGroups({ pageSize: 10 });

  if (isLoading)
    return <NoData variant="loading" message="Loading groups..." />;

  if (isError)
    return <NoData variant="error" message="Failed to load groups..." />;

  return (
    <div className="overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 flex-1">
          <InfoCard title="Total Groups" value={groups.length ?? 0} />
        </div>
      </div>

      <div className="flex md:flex-row flex-col justify-between items-end gap-4">
        <div className="md:max-w-[400px] w-full">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by group name..."
            label="Search"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <CreateGroupForm />
          <RefreshButton refetch={refetch} isFetching={isFetching} />
        </div>
      </div>
      <div className="mt-4">
        <GroupsList groups={groups ?? []} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default GroupsPage;
