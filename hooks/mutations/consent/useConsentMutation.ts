import { createAccount } from "@/actions/accounts";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useConsentMutation = useCreateMutation({
  mutationKey: ["consent"],
  mutationFn: createAccount,
});
