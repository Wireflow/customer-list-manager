import { deleteProduct } from "@/actions/products";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useDeleteProduct = useCreateMutation({
  mutationKey: ["delete-product"],
  mutationFn: deleteProduct,
  invalidateQueries: [["products"]],
});
