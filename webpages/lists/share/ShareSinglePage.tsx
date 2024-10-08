"use client";

import { Check, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import AccountsList from "@/components/features/accounts/AccountsList";
import PageHeader from "@/components/layout/PageHeader";
import Pagination from "@/components/shared-ui/Pagination";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import { Button } from "@/components/ui/button";
import NoData from "@/components/ui/no-data";
import { useShareList } from "@/hooks/mutations/shared-lists/useShareList";
import { usePaginatedAccounts } from "@/hooks/queries/account/usePaginatedAccounts";
import { Enum } from "@/types/supabase/enum";
import { Row } from "@/types/supabase/table";
import ListToShare from "./ListToShare";

const ShareSinglePage = () => {
  const [sentAccounts, setSentAccounts] = useState<Set<string>>(new Set());
  const [loadingAccountId, setLoadingAccountId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const listId = searchParams.get("listId");
  const type = searchParams.get("type") as Enum<"shared_list_type">;

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

  const { mutateAsync } = useShareList({
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Successfully sent shared list");
      } else {
        toast.error(data?.error ?? "Failed to send shared list");
      }
      setLoadingAccountId(null);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "An error occurred while sending the list");
      setLoadingAccountId(null);
    },
  });

  const onSendToAccount = useCallback(
    async (account: Row<"accounts">) => {
      if (account?.phoneNumber && type && !sentAccounts.has(account.id)) {
        setLoadingAccountId(account.id);
        try {
          const result = await mutateAsync({
            phoneNumber: account.phoneNumber,
            originUrl: window.location.origin,
            type,
            listId: listId ?? undefined,
          });

          if (result?.success) {
            setSentAccounts((prev) => new Set(prev).add(account.id));
            toast.success("Successfully sent shared list");
          } else {
            toast.error(result?.error ?? "Failed to send shared list");
          }
        } catch (error) {
          console.error("Error sending list:", error);
          toast.error("An error occurred while sending the list");
        } finally {
          setLoadingAccountId(null);
        }
      }
    },
    [mutateAsync, listId, type, sentAccounts]
  );

  if (isLoading)
    return <NoData variant="loading" message="Loading accounts..." />;
  if (isError)
    return <NoData variant="error" message="Failed to load accounts" />;

  return (
    <div>
      <PageHeader
        title="Share Your List"
        description="Share your list with a single account"
      />
      <ListToShare listId={listId ?? ""} />
      <div className="mt-4 flex flex-col md:flex-row w-full justify-between items-end gap-4">
        <div className="flex md:flex-row md:justify-between items-end gap-4 w-full md:max-w-[500px]">
          <SearchInput
            onChange={setSearchQuery}
            value={searchQuery}
            label="Search"
            placeholder="Search by phone number..."
          />
          <RefreshButton refetch={refetch} isFetching={isFetching} />
        </div>
      </div>
      <div className="mt-4 overflow-auto">
        <div className="min-w-[700px]">
          <AccountsList
            accounts={accounts ?? []}
            rowAction={(account) => {
              const isSent = sentAccounts.has(account.id);
              const isLoading = loadingAccountId === account.id;
              return (
                <Button
                  size="sm"
                  onClick={() => onSendToAccount(account)}
                  disabled={isSent || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : isSent ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Sent List
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send to Account
                    </>
                  )}
                </Button>
              );
            }}
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
  );
};

export default ShareSinglePage;
