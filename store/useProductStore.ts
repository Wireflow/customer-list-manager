import { Row } from "@/types/supabase/table";
import { create } from "zustand";

type ProductStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: Row<"products">;
  setProduct: (product?: Row<"products">) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  product: undefined,
  setProduct: (product) => set({ product }),
}));
