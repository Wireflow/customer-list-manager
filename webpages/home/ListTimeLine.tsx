import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForceExpireList } from "@/hooks/mutations/shared-lists/useForceExpireList";
import { useAccountById } from "@/hooks/queries/account/useGetAccountById";
import { useSharedLists } from "@/hooks/queries/sharedLists/useSharedLists";
import { formatDateToString, formatPhoneNumber } from "@/lib/utils";
import React, { useCallback, useState } from "react";

type Props = {};

const ListTimeLine = (props: Props) => {
  const { data: sharedLists, refetch } = useSharedLists(10);
  const { mutate: forceExpire } = useForceExpireList();
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleForceExpire = useCallback(
    (id: string) => {
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      forceExpire(id, {
        onSettled: () => {
          setLoadingStates((prev) => ({ ...prev, [id]: false }));
          refetch();
        },
      });
    },
    [forceExpire, refetch]
  );

  return (
    <div className="flex flex-col gap-3  ">
      {sharedLists?.map((list) => (
        <Card className="flex flex-col  rounded-xl px-4 py-3" key={list.id}>
          <CardContent className="p-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs text-gray-500">
                  {formatDateToString(new Date(list.createdAt))}
                </span>
                <p className="text-xs">
                  You shared{" "}
                  <span className="font-black capitalize text-purple-500">
                    {list.type === "custom"
                      ? list.list?.name
                      : "The Full catalog"}
                  </span>{" "}
                  to <br />
                  <span className="font-semibold">
                    {formatPhoneNumber(list.account?.phoneNumber)}
                  </span>
                </p>
              </div>
              <Button
                size="sm"
                className="text-xs"
                variant={
                  list.forceExpire ||
                  new Date(list.expirationTime).getTime() < new Date().getTime()
                    ? "ghost"
                    : "secondary"
                }
                onClick={() => handleForceExpire(list.id)}
                disabled={
                  list.forceExpire ||
                  loadingStates[list.id] ||
                  new Date(list.expirationTime).getTime() < new Date().getTime()
                }
              >
                {list.forceExpire ||
                new Date(list.expirationTime).getTime() < new Date().getTime()
                  ? "Expired"
                  : loadingStates[list.id]
                    ? "Expiring..."
                    : "Force Expire"}
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-xs border-neutral-300">
                {list.type === "custom" ? "Custom List" : "Full Catalog"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListTimeLine;
