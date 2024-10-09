import { updateUserRole } from "@/actions/users";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useUpdateUserRole = useCreateMutation({
  mutationKey: ["update-user-role"],
  mutationFn: updateUserRole,
  invalidateQueries: [["users"]],
});
