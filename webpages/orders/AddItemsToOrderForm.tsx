import React, { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { formatCurrency } from "@/utils/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdateOrderType, UpdateOrderSchema } from "@/types/validation/order";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {};

const AddItemsToOrderForm: React.FC<Props> = () => {
  const { data: products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{ [id: string]: number }>({});

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<UpdateOrderType>({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: {
      id: "",
      totalAmount: 0,
      totalQuantity: 0,
      orderItems: [],
    },
  });

  const incrementQuantity = (productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrementQuantity = (productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  const onSubmit = (data: UpdateOrderType) => {
    const orderItems = Object.keys(selectedProducts)
      .filter((productId) => selectedProducts[productId] > 0)
      .map((productId) => {
        const product = products?.find((p) => p.id === productId);
        return {
          productId: productId,
          quantity: selectedProducts[productId],
          price: product?.price || 0,
        };
      });

    const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    form.setValue("orderItems", orderItems);
    form.setValue("totalQuantity", totalQuantity);
    form.setValue("totalAmount", totalAmount);

    // Handle form submit here
    console.log(data);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0">
        <PageHeader
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="min-h-[20rem] h-[400px] mt-5 overflow-auto ">
          <div className="flex flex-col gap-3 pr-2">
            {filteredProducts?.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 flex gap-5 "
              >
                <Image
                  src={product?.imageUrl || ""}
                  alt="product-image"
                  className="border border-gray-300 rounded-lg p-5  "
                  width={80}
                  height={80}
                />
                <div>
                  <div>
                    <p className="font-bold capitalize">{product.name}</p>
                    <p className="text-sm">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div
                      className="rounded-full p-2 bg-gray-200 cursor-pointer"
                      onClick={() => incrementQuantity(product.id)}
                    >
                      <Plus size={16} />
                    </div>
                    <div>{selectedProducts[product.id] || 0}</div>
                    <div
                      className="rounded-full p-2 bg-gray-200 cursor-pointer"
                      onClick={() => decrementQuantity(product.id)}
                    >
                      <Minus size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" className="mt-4">
          Submit Order
        </Button>
      </form>
    </div>
  );
};

export default AddItemsToOrderForm;
