import { deleteProductOption } from "@/actions/product_options";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useDeleteProductOption = useCreateMutation({
  mutationKey: ["delete-product-option"],
  mutationFn: deleteProductOption,
  invalidateQueries: [["products"]],
});
