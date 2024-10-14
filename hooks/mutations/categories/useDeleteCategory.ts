import { deleteCategory } from "@/actions/categories";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useDeleteCategory = useCreateMutation({
  mutationKey: ["delete-category"],
  mutationFn: deleteCategory,
  invalidateQueries: [["categories"], ["products"]],
});
