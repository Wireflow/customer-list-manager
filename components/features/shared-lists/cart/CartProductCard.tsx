import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useCartStore, { CartItem } from "@/store/useCartStore";
import { getImageUrl } from "@/utils/imageUtils";
import { formatCurrency } from "@/utils/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

type Props = {
  item: CartItem;
};

const CartProductCard = ({ item }: Props) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCartStore();

  const handleIncrement = () => increaseQuantity(item.productId ?? "");
  const handleDecrement = () => decreaseQuantity(item.productId ?? "");
  const handleRemove = () => removeFromCart(item.productId ?? "");

  return (
    <Card className={cn("shadow-none overflow-hidden")}>
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <div className="relative flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={getImageUrl(item?.imageUrl)}
              alt="product image"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold capitalize">{item?.name}</h3>
            {item?.unit && (
              <span className="text-gray-500 text-sm">({item?.unit})</span>
            )}
            <span className="text-lg font-medium text-primary mt-1">
              {formatCurrency(item?.price)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={item.quantity === 1}
              className="h-8 w-8 rounded-l-md"
            >
              <Minus size={16} />
            </Button>
            <div className="h-8 w-12 flex items-center justify-center border-y border-input text-sm font-medium">
              {item.quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8 rounded-r-md"
            >
              <Plus size={16} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartProductCard;
