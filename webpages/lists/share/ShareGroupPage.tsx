"use client";

import { Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import AccountsList from "@/components/features/accounts/AccountsList";
import PageHeader from "@/components/layout/PageHeader";
import Pagination from "@/components/shared-ui/Pagination";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import Select, { SelectOptions } from "@/components/shared-ui/Select";
import { Button } from "@/components/ui/button";
import NoData from "@/components/ui/no-data";
import { useShareList } from "@/hooks/mutations/shared-lists/useShareList";
import { usePaginatedAccounts } from "@/hooks/queries/account/usePaginatedAccounts";
import { useGroupsDetails } from "@/hooks/queries/groups/useGroupsDetails";
import { Row } from "@/types/supabase/table";
import { Label } from "@/components/ui/label";
import ListToShare from "./ListToShare";
import { list } from "postcss";

const ShareGroupPage = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<Row<"accounts">[]>(
    []
  );
  const [groupId, setGroupId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const searchParams = useSearchParams();
  const listId = searchParams.get("listId");
  const type = searchParams.get("type") as "full" | "custom";

  const {
    accounts,
    isLoading,
    isError,
    isFetching,
    page,
    setPage,
    totalPages,
    refetch,
    searchQuery,
    setSearchQuery,
  } = usePaginatedAccounts({ pageSize: 10 });
  const { data: groups } = useGroupsDetails();

  const { mutateAsync } = useShareList({
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Successfully sent shared list");
        setSelectedAccounts([]);
      } else {
        toast.error(data?.error ?? "Failed to send shared list");
      }
      setIsSending(false);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "An error occurred while sending the list");
      setIsSending(false);
    },
  });

  const handleSendToSelected = useCallback(async () => {
    if (selectedAccounts.length === 0) {
      toast.error("Please select at least one account");
      return;
    }

    setIsSending(true);
    const phoneNumbers = selectedAccounts
      .map((account) => account.phoneNumber)
      .filter(Boolean) as string[];

    try {
      if (type) {
        await mutateAsync({
          phoneNumber: phoneNumbers,
          originUrl: window.location.origin,
          listId: listId ?? undefined,
          type,
        });
      }
    } catch (error) {
      console.error("Failed to send shared list:", error);
      toast.error("An unexpected error occurred while sending the list");
      setIsSending(false);
    }
  }, [selectedAccounts, mutateAsync, listId, type]);

  const groupOptions: SelectOptions[] =
    groups?.map((group) => ({
      label: group.name,
      value: group.id,
    })) ?? [];

  const handleGroupSelect = (gropuId: string) => {
    setSelectedAccounts([]);
    setGroupId(gropuId);
    const filteredGroup = groups?.find((group) => group.id === gropuId);
    const fotmattedAccounts = filteredGroup?.accounts.map((acc) => acc.account);

    if (filteredGroup) {
      setSelectedAccounts(fotmattedAccounts ?? []);
    }
  };

  if (isLoading)
    return <NoData variant="loading" message="Loading accounts..." />;
  if (isError)
    return <NoData variant="error" message="Failed to load accounts" />;

  return (
    <div>
      <PageHeader
        title="Share Your List"
        description="Share your list with a group"
      />
      <ListToShare listId={listId ?? ""} />
      <div>
        <div className="mt-4 flex flex-col lg:flex-row w-full justify-between items-end gap-4">
          <div className="w-full lg:max-w-[500px]">
            <SearchInput
              onChange={setSearchQuery}
              value={searchQuery}
              label="Search"
              placeholder="Search by phone number..."
            />
          </div>
          <div className="flex lg:flex-row-reverse gap-4 flex-col w-full">
            <div className="flex flex-row  gap-4 items-end lg:w-auto w-full ">
              <Button
                onClick={handleSendToSelected}
                disabled={selectedAccounts.length === 0 || isSending}
                size={"lg"}
                className="w-full lg:w-auto"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to Selected{" "}
                    {selectedAccounts.length
                      ? `(${selectedAccounts.length})`
                      : ""}
                  </>
                )}
              </Button>
              <RefreshButton refetch={refetch} isFetching={isFetching} />
            </div>
            <div className="flex flex-col gap-2 ">
              <Label>Group</Label>
              <Select
                options={groupOptions}
                onValueChange={(value) => value && handleGroupSelect(value)}
                value={groupId}
                placeholder="Select group"
                className="lg:min-w-[250px] w-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-auto">
          <div className="min-w-[600px]">
            <AccountsList
              accounts={accounts ?? []}
              selectedAccounts={selectedAccounts}
              onSelectedAccountsChange={setSelectedAccounts}
            />
          </div>
        </div>
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareGroupPage;
