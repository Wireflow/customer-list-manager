"use client";

import { deleteProduct } from "@/actions/products";
import { useProductStore } from "@/store/useProductStore";
import { Row } from "@/types/supabase/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ProductCard from "../products/ProductCard";
import List from "@/components/ui/list";
import { useDeleteProduct } from "@/hooks/mutations/products";
import { useRouter } from "next/navigation";

type ProductsListProps = {
  products: Row<"products">[];
};

const ProductsList = ({ products }: ProductsListProps) => {
  const { setOpen, setProduct } = useProductStore();
  const queryClient = useQueryClient();
  const router = useRouter()

  const { mutate, isPending } = useDeleteProduct({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to delete product");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted!");
    },
  });

  const renderItem = (item: Row<"products">) => {
    return (
      <ProductCard
        product={item}
        key={item.id}
        disableSelect={true}
        onClick={() => {
          // setProduct(item);
          // setOpen(true);
          router.push(`/dashboard/products/${item.id}`)
        }}
        onDelete={() => mutate(item.id)}
        isDeleting={isPending}
      />
    );
  };

  return (
    <div className="mt-8">
      <ProductsCount count={products?.length || 0} />
      <List
        data={products ?? []}
        emptyMessage="No products found"
        renderItem={renderItem}
        error={false}
        containerClassName="grid gap-4"
      />
    </div>
  );
};

export default ProductsList;

const ProductsCount = ({ count }: { count: number }) => (
  <p className="font-semibold mb-2">Products ({count})</p>
);
