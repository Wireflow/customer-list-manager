import React, { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useCartStore from "@/store/useCartStore";
import { formatCurrency, formatPhoneNumber } from "@/utils/utils";
import { Send, Trash, ShoppingBag, ArrowLeft } from "lucide-react";
import CartProductsList from "./CartProductsList";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  toggleExpand: () => void;
};

const CartPage = ({ toggleExpand }: Props) => {
  const cart = useCartStore((state) => state.cart);
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setPhoneNumber(searchParams.get("phone") || "");
    setIsLoading(false);
  }, []);

  const totalQuantity = getTotalQuantity();
  const totalPrice = getTotalPrice();

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const handleSendOrder = () => {
    // Implement order sending logic here
    alert("Order sent successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <PageHeader
        disableMargin
        title="Your Cart"
        description="View and manage your cart"
        textColor="text-black"
        rightContent={
          <Button variant="ghost" onClick={toggleExpand}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shopping
          </Button>
        }
      />

      <div className="flex-grow flex flex-col md:flex-row gap-6  md:p-6 max-w-7xl mx-auto w-full">
        <Card className="flex-grow md:w-2/3 p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <ShoppingBag className="mr-2 h-6 w-6" /> Your Items
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : cart.length > 0 ? (
            <CartProductsList cart={cart} />
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-xl font-semibold text-gray-600">
                Your cart is empty
              </p>
              <p className="mt-2 text-gray-500">
                Add some items to get started!
              </p>
            </div>
          )}
        </Card>

        <Card className="md:w-1/3 p-6 bg-white shadow-sm self-start sticky top-4">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-semibold">{totalQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-lg">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-semibold">
                {formatPhoneNumber(phoneNumber) || "N/A"}
              </span>
            </div>
            <div className="border-t pt-3 mt-3">
              <p className="text-sm text-gray-600">
                This is an anonymous order. Only the phone number is used for
                identification.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <Button
              size="lg"
              variant="default"
              className="w-full"
              onClick={handleSendOrder}
              disabled={cart.length === 0}
            >
              <Send className="mr-2 h-4 w-4" /> Send Order
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleClearCart}
              disabled={cart.length === 0}
            >
              <Trash className="mr-2 h-4 w-4" /> Clear Cart
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default CartPage;
