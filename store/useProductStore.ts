import { Row } from "@/types/supabase/table";
import { create } from "zustand";

export type Product = Row<"products"> & {
  imageUrls: Row<"product_images">[];
};

type ProductStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: Product;
  setProduct: (product?: Product) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  product: undefined,
  setProduct: (product) => set({ product }),
}));
