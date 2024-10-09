"use server";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

type ShortType = {
  originalUrl: string;
};

export const createShortUrl = async (params: ShortType) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  const shortCode = nanoid(6);

  const { error, data } = await supabase
    .from("shortUrls")
    .insert({
      originalUrl: params.originalUrl,
      shortCode,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
