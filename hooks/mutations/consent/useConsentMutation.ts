import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useConsentMutation = () => {
  return useMutation({
    mutationKey: ["consent"],
    mutationFn: async (data) => {
      console.log(data);
    },
    onSuccess: () => {
      toast.success("Consent submitted successfully");
    },
    onError: () => {
      toast.error("Failed to submit consent");
    },
  });
};
