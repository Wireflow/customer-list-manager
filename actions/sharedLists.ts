import { sendMessage } from "@/lib/ez-texting";
import { createClient } from "@/utils/supabase/client";

export type FullListParams = {
  phoneNumber: string;
  instructions?: string;
  originUrl: string;
};

export const createSharedList = async (sharedList: FullListParams) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if account exists
  let { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .select("phoneNumber, id")
    .eq("phoneNumber", sharedList.phoneNumber)
    .single();

  // If account doesn't exist, create it
  if (!accountData) {
    const { data: newAccount, error: createError } = await supabase
      .from("accounts")
      .insert({
        phoneNumber: sharedList.phoneNumber,
        branchId: session.user.user_metadata.branchId,
      })
      .select()
      .single();

    if (createError) {
      return { success: false, error: createError.message };
    }

    accountData = newAccount;
  } else if (accountError) {
    return { success: false, error: accountError.message };
  }

  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24);

  const { error, data } = await supabase
    .from("sharedLists")
    .insert({
      branchId: session.user.user_metadata.branchId,
      type: "full",
      accountId: accountData?.id ?? "",
      expirationTime: expirationTime.toISOString(),
      instructions: sharedList?.instructions,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await sendMessage({
    to: accountData.phoneNumber,
    body: `This is a list just for you: ${origin}/shared/${data.id}`,
  });

  // Send SMS
  // const response = await sendSMS("Full list", accountData?.phoneNumber || "");

  // if (!response.success) {
  //   return { success: false, error: response.error };
  // }

  return { success: true, data };
};
