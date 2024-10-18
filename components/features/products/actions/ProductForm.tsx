"use client";

import { createProduct, updateProduct } from "@/actions/products";
import InputField from "@/components/form/InputField";
import MultiImageUpload from "@/components/form/MultiImageUpload";
import SelectField from "@/components/form/SelectField";
import TextareaField from "@/components/form/TextareaField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategories } from "@/hooks/queries/categories/useCategories";
import { useProductStore } from "@/store/useProductStore";
import {
  CreateProductSchema,
  CreateProductType,
  ImageFile,
} from "@/types/validation/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  mode?: "edit" | "new";
  trigger?: React.ReactNode;
};

const ProductForm = ({ mode = "new", trigger }: Props) => {
  const { open, setOpen, setProduct, product } = useProductStore();
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();

  const form = useForm<CreateProductType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      quantityInStock: 0,
      costPrice: 0,
      name: undefined,
      price: 0,
      description: undefined,
      unit: undefined,
      categoryId: undefined,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name ?? undefined,
        price: product.price ?? 0,
        description: product.description ?? undefined,
        unit: product.unit ?? undefined,
        costPrice: product.costPrice ?? 0,
        quantityInStock: product.quantityInStock ?? 0,
        categoryId: product.categoryId ?? undefined,
      });
      setSelectedImages(
        product.imageUrls?.map((img) => ({
          file: new File([], img.imageUrl),
          preview: img.imageUrl,
          id: img.id,
        })) || []
      );
    } else {
      resetForm();
    }
  }, [product, form]);

  const resetForm = () => {
    form.reset({
      name: "",
      price: 0,
      description: "",
      unit: "",
      costPrice: 0,
      quantityInStock: 0,
      categoryId: undefined,
    });
    setSelectedImages([]);
    setProduct(undefined);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["product-action"],
    mutationFn: async (data: CreateProductType) => {
      const formData = new FormData();

      selectedImages.forEach((img, index) => {
        formData.append(`images`, img.file, img.file.name);
      });

      return createProduct(data, formData);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(
          product ? "Failed to update product!" : "Failed to create product!"
        );
        return;
      }
      toast.success(product ? "Product updated!" : "Product created!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      resetForm();
    },
    onError: (err: Error) => {
      toast.error(
        err.message ||
          (product ? "Failed to update product!" : "Failed to create product!")
      );
    },
  });

  const onSubmit = (data: CreateProductType) => {
    mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const formatedCategories =
    categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? [];

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4 -ml-2" /> New Product
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SheetHeader>
              <SheetTitle>
                {product ? "Edit Product" : "New Product"}
              </SheetTitle>
              <SheetDescription>
                {product
                  ? "Update product information"
                  : "Fill out required information to add a product"}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold mb-4">Product Images</h3>
                <MultiImageUpload
                  onImagesSelect={(files) => setSelectedImages(files)}
                  images={selectedImages}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <InputField
                    name="name"
                    control={form.control}
                    label="Name"
                    placeholder="Product name here"
                    description="Display name of the product"
                  />

                  <SelectField
                    name="categoryId"
                    placeholder="Select category"
                    control={form.control}
                    options={formatedCategories}
                    label="Category"
                    description="Category of the product"
                  />

                  <InputField
                    name="unit"
                    control={form.control}
                    label="Unit"
                    placeholder="ex. 24 PK, 10oz, 1 lb"
                    description="Units the product is sold at"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4">
                  Pricing and Inventory
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      name="costPrice"
                      control={form.control}
                      label="Cost Price ($)"
                      type="number"
                      step="0.01"
                      className="no-spinners"
                      placeholder="ex. 25.99"
                      description="Cost price of the product"
                    />
                    <InputField
                      name="price"
                      control={form.control}
                      label="Selling Price ($)"
                      type="number"
                      step="0.01"
                      className="no-spinners"
                      placeholder="ex. 29.99"
                      description="Display price lists will have"
                    />
                  </div>

                  <InputField
                    name="quantityInStock"
                    control={form.control}
                    label="Quantity in Stock"
                    type="number"
                    step="1"
                    className="no-spinners"
                    placeholder="ex. 100"
                    description="Quantity in stock of the product"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <TextareaField
                  name="description"
                  control={form.control}
                  label="Description (optional)"
                  description="Detailed description of the product"
                />
              </section>
            </div>

            <SheetFooter className="pt-4 gap-4">
              <SheetClose asChild>
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  (mode === "new" && !form.formState.isValid) ||
                  (mode === "edit" &&
                    !form.formState.isValid &&
                    !form.formState.isDirty)
                }
              >
                {isPending
                  ? product
                    ? "Updating..."
                    : "Creating..."
                  : product
                    ? "Update Product"
                    : "Create Product"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ProductForm;
