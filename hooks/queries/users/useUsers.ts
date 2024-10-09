import { getUsers } from "@/actions/users";
import { useSession } from "@/hooks/queries/auth/useSession"; // Assuming you have a hook to get the current session
import { useQuery } from "@tanstack/react-query";

export const useUsers = (branchId?: string) => {
  const { session, isLoading: isSessionLoading } = useSession();

  return useQuery({
    queryKey: ["users", branchId],
    queryFn: async () => {
      if (!session || !session.user) {
        throw new Error("User not authenticated");
      }

      const { data, error, success } = await getUsers(branchId);

      console.log(data);

      if (!success || error) {
        throw new Error(JSON.stringify(error) ?? "Failed to fetch users");
      }

      return data ?? [];
    },
    enabled: !!session && !isSessionLoading,
    retry: (failureCount, error) => {
      // Retry up to 3 times, but don't retry on authentication errors
      return failureCount < 3 && error.message !== "User not authenticated";
    },
  });
};
