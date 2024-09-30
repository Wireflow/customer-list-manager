import { SelectOptions } from "@/components/shared-ui/Select";
import { Enum } from "@/types/supabase/enum";

export const PLACEHOLDER_IMG_URL =
  "https://archive.org/download/placeholder-image/placeholder-image.jpg";

export const PAYMENT_METHODS: Enum<"payment_method">[] = [
  "check",
  "card",
  "cash",
  "hold",
  "zelle",
  "wire",
  "custom",
];

export const paymentMethodOptions: SelectOptions[] =
  PAYMENT_METHODS.map((method) => ({
    value: method,
    label: method,
  })) ?? [];
