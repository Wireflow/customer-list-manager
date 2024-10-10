"use server";

import { sendMessage } from "@/lib/ez-texting";
import { millisecondsToHoursAndMinutes } from "@/utils/dateUtils";
import { getAccountByPhoneNumber } from "./accounts";
import { getBranchById } from "./branches";
import { createClient } from "@/utils/supabase/server";
import { createShortUrl } from "./shortUrls";

export type FullListParams = {
  phoneNumber: string | string[];
  instructions?: string;
  originUrl: string;
  listId?: string | undefined;
  type: "full" | "custom";
};

const supabase = createClient();

export const createSharedList = async (
  sharedList: FullListParams
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.user_metadata?.branchId) {
      throw new Error("Unauthorized or missing branch ID");
    }

    const branchResult = await getBranchById(user.user_metadata.branchId);

    if (!branchResult.success || !branchResult.data) {
      throw new Error(branchResult.error || "Failed to get branch data");
    }

    const phoneNumbers = Array.isArray(sharedList.phoneNumber)
      ? sharedList.phoneNumber
      : [sharedList.phoneNumber];

    const expirationTime = new Date();
    const { hours, minutes } = millisecondsToHoursAndMinutes(
      branchResult.data.listValidTime ?? 7200000
    ); // Default to 2 hours
    expirationTime.setHours(expirationTime.getHours() + hours);
    expirationTime.setMinutes(expirationTime.getMinutes() + minutes);

    const sharedListsData: Array<{ id: string; phoneNumber: string }> = [];

    for (const phoneNumber of phoneNumbers) {
      const accountResult = await getAccountByPhoneNumber(phoneNumber);

      if (!accountResult?.success || !accountResult.data?.id) {
        console.warn(`Failed to get account for phone number: ${phoneNumber}`);
        continue;
      }

      const { error, data } = await supabase
        .from("sharedLists")
        .insert({
          branchId: user.user_metadata.branchId,
          type: sharedList.type,
          accountId: accountResult.data.id,
          expirationTime: expirationTime.toISOString(),
          instructions: sharedList.instructions ?? "",
          listId: sharedList.listId?.trim() ?? undefined,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error(
          `Failed to create shared list for ${phoneNumber}:`,
          error
        );
        continue;
      }

      sharedListsData.push({ id: data.id, phoneNumber });
    }

    if (sharedListsData.length === 0) {
      throw new Error("Failed to create any shared lists");
    }

    const messagePromises = sharedListsData.map(async (item) => {
      const originalUrl = `${sharedList.originUrl}/shared/${item.id}?phone=${item.phoneNumber}`;

      const shortUrl = await createShortUrl({
        originalUrl,
      });

      if (!shortUrl.success || !shortUrl.data) {
        throw new Error("Failed to shorten URL");
      }

      const messageBody = `View full list here: ${sharedList.originUrl}/${shortUrl.data.shortCode}`;
      const response = await sendMessage({
        to: item.phoneNumber,
        body: messageBody,
      });

      if (!response?.success) {
        console.error(
          `Failed to send message to ${item.phoneNumber}:`,
          response?.error
        );
      }

      return response?.success;
    });

    const messageResults = await Promise.all(messagePromises);
    const allMessagesSent = messageResults.every(Boolean);

    if (!allMessagesSent) {
      console.warn("Some messages failed to send");
    }

    return { success: true, data: sharedListsData };
  } catch (error) {
    console.error("Failed to send shared list:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send shared list",
    };
  }
};

export const forceSharedListExpire = async (listId: string) => {
  const { data, error } = await supabase.rpc("force_shared_list_expire", {
    list_id: listId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
