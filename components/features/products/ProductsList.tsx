"use client";

import { deleteProduct } from "@/actions/products";
import { Row } from "@/types/supabase/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ProductCard from "../products/ProductCard";

type ProductsListProps = {
  products: Row<"products">[];
};

const ProductsList = ({ products }: ProductsListProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-product"],
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to delete product");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  return (
    <div className="mt-8">
      <p className="font-semibold mb-2">Products ({products?.length || 0})</p>
      <div className="grid gap-4">
        {products && products.length > 0 ? (
          products?.map((item) => (
            <ProductCard
              product={item}
              key={item.id}
              disableSelect={true}
              onDelete={() => mutate(item.id)}
              isDeleting={isPending}
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

export default ProductsList;
