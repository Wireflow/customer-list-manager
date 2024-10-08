import { deleteUser } from "@/actions/users";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useDeleteUser = useCreateMutation({
  mutationKey: ["delete-user"],
  mutationFn: deleteUser,
  invalidateQueries: [["users"]],
});
