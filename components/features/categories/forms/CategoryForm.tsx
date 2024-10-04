"use client";

import { createCategory, updateCategory } from "@/actions/categories";
import InputField from "@/components/form/InputField";
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
import { Form } from "@/components/ui/form";
import { useCategoryStore } from "@/store/useCategoryStore";
import {
  CreateCategorySchema,
  CreateCategoryType,
} from "@/types/validation/catgories";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const CategoryForm = (props: Props) => {
  const { open, setOpen, category, setCategory } = useCategoryStore();
  const queryClient = useQueryClient();

  const form = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name ?? "",
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [category, form]);

  const resetForm = () => {
    form.reset({
      name: "",
    });
    setCategory(undefined);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["category-action"],
    mutationFn: async (data: CreateCategoryType) => {
      const formData = new FormData();
      formData.append("categories", JSON.stringify(data));

      if (category) {
        return updateCategory(category.id, formData);
      } else {
        return createCategory(formData);
      }
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(
          category ? "Failed to update Category!" : "Failed to create Category!"
        );
        return;
      }

      toast.success(category ? "Category updated!" : "Category created!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      resetForm();
    },
    onError: (err: Error) => {
      toast.error(
        err.message ||
          (category
            ? "Failed to update Category!"
            : "Failed to create Category!")
      );
    },
  });

  const onSubmit = (data: CreateCategoryType) => {
    mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full mt-3">
          <PlusCircle className="mr-2 h-4 w-4 -ml-2" /> Create new category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] max-h-[700px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {category ? "Edit Category" : "New Category"}
              </DialogTitle>
              <DialogDescription>
                {category
                  ? "Update category information"
                  : "Fill out required information to add a category"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  name="name"
                  control={form.control}
                  label="Name"
                  description="Display name of the Category"
                />
              </div>
            </div>

            <DialogFooter className="gap-4 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending || !form.getValues("name")}
                loading={isPending}
              >
                {isPending
                  ? category
                    ? "Updating..."
                    : "Creating..."
                  : category
                    ? "Update category"
                    : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
