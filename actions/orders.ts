"use server";

import { sendMessage } from "@/lib/ez-texting";
import { Enum } from "@/types/supabase/enum";
import { OrderType, UpdateOrderType } from "@/types/validation/order";
import { createClient } from "@/utils/supabase/server";
import { getBranchById } from "./branches";
import { formatPhoneNumber } from "@/utils/utils";

const supabase = createClient();

export const updateOrder = async (orderData: UpdateOrderType) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Fetch the current order and its items
  const { data: currentOrder, error: fetchError } = await supabase
    .from("orders")
    .select(
      `
      totalAmount, 
      totalQuantity,
      orderItems (id, productId, quantity)
    `
    )
    .eq("id", orderData.id)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  let additionalAmount = 0;
  let additionalQuantity = 0;

  if (orderData.orderItems.length > 0) {
    for (const newItem of orderData.orderItems) {
      const existingItem = currentOrder.orderItems.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        // Update existing item
        const { error: updateError } = await supabase
          .from("orderItems")
          .update({ quantity: existingItem.quantity + newItem.quantity })
          .eq("id", existingItem.id);

        if (updateError) {
          return { success: false, error: updateError.message };
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from("orderItems")
          .insert({ ...newItem });

        if (insertError) {
          return { success: false, error: insertError.message };
        }
      }

      additionalAmount += newItem.price * newItem.quantity;
      additionalQuantity += newItem.quantity;
    }
  }

  // Update the order, incrementing the totals
  const { error, data } = await supabase
    .from("orders")
    .update({
      totalAmount: (currentOrder.totalAmount || 0) + additionalAmount,
      totalQuantity: (currentOrder.totalQuantity || 0) + additionalQuantity,
      branchId: user.user_metadata.branchId,
    })
    .eq("id", orderData.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const updateOrderStatus = async (
  orderId: string,
  status: Enum<"order_status">
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error, data } = await supabase
    .from("orders")
    .update({
      status,
    })
    .eq("id", orderId)
    .eq("branchId", user.user_metadata.branchId)
    .select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const createOrder = async (orderData: OrderType) => {
  const { data, error } = await supabase.rpc("create_order", {
    order_data: {
      ...orderData,
      shared_list_id: orderData.sharedListId,
    },
  });

  //@ts-ignore
  if (error || !data?.success) {
    //@ts-ignore
    return { success: false, error: data?.error ?? error?.message };
  }

  const { data: sharedList, error: sharedListError } = await supabase
    .from("sharedLists")
    .select("branchId")
    .eq("id", orderData.sharedListId)
    .single();

  if (sharedList?.branchId) {
    const { data: accounts, error: accountsError } = await supabase
      .from("notified_accounts")
      .select("notify_phoneNumber")
      .eq("branchId", sharedList.branchId);

    if (accounts && accounts?.length > 0) {
      const formattedAccounts = accounts.map(
        (acc) => acc.notify_phoneNumber ?? ""
      );

      await sendMessage({
        to: formattedAccounts,
        body: `You have a new order from ${formatPhoneNumber(orderData.phoneNumber)}!`,
      });
    }
  }

  //@ts-ignore
  return { success: true, data: data?.data };
};
