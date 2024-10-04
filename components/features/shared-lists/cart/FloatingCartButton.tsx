import AnimatedOverlayPanel from "@/components/animted-ui/AnimtedOverlayPanel";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import CartPage from "./CartPage";

type Props = {};

const FloatingCartButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);

  const totalQuantity = cart.reduce(
    (acc, item) => acc + (item.quantity ?? 0),
    0
  );

  const toggleExpand = () => setOpen(!open);

  return (
    <AnimatedOverlayPanel
      open={open}
      onOpenChange={setOpen}
      containerClassName="p-0"
      backgroundClassName="bg-gray-50"
      disableX
      trigger={({ onClick }) => (
        <motion.div
          className="absolute right-4 bottom-4 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
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
                className="absolute -top-6 -left-6 bg-red-500 p-2 rounded-full w-7 h-7 flex items-center justify-center"
              >
                {totalQuantity}
              </motion.span>
              <ShoppingCart />
            </div>
          </Button>
        </motion.div>
      )}
      content={<CartPage toggleExpand={toggleExpand} />}
    />
  );
};

export default FloatingCartButton;
