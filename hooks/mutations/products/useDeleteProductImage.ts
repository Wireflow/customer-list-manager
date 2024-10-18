import { deleteProductImage } from "@/actions/product_images";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useDeleteProductImage = useCreateMutation({
  mutationKey: ["delete-product-image"],
  mutationFn: deleteProductImage,
  invalidateQueries: [["products"]],
});
