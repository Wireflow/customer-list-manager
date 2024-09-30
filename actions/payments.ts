"use server";

import { Insert } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const createOrderPayment = async (payment: Insert<"payments">) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error, data } = await supabase
    .from("payments")
    .insert(payment)
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({ paymentId: data.id })
    .eq("id", payment.orderId);

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  return { success: true, data };
};
