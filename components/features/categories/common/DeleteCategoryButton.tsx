"use client";

import { Button } from "@/components/ui/button";
import DangerDialog from "@/components/ui/danger-dialog";
import { useDeleteCategory } from "@/hooks/mutations/categories/useDeleteCategory";
import React from "react";
import { toast } from "sonner";

type Props = {
  categoryId: string;
};

const DeleteCategoryButton = ({ categoryId }: Props) => {
  const { mutate, isPending } = useDeleteCategory();

  const handleDelete = () => {
    mutate(categoryId, {
      onSuccess: (data) => {
        if (!data.success) {
          toast.error(
            data.error || "An error occurred during category deletion"
          );
          return;
        }

        toast.success("Category deleted successfully");
      },
    });
  };

  return (
    <DangerDialog
      title="Delete Category"
      description="Are you sure you want to delete this category?"
      trigger={
        <Button
          size={"sm"}
          className="text-xs max-w-[60px]"
          variant={"destructive"}
          loading={isPending}
        >
          Delete
        </Button>
      }
      onConfirm={handleDelete}
      disabled={isPending}
    />
  );
};

export default DeleteCategoryButton;
