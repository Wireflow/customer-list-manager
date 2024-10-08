import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePaginatedAccounts } from "@/hooks/queries/account/usePaginatedAccounts";
import { formatPhoneNumber } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

type Props = {};

const AccountsHomePage = (props: Props) => {
  const { accounts, refetch } = usePaginatedAccounts({ pageSize: 10 });
  const router = useRouter();
  const handleNavigateToAccount = useCallback(
    (id: string) => {
      router.push(`/dashboard/accounts/${id}`);
    },
    [router]
    );
    if(!accounts) return <div className="font-bold flex flex-col justify-center items-center">No New Accounts Found</div>
  return (
    <div className="flex flex-col gap-4 py-3">
      {accounts?.map((account) => (
        <Card key={account.id} className="p-5 flex flex-col gap-2 items-start">
          <CardContent className="p-0 w-full">
            <div className="flex justify-between items-center w-full">
              <Badge variant={"purple"}>New</Badge>
              <Button
                variant={"none"}
                onClick={() => handleNavigateToAccount(account.id)}
                className="text-xs"
                size={"sm"}
              >
                View Account
              </Button>
            </div>
            <div className="flex gap-1">
              <p className="font-medium">
                New Account was Created for <br />
                <span className="capitalize text-black font-black">
                  {formatPhoneNumber(account.phoneNumber)}
                </span>{" "}
              </p>{" "}
              {/* <p>{account.name ? <span>For {account.name}</span> : ""}</p> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AccountsHomePage;
