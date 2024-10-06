import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Check, Search, ShoppingCart } from "lucide-react";

import { updateOrder } from "@/actions/orders";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { UpdateOrderSchema, UpdateOrderType } from "@/types/validation/order";
import { formatCurrency } from "@/utils/utils";
import { Row } from "@/types/supabase/table";

import PageHeader from "@/components/layout/PageHeader";
import ProductCard from "@/components/features/products/ProductCard";
import SummaryRow from "@/components/shared-ui/SummaryRow";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import NoData from "@/components/ui/no-data";

type Props = {
  onOpenChange?: (isOpen: boolean) => void;
};

const AddItemsToOrderForm: React.FC<Props> = ({ onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { id: orderId } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: products } = useProducts();
  const { data: order } = useOrderById(orderId);

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

      toast.success("Order updated successfully!");
      router.back();
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
      } else if (newQuantity <= product.quantityInStock) {
        const updatedItem = {
          ...fields[existingItemIndex],
          quantity: newQuantity,
        };
        update(existingItemIndex, updatedItem);
      } else {
        toast.error(`Not enough stock. Available: ${product.quantityInStock}`);
      }
    } else if (newQuantity > 0) {
      if (newQuantity <= product.quantityInStock) {
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
      } else {
        toast.error(`Not enough stock. Available: ${product.quantityInStock}`);
      }
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
    <div className="flex flex-col h-full overflow-hidden md:pt-0 pt-20">
      <PageHeader
        disableMargin
        title={"Add Items to Order #" + order?.orderNumber}
        description="Select items to add to your order"
      />
      <div className="relative -mt-4">
        <Input
          className="pl-10 h-12 bg-white"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-grow flex flex-col"
        >
          <div className="flex-grow overflow-auto mt-8">
            {filteredProducts?.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                {filteredProducts?.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    disableSelect
                    disableDelete
                    quantity={
                      fields.find((p) => p.productId === product.id)
                        ?.quantity || 0
                    }
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChange(product, newQuantity)
                    }
                  />
                ))}
              </div>
            ) : (
              <NoData
                variant="no-records"
                message="No items found"
                className="h-auto py-8"
              />
            )}
          </div>

          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6 md:gap-10 items-center mb-6">
                <SummaryRow
                  label="Total Quantity"
                  value={form.watch("totalQuantity")}
                />
                <SummaryRow
                  label="Total Amount"
                  value={formatCurrency(form.watch("totalAmount"))}
                  className="text-lg font-semibold"
                />
              </div>
              <div className="flex md:flex-row flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg">
                  Apply Changes ({formatCurrency(form.watch("totalAmount"))})
                  <Check className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AddItemsToOrderForm;
