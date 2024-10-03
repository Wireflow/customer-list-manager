import { sendMessage } from "@/lib/ez-texting";
import { millisecondsToHours } from "@/utils/dateUtils";
import { createClient } from "@/utils/supabase/client";
import { getAccountByPhoneNumber } from "./accounts";
import { getBranchById } from "./branches";

export type FullListParams = {
  phoneNumber: string;
  instructions?: string;
  originUrl: string;
};

const supabase = createClient();

export const createSharedList = async (sharedList: FullListParams) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const {
      data: branch,
      success: branchSuccess,
      error: branchError,
    } = await getBranchById(user.user_metadata.branchId);

    if (!branchSuccess) {
      throw new Error(branchError);
    }

    const account = await getAccountByPhoneNumber(sharedList.phoneNumber);

    if (!account?.success) {
      throw new Error(account.error);
    }

    const expirationTime = new Date();
    const validFor = millisecondsToHours(branch?.listValidTime ?? 7200000); // Default to 2 hours
    expirationTime.setHours(expirationTime.getHours() + validFor);

    const { error, data } = await supabase
      .from("sharedLists")
      .insert({
        branchId: user.user_metadata.branchId,
        type: "full",
        accountId: account?.data?.id ?? "",
        expirationTime: expirationTime.toISOString(),
        instructions: sharedList?.instructions,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (account.data?.phoneNumber) {
      const response = await sendMessage({
        to: account?.data?.phoneNumber,
        body: `View full list here: ${origin}/shared/${data.id}?phone=${sharedList.phoneNumber}`,
      });

      if (!response?.success) {
        throw new Error(response?.error);
      }
    }

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to send shared list" };
  }
};
