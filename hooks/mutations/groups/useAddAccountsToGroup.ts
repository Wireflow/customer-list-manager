import { addAccountsToGroup } from "@/actions/groups";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useAddAccountsToGroup = () => {
  return useCreateMutation({
    mutationKey: ["groups"],
    mutationFn: addAccountsToGroup,
    invalidateQueries: [["groups"]],
  });
};
