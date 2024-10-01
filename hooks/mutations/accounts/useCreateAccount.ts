import { createAccount } from "@/actions/accounts";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useCreateAccount = useCreateMutation({
  mutationKey: ["create-account"],
  mutationFn: createAccount,
  invalidateQueries: [["accounts"]],
});
