import { updateUserBranch, updateUserRole } from "@/actions/users";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useUpdateUserBranch = useCreateMutation({
  mutationKey: ["update-user-branch"],
  mutationFn: updateUserBranch,
  invalidateQueries: [["users"]],
});
