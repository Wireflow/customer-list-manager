import { Row } from "@/types/supabase/table";
import { create } from "zustand";

type CategoryStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  category?: Row<"categories">;
  setCategory: (category?: Row<"categories">) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  category: undefined,
  setCategory: (category) => set({ category }),
}));
