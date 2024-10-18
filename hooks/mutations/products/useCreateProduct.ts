import { deleteProduct } from "@/actions/products";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useCreateProduct = () => {
  return useCreateMutation({
    mutationKey: ["delete-product"],
    mutationFn: deleteProduct,
    invalidateQueries: [["products"]],
  });
};
