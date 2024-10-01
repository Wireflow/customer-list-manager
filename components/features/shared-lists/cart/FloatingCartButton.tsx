import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/useCartStore";
import { ShoppingCart, X } from "lucide-react";
import CartPage from "./CartPage";

type Props = {};

const FloatingCartButton = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cart = useCartStore((state) => state.cart);

  const totalQuantity = cart.reduce(
    (acc, item) => acc + (item.quantity ?? 0),
    0
  );

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <>
      <AnimatePresence>
        {isExpanded && <CartPage toggleExpand={toggleExpand} />}
      </AnimatePresence>

      <motion.div
        className="fixed right-4 bottom-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={toggleExpand}
          className="w-14 h-14 rounded-full shadow-xl"
        >
          <div className="relative">
            <motion.span
              key={totalQuantity}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-7 -left-7 bg-red-500 p-2 rounded-full w-8 h-8 flex items-center justify-center"
            >
              {totalQuantity}
            </motion.span>
            <ShoppingCart />
          </div>
        </Button>
      </motion.div>
    </>
  );
};

export default FloatingCartButton;
