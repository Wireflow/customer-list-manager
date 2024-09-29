
import { UpdateOrderType } from "@/types/validation/order";
import { CreateProductType } from "@/types/validation/product";
import { createClient } from "@/utils/supabase/client";
import { useMutation } from "@tanstack/react-query";

const supabase = createClient();

export const updateOrder = async (orderData: UpdateOrderType) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const { error, data } = await supabase
    .from("orders")
    .update({
      ...orderData,
      branchId: session.user.user_metadata.branchId,
    })
    .eq("id", orderData?.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};


