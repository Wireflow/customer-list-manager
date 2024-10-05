import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProduct } from "@/actions/products";
import ImageUpload from "@/components/form/ImageUpload";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCategories } from "@/hooks/queries/categories/useCategories";
import { useProductStore } from "@/store/useProductStore";
import { Row } from "@/types/supabase/table";
import {
  CreateProductSchema,
  CreateProductType,
} from "@/types/validation/product";
import { convertToBase64 } from "@/utils/utils";

type Props = {
  product: Row<"products">;
};

const ProductPageForm = ({ product }: Props) => {
  const { setOpen } = useProductStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { data: categories } = useCategories();

  const queryClient = useQueryClient();

  const form = useForm<CreateProductType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      quantityInStock: product.quantityInStock ?? 0,
      costPrice: product.costPrice ?? 0,
      name: product.name ?? "",
      price: product.price ?? 0,
      description: product.description ?? "",
      unit: product.unit ?? "",
      categoryId: product.categoryId ?? "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name ?? "",
        price: product.price ?? 0,
        description: product.description ?? "",
        unit: product.unit ?? "",
        costPrice: product.costPrice ?? 0,
        quantityInStock: product.quantityInStock ?? 0,
        categoryId: product.categoryId ?? "",
      });
    }
  }, [product, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["product-update"],
    mutationFn: async (data: CreateProductType) => {
      const formData = new FormData();
      const base64Image =
        selectedImage && (await convertToBase64(selectedImage));

      formData.append("product", JSON.stringify(data));
      base64Image && formData.append("imageBase64", base64Image);
      selectedImage && formData.append("fileName", selectedImage.name);

      return updateProduct(product.id, formData);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to update product!");
        return;
      }

      toast.success("Product updated!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update product!");
    },
  });

  const onSubmit = (data: CreateProductType) => {
    if (!data.categoryId) {
      toast.error("Category of the product is required.");
      return;
    }

    mutate(data);
  };

  const formatedCategories =
    categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? [];

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 ">
          <div className="mt-4 ">
            <ImageUpload
              height={400}
              onImageSelect={setSelectedImage}
              image={selectedImage}
              previewUrl={product?.imageUrl || ""}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid md:grid-cols-2 w-full gap-4 col-span-2">
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
            </div>
            <div className="grid md:grid-cols-3 gap-4 col-span-2">
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
              <InputField
                name="quantityInStock"
                control={form.control}
                label="Quantity in Stock"
                type="number"
                step="0.01"
                className="no-spinners"
                placeholder="ex. 100"
                description="Quantity in stock of the product"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 col-span-2">
              <InputField
                name="unit"
                control={form.control}
                label="Unit"
                placeholder="ex. 24 PK, 10oz, 1 lb"
                description="Units the product is sold at"
              />
              <InputField
                name="description"
                control={form.control}
                label="Description (optional)"
                description="Description of the product"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
          >
            {isPending ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductPageForm;