import { createSharedList } from "@/actions/sharedLists";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useShareList = useCreateMutation({
  mutationKey: ["share-full-list"],
  mutationFn: createSharedList,
  invalidateQueries: [["accounts"]],
});
