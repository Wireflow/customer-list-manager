import { updateAccount } from "@/actions/accounts";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useRemoveNotifiedAccount = useCreateMutation({
  mutationKey: ["remove-notified-account"],
  mutationFn: updateAccount,
  invalidateQueries: [["accounts"], ["accounts", "notified"]],
});
