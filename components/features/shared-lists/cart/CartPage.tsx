import PageHeader from "@/components/layout/PageHeader";
import InfoCard from "@/components/shared-ui/InfoCard";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/useCartStore";
import { formatCurrency } from "@/utils/utils";
import { motion } from "framer-motion";
import { Send, Trash, X } from "lucide-react";
import CartProductsList from "./CartProductsList";

type Props = {
  toggleExpand: () => void;
};

const CartPage = ({ toggleExpand }: Props) => {
  const cart = useCartStore((state) => state.cart);
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalQuantity = getTotalQuantity();
  const totalPrice = getTotalPrice();

  return (
    <motion.div
      initial={{ clipPath: "circle(0% at bottom right)" }}
      animate={{ clipPath: "circle(150% at bottom right)" }}
      exit={{ clipPath: "circle(0% at bottom right)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-black z-50 overflow-y-auto"
    >
      <div className="p-6">
        <PageHeader
          disableMargin
          title="Your Cart"
          description="View and manage your cart"
          textColor="text-white"
          rightContent={
            <div className="flex gap-4 items-center">
              <div className="hidden md:inline">
                <Button
                  size={"lg"}
                  variant={"destructive"}
                  className="w-full md:w-fit"
                >
                  <Trash className="h-4 w-4 text-white mr-2" /> Clear Cart
                </Button>
              </div>
              <Button size={"lg"} variant={"secondary"} className="w-full">
                <Send className="h-4 w-4 text-black mr-2" /> Send Order
              </Button>

              <Button onClick={toggleExpand} variant="ghost">
                <X color="white" size={24} />
              </Button>
            </div>
          }
        />
        <div className="flex md:flex-row flex-col gap-4 md:max-w-[50%] mb-8">
          <InfoCard
            title="Total"
            value={formatCurrency(totalPrice)}
            textColor="text-secondary-foreground"
            className="bg-secondary border-secondary"
          />
          <InfoCard
            title="Quantity"
            value={`${totalQuantity} items`}
            textColor="text-secondary-foreground"
            className="bg-secondary border-secondary"
          />
        </div>

        <CartProductsList cart={cart} />
        <div className="inline md:hidden">
          <Button
            size={"lg"}
            variant={"destructive"}
            className="w-full md:w-fit  mt-8"
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
