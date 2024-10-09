"use client";

import React, { useState } from "react";
import { useCreateNotifiedAccount } from "@/hooks/mutations/accounts/useCreateNotifiedAccount";
import { useNotifiedAccounts } from "@/hooks/queries/account/useNotifiedAccounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/utils/utils";
import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Row } from "@/types/supabase/table";
import { formatDateToString } from "@/lib/utils";
import { useRemoveNotifiedAccount } from "@/hooks/mutations/accounts/useRemoveNotifiedAccount";
import { Loader2 } from "lucide-react";

type Props = {};

const NotifiedAccounts: React.FC<Props> = () => {
  const { data: notifiedAccounts, isLoading: isLoadingAccounts } =
    useNotifiedAccounts();
  const {
    mutate: removeNotifiedAccount,
    isPending: isRemovingNotifiedAccount,
  } = useRemoveNotifiedAccount();
  const { mutate, isPending } = useCreateNotifiedAccount({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error ?? "Failed to create notified account");
        return;
      }
      toast.success("Notified account added successfully!");
    },
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedNumber) {
      mutate({ phoneNumber: cleanedNumber });
      setPhoneNumber("");
    }
  };

  const handleRemove = (id: string) => {
    setRemovingId(id);
    removeNotifiedAccount(
      {
        id,
        data: {
          notify_new_orders: false,
          notify_phoneNumber: undefined,
        },
      },
      {
        onSettled: () => setRemovingId(null),
      }
    );
  };

  const fields: TableField<Row<"accounts">>[] = [
    {
      key: (row) =>
        row.notify_phoneNumber ? formatPhoneNumber(row.notify_phoneNumber) : "",
      label: "Phone Number",
    },
    {
      key: (row) => (row.notify_new_orders ? "Yes" : "No"),
      label: "Notify New Orders",
    },
    {
      key: (row) => formatDateToString(new Date(row.createdAt)),
      label: "Added At",
    },
    {
      key: (row) => (
        <Button
          size="sm"
          className="text-xs"
          variant="destructive"
          type="button"
          onClick={() => handleRemove(row.id)}
          disabled={isRemovingNotifiedAccount && removingId === row.id}
        >
          {isRemovingNotifiedAccount && removingId === row.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Remove"
          )}
        </Button>
      ),
      label: "",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Notified Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formatPhoneNumber(phoneNumber)}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Account"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notified Accounts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                {isLoadingAccounts ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="min-w-[500px]">
                    <DynamicTable
                      data={notifiedAccounts ?? []}
                      fields={fields}
                      emptyMessage="No notified accounts added"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotifiedAccounts;
