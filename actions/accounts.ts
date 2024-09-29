"use server";

import { ConsentType } from "@/types/validation/consent";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const createAccount = async (data: ConsentType) => {
  const session = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .select("phoneNumber, id")
    .eq("phoneNumber", data.phoneNumber)
    .single();

  if (accountData) {
    const response = await updateAccount({
      id: accountData.id,
      data: { opted: data.opted, optedAt: data.optedAt, name: data.name },
    });

    if (!response?.success) {
      return { success: false, error: response?.error };
    }

    return { success: true, data: response?.data };
  }

  if (accountError) {
    return { success: false, error: accountError.message };
  }

  const branchId = session.data.session?.user.user_metadata.branchId;

  const { data: account, error } = await supabase
    .from("accounts")
    .insert({
      phoneNumber: data.phoneNumber,
      branchId,
      name: data.name,
      opted: data.opted,
      optedAt: data.optedAt,
    })
    .select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: account };
};

export const updateAccount = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ConsentType>;
}) => {
  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", id)
    .single();

  if (accountData) {
    const { data: updatedAccount, error: updateError } = await supabase
      .from("accounts")
      .update(data)
      .eq("id", accountData.id)
      .select("*")
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, data: updatedAccount };
  }
};
