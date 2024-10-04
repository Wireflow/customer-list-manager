import { updateList } from "@/actions/lists";
import { Update } from "@/types/supabase/table";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useUpdateList = (listId?: string) => {
  return useCreateMutation({
    mutationKey: ["lists", "update", listId],
    mutationFn: (list: Update<"lists">) => updateList({ ...list, id: listId }),
    invalidateQueries: [["lists"], ["lists", listId]],
  });
};
