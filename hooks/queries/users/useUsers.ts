import { getUsers } from "@/actions/users";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await getUsers();

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });
};
