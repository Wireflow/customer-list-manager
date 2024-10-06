"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const createUser = async (data: {
  email: string;
  password: string;
  branchId: string;
}) => {
  const { data: user, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        branchId: data.branchId,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: user };
};
