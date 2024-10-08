"use client";

import List from "@/components/ui/list";
import { useDeleteProduct } from "@/hooks/mutations/products";
import { Row } from "@/types/supabase/table";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductCard from "../products/ProductCard";

type ProductsListProps = {
  products: Row<"products">[];
};

const ProductsList = ({ products }: ProductsListProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

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
          router.push(`/dashboard/products/${item.id}`);
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
