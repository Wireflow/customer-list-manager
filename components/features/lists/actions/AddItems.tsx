"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import ProductsSelector from "../../products/ProductsSelector";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { Row } from "@/types/supabase/table.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBulkListItems } from "@/actions/listItems";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type Props = {
  listId: string;
};

const AddItems = ({ listId }: Props) => {
  const searchParams = useSearchParams();
  const isNewList = searchParams?.get("new") === "true";

  const [open, setOpen] = useState(isNewList);
  const [selected, setSelected] = useState<Row<"products">[]>([]);
  const { data: products, isLoading } = useProducts();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-list-items"],
    mutationFn: createBulkListItems,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to add items!");
        return;
      }
      queryClient.refetchQueries({ queryKey: ["list", listId] });

      toast.success("Items added successfully!");
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add items!");
    },
  });

  const onSave = () => {
    mutate({ products: selected, listId });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger className="w-full">
        <Button className="w-full">Add items</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] min-h-[700px] md:min-h-[600px] max-h-[100px] transition-all duration-300 flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Add new items to list</DialogTitle>
          <DialogDescription>Select items to add to list.</DialogDescription>
        </DialogHeader>

        <div className="flex-1">
          {isLoading ? (
            <p>Getting products...</p>
          ) : (
            <ProductsSelector products={products} onSelection={setSelected} />
          )}
        </div>

        <DialogFooter className="gap-4">
          <DialogClose>
            <Button variant={"outline"} disabled={isPending} className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItems;
