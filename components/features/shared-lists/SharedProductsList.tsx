"use client";

import useCartStore from "@/store/useCartStore";
import { Row } from "@/types/supabase/table";
import { useEffect } from "react";
import SharedProductCard from "./SharedProductCard";

type SharedProductsListProps = {
  products: Row<"products">[];
};

const SharedProductsList = ({ products }: SharedProductsListProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const getCartItem = useCartStore((state) => state.getCartItem);
  const cart = useCartStore((state) => state.cart);

  const handleQuantityChange = (
    product: Row<"products">,
    newQuantity: number
  ) => {
    const currentQuantity = getCartItem(product.id)?.quantity ?? 0;

    if (newQuantity > currentQuantity) {
      // Increase quantity
      for (let i = currentQuantity; i < newQuantity; i++) {
        increaseQuantity(product.id);
      }
    } else if (newQuantity < currentQuantity) {
      // Decrease quantity
      for (let i = currentQuantity; i > newQuantity; i--) {
        decreaseQuantity(product.id);
      }
    }

    // If new quantity is 0, remove the item from cart
    if (newQuantity === 0) {
      removeFromCart(product.id);
    }
  };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <div className="mt-8">
      <p className="font-semibold mb-2">Products ({products?.length || 0})</p>
      <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {products && products.length > 0 ? (
          products?.map((item) => (
            <SharedProductCard
              product={item}
              key={item.id}
              disableSelect={true}
              disableDelete
              disableQuantity={!getCartItem(item.id)}
              onAdd={() => addToCart(item)}
              disableAdd={!!getCartItem(item.id)}
              quantity={getCartItem(item.id)?.quantity ?? 0}
              onQuantityChange={(quantity) =>
                handleQuantityChange(item, quantity)
              }
            />
          ))
        ) : (
          <div className="flex flex-col gap-1 items-start mt-2 h-full">
            <p>You don't have any products</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedProductsList;
