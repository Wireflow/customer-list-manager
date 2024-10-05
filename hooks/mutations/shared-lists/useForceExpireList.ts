import { forceSharedListExpire } from "@/actions/sharedLists";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useForceExpireList = useCreateMutation({
  mutationKey: ["force-expire-list"],
  mutationFn: forceSharedListExpire,
});
