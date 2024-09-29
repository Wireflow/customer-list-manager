import { createAccount } from "@/actions/accounts";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useConsentMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["consent"],
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success("Consent submitted successfully");
      router.push("/opted");
    },
    onError: () => {
      toast.error("Failed to submit consent");
    },
  });
};
