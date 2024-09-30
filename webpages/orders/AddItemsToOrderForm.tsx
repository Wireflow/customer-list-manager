import { updateOrder } from "@/actions/orders";
import ProductCard from "@/components/features/products/ProductCard";
import PageHeader from "@/components/layout/PageHeader";
import SummaryRow from "@/components/shared-ui/SummaryRow";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { Row } from "@/types/supabase/table";
import { UpdateOrderSchema, UpdateOrderType } from "@/types/validation/order";
import { formatCurrency } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  onOpenChange?: (isOpen: boolean) => void;
};

const AddItemsToOrderForm: React.FC<Props> = ({ onOpenChange }) => {
  const { id: orderId } = useParams<{ id: string }>();
  const { data: products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<UpdateOrderType>({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: {
      id: orderId,
      totalAmount: 0,
      totalQuantity: 0,
      orderItems: [],
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["update-order"],
    mutationFn: updateOrder,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to update order");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      onOpenChange?.(false);

      toast.success("Order updated!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order");
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  useEffect(() => {
    const totalQuantity = fields.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = fields.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    form.setValue("totalQuantity", totalQuantity);
    form.setValue("totalAmount", totalAmount);
  }, [fields, form]);

  const handleQuantityChange = (
    product: Row<"products">,
    newQuantity: number
  ) => {
    const existingItemIndex = fields.findIndex(
      (item) => item.productId === product.id
    );
    if (existingItemIndex > -1) {
      if (newQuantity === 0) {
        remove(existingItemIndex);
      } else {
        const updatedItem = {
          ...fields[existingItemIndex],
          quantity: newQuantity,
        };
        update(existingItemIndex, updatedItem);
      }
    } else if (newQuantity > 0) {
      append({
        productId: product.id,
        quantity: newQuantity,
        price: product.price,
        imageUrl: product.imageUrl ?? "",
        name: product.name,
        unit: product.unit ?? "",
        description: product.description ?? "",
        orderId: orderId,
      });
    }
  };

  const onSubmit = (data: UpdateOrderType) => {
    mutation.mutate(data);
  };

  const onCancel = () => {
    form.reset();
    onOpenChange?.(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0">
        <PageHeader
          disableMargin
          title="Add items to order"
          description="Select items to add to your order"
        />
        <Input
          className="border h-[50px] focus:border-gray-300 mt-4"
          placeholder="Search for items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" mt-5">
            <div className="flex flex-col gap-4 pr-2 overflow-auto no-scrollbar h-[350px]">
              {filteredProducts?.map((product) => (
                <ProductCard
                  product={product}
                  key={product.id}
                  disableSelect
                  disableDelete
                  quantity={
                    fields.find((p) => p.productId === product.id)?.quantity ||
                    0
                  }
                  onQuantityChange={(newQuantity) =>
                    handleQuantityChange(product, newQuantity)
                  }
                />
              ))}
            </div>
          </div>
          <div className="flex gap-6 mt-4 justify-end">
            <SummaryRow label="Quantity" value={form.watch("totalQuantity")} />
            <SummaryRow
              label="Total Amount"
              value={formatCurrency(form.watch("totalAmount"))}
            />
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={"outline"}
              className="mt-4 w-full"
              size={"lg"}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="mt-4 w-full" size={"lg"}>
              Apply Changes ({formatCurrency(form.watch("totalAmount"))})
              <Check className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddItemsToOrderForm;
