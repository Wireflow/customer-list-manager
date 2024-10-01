import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import List from "@/components/ui/list";
import { cn } from "@/lib/utils";
import useCartStore, { CartItem } from "@/store/useCartStore";
import { Row } from "@/types/supabase/table";
import { getImageUrl } from "@/utils/imageUtils";
import { formatCurrency } from "@/utils/utils";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";

type Props = {
  cart: CartItem[];
};

const CartProductsList: React.FC<Props> = ({ cart }) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity, getCartItem } =
    useCartStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const currentQuantity = getCartItem(productId)?.quantity ?? 0;

    if (newQuantity > currentQuantity) {
      for (let i = currentQuantity; i < newQuantity; i++) {
        increaseQuantity(productId);
      }
    } else if (newQuantity < currentQuantity) {
      for (let i = currentQuantity; i > newQuantity; i--) {
        decreaseQuantity(productId);
      }
    }

    if (newQuantity === 0) {
      removeFromCart(productId);
    }
  };

  const renderItem = (item: CartItem) => {
    const handleIncrement = () =>
      handleQuantityChange(item.productId ?? "", (item.quantity ?? 0) + 1);
    const handleDecrement = () =>
      handleQuantityChange(item.productId ?? "", (item.quantity ?? 0) - 1);

    return (
      <Card className={cn("shadow-none overflow-hidden")}>
        <CardContent className="p-2 px-6 flex flex-row items-center justify-between h-[100px]">
          <div className="flex gap-2 items-center">
            <div className="relative flex-shrink-0 overflow-hidden">
              <Image
                src={getImageUrl(item?.imageUrl)}
                alt="product image"
                width={75}
                height={75}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="flex flex-col ml-2">
              <CardTitle className="text-lg capitalize">
                {item?.name}{" "}
                {item?.unit && (
                  <span className="text-gray-500 font-normal">
                    ({item?.unit})
                  </span>
                )}
              </CardTitle>
              <CardDescription>{formatCurrency(item?.price)}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              size="icon"
              onClick={handleDecrement}
              disabled={item.quantity === 0}
            >
              <Minus size={16} />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              type="button"
            >
              <Plus size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <List
      renderItem={renderItem}
      data={cart ?? []}
      error={false}
      containerClassName="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
    />
  );
};

export default CartProductsList;
