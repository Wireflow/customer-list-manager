"use server";

import { optIn } from "@/lib/ez-texting";
import { ConsentType } from "@/types/validation/consent";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const updateAccount = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ConsentType>;
}) => {
  if (!supabase.auth.getUser()) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", id)
    .single();

  if (accountError) {
    return { success: false, error: accountError?.message };
  }

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

export const createAccount = async (data: ConsentType) => {
  const session = await supabase.auth.getSession();
  const branchId = session.data.session?.user.user_metadata.branchId;

  if (!session.data.session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("phoneNumber, id, opted")
      .eq("phoneNumber", data.phoneNumber)
      .single();

    if (accountData?.opted) {
      return { success: false, error: "Account already opted in" };
    }

    if (data.opted && !accountData?.opted) {
      const optedInResult = await optIn({ to: data.phoneNumber });

      if (!optedInResult.success) {
        throw new Error(optedInResult.error);
      }
    }

    if (accountData) {
      const response = await updateAccount({
        id: accountData.id,
        data: { opted: data.opted, optedAt: data.optedAt, name: data.name },
      });

      if (!response?.success) {
        return { success: false, error: response?.error };
      }
    }

    if (accountError && accountError.code !== "PGRST116") {
      throw new Error(accountError.message);
    }

    if (!accountData) {
      const { error } = await supabase
        .from("accounts")
        .insert({
          phoneNumber: data.phoneNumber,
          branchId,
          name: data.name,
          opted: data.opted,
          optedAt: data.optedAt,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
    }

    return { success: true, data: accountData };
  } catch (error) {
    console.error("Error in createAccount:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const getAccountById = async (accountId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: account, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", accountId)
    .eq("branchId", user.user_metadata.branchId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: account };
};

export const getAccountByPhoneNumber = async (phoneNumber: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: account, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("phoneNumber", phoneNumber)
    .eq("branchId", user.user_metadata.branchId)
    .single();

  if (error) {
    return { success: false, error: "Account not found" };
  }

  return { success: true, data: account };
};
