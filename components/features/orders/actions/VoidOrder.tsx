import { updateOrderStatus } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import DangerDialog from "@/components/ui/danger-dialog";
import { Enum } from "@/types/supabase/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

type Props = {
  orderId: string;
  status: Enum<"order_status">;
};

const VoidOrder = ({ orderId, status }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["void-order"],
    mutationFn: () => updateOrderStatus(orderId, "voided"),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to void order");
        return;
      }

      if (data.success) {
        toast.success("Order voided!");
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to void order");
    },
  });

  return (
    <DangerDialog
      disabled={status !== "pending"}
      trigger={
        <Button variant={"destructive"} disabled={status !== "pending"}>
          Void
        </Button>
      }
      title="Void Order"
      description="Are you sure you want to void this order?"
      onConfirm={() => mutation.mutate()}
    />
  );
};

export default VoidOrder;
