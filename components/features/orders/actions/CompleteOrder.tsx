import { updateOrderStatus } from "@/actions/orders";
import { createOrderPayment } from "@/actions/payments";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import Dialog from "@/components/shared-ui/Dialog";
import SummaryRow from "@/components/shared-ui/SummaryRow";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { paymentMethodOptions } from "@/data/constants";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { formatDateToString } from "@/lib/utils";
import { Enum } from "@/types/supabase/enum";
import { PaymentSchema, PaymentType } from "@/types/validation/payment";
import { getOrderTotal } from "@/utils/orderUtils";
import { formatCurrency } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  orderId: string;
  status: Enum<"order_status">;
};

const CompleteOrder = ({ orderId, status }: Props) => {
  const { data: order } = useOrderById(orderId);
  const [open, setOpen] = useState(false);

  const total = order ? getOrderTotal(order) : 0;

  const form = useForm<PaymentType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      orderId: orderId,
      method: undefined,
      amount: total,
      checkAmount: undefined,
      checkNumber: undefined,
      customMethod: undefined,
    },
  });

  const queryClient = useQueryClient();

  const updateToComplete = useMutation({
    mutationKey: ["update-order"],
    mutationFn: () => updateOrderStatus(orderId, "completed"),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to complete order!");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Payment completed!");
    },
    onError: (error) => {
      toast.error("Failed to complete order!");
    },
  });

  useEffect(() => {
    form.setValue("amount", total);
  }, [order, total, form]);

  const mutation = useMutation({
    mutationKey: ["complete-order"],
    mutationFn: createOrderPayment,
    onSuccess: (data, context) => {
      if (!data.success) {
        toast.error("Failed to complete order");
        return;
      }

      if (context.method !== "hold") {
        updateToComplete.mutate();
      }

      setOpen(false); // Close the dialog on success
    },
    onError: (error) => {
      toast.error("Failed to complete order");
    },
  });

  const onSubmit = (data: PaymentType) => {
    if (data.method === "custom" && !data.customMethod) {
      form.setError("customMethod", {
        type: "manual",
        message: "Custom payment method is required",
      });
      return;
    }

    if (data.method === "check" && (!data.checkAmount || !data.checkNumber)) {
      form.setError("checkAmount", {
        type: "manual",
        message: "Check amount is required",
      });
      form.setError("checkNumber", {
        type: "manual",
        message: "Check number is required",
      });
      return;
    }

    mutation.mutate({
      orderId: data.orderId,
      method: data.method,
      amount: data.amount,
      checkAmount: data.method === "check" ? data.checkAmount : null,
      checkNumber:
        data.method === "check" ? data.checkNumber?.toString() : null,
      customMethod: data.method === "custom" ? data.customMethod : null,
    });
  };

  const watchMethod = form.watch("method");

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      title={`Complete Payment for ${formatCurrency(total)}`}
      description="Are you sure you want to complete this order?"
      disabled={
        (status !== "pending" && order?.payment?.method !== "hold") ||
        total <= 0
      }
      trigger={
        <Button variant="outline">
          {status === "completed" && order?.payment?.method !== "hold" ? (
            <div className="flex gap-[3px]">
              <span>Paid by</span>
              <span className="capitalize">
                {order?.payment?.method === "custom"
                  ? order?.payment?.customMethod
                  : order?.payment?.method}
              </span>
            </div>
          ) : (
            "Complete Payment"
          )}
        </Button>
      }
      className=" max-w-[700px]"
      open={open}
      onOpenChange={setOpen}
      content={
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:gap-10">
                <SummaryRow label="Amount" value={formatCurrency(total)} />
                <SummaryRow
                  label="Date Ordered"
                  value={
                    order
                      ? formatDateToString(new Date(order?.createdAt))
                      : "Not Available"
                  }
                />
              </div>
              <div className="flex flex-col gap-4 md:flex-row ">
                <div className="flex-1">
                  <SelectField
                    label="Payment Method"
                    placeholder="Select payment method"
                    name="method"
                    control={form.control}
                    options={paymentMethodOptions}
                  />
                </div>

                {watchMethod === "custom" && (
                  <div className="flex-1">
                    <InputField
                      name="customMethod"
                      label="Custom Payment Method"
                      type="text"
                      placeholder="Enter custom method"
                      control={form.control}
                    />
                  </div>
                )}
              </div>
            </div>

            {watchMethod === "check" && (
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  name="checkAmount"
                  label="Check Amount"
                  type="number"
                  placeholder="Enter check amount"
                  control={form.control}
                />
                <InputField
                  name="checkNumber"
                  label="Check Number"
                  type="number"
                  placeholder="Enter check number"
                  control={form.control}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onCancel}
                className="md:flex-1"
              >
                Cancel <X className="ml-2 h-5 w-5" />
              </Button>
              <Button
                type="submit"
                loading={mutation.isPending}
                disabled={mutation.isPending || !form.formState.isValid}
                size="lg"
                className="md:flex-1"
              >
                {mutation.isPending ? "Submitting..." : "Submit Payment"}
                <Check className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      }
    />
  );
};

export default CompleteOrder;
