import { createdNotifiedAccount } from "@/actions/accounts";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useCreateNotifiedAccount = useCreateMutation({
  mutationKey: ["create-account"],
  mutationFn: createdNotifiedAccount,
  invalidateQueries: [["accounts"], ["accounts", "notified"]],
});
