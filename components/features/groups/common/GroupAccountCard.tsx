import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import { X } from "lucide-react";
import React from "react";

type Props = {
  account: Row<"accounts">;
  onRemove?: (account: Row<"accounts">) => void;
};

const GroupAccountCard = ({ account, onRemove }: Props) => {
  return (
    <Card className="flex gap-2 items-center shadow-none py-2 px-4 w-full justify-between">
      <div className="flex gap-2 items-center">
        <p>{formatPhoneNumber(account.phoneNumber)}</p>
        {account.name && (
          <span className="font-bold text-sm">{`(${account.name})`}</span>
        )}
      </div>
      {onRemove && (
        <div>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => onRemove(account)}
          >
            <X size={20} className="text-red-500" />
          </Button>{" "}
        </div>
      )}
    </Card>
  );
};

export default GroupAccountCard;
