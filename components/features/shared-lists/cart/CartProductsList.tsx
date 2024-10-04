import List from "@/components/ui/list";
import { CartItem } from "@/store/useCartStore";
import React from "react";
import CartProductCard from "./CartProductCard";

type Props = {
  cart: CartItem[];
};

const CartProductsList: React.FC<Props> = ({ cart }) => {
  const renderItem = (item: CartItem) => <CartProductCard item={item} />;

  return (
    <List
      renderItem={renderItem}
      data={cart ?? []}
      error={false}
      containerClassName="grid  gap-4"
      emptyMessage="Your cart is empty"
      errorMessage="Failed to load cart"
    />
  );
};

export default CartProductsList;
