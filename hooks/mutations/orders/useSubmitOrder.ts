import { createOrder } from "@/actions/orders";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useSubmitOrder = useCreateMutation({
  mutationKey: ["create-order"],
  mutationFn: createOrder,
});
