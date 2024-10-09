import { createBranch } from "@/actions/branches";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useCreateBranch = useCreateMutation({
  mutationKey: ["create-branch"],
  mutationFn: createBranch,
  invalidateQueries: [["branches"]],
});
