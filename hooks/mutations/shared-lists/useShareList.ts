import { createSharedList } from "@/actions/sharedLists";
import { useCreateMutation } from "@/utils/reactQueryUtils";
import { toast } from "sonner";

export const useShareList = useCreateMutation({
  mutationKey: ["share-full-list"],
  mutationFn: createSharedList,
  invalidateQueries: [["accounts"]],
});
