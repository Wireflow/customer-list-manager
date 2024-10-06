import { updateBranch } from "@/actions/branches";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useUpdateBranch = useCreateMutation({
  mutationKey: ["update-branch"],
  mutationFn: updateBranch,
  invalidateQueries: [["branches"]],
});
