"use client";

import { createUser } from "@/actions/users";
import { useCreateMutation } from "@/utils/reactQueryUtils";

export const useCreateUser = useCreateMutation({
  mutationKey: ["create-user"],
  mutationFn: createUser,
  invalidateQueries: [["users"]],
});
