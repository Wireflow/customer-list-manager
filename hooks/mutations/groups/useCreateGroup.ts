import { createdGroup } from "@/actions/groups";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useCreateGroup = useCreateMutation({
  mutationKey: ["groups"],
  mutationFn: createdGroup,
  invalidateQueries: [["groups"]],
});
