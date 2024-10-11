import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProduct } from "@/actions/products";
import ImageUpload from "@/components/form/ImageUpload";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCategories } from "@/hooks/queries/categories/useCategories";
import { Row } from "@/types/supabase/table";
import {
  CreateProductSchema,
  CreateProductType,
} from "@/types/validation/product";
import { convertToBase64 } from "@/utils/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_DIMENSION = 1000;

type Props = {
  product: Row<"products">;
};

const ProductPageForm = ({ product }: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
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

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_IMAGE_DIMENSION) {
            height *= MAX_IMAGE_DIMENSION / width;
            width = MAX_IMAGE_DIMENSION;
          }
        } else {
          if (height > MAX_IMAGE_DIMENSION) {
            width *= MAX_IMAGE_DIMENSION / height;
            height = MAX_IMAGE_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          0.8
        ); // Compress to JPEG with 80% quality
      };
      img.onerror = (error) => reject(error);
      img.src = URL.createObjectURL(file);
    });
  };

  const checkAndConvertImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_FILE_SIZE) {
        reject(
          new Error(
            `File size should not exceed ${MAX_FILE_SIZE / (1024 * 1024)} MB`
          )
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // Remove the data URL prefix
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (file: File | null) => {
    setImageError(null);
    if (file) {
      try {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(
            `File size should not exceed ${MAX_FILE_SIZE / (1024 * 1024)} MB`
          );
        }
        const resizedBlob = await resizeImage(file);
        setSelectedImage(
          new File([resizedBlob], file.name, { type: "image/jpeg" })
        );
      } catch (error) {
        setImageError((error as Error).message);
        setSelectedImage(null);
      }
    } else {
      setSelectedImage(null);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["product-update"],
    mutationFn: async (data: CreateProductType) => {
      const formData = new FormData();
      formData.append("product", JSON.stringify(data));

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      return updateProduct(product.id, formData);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to update product!");
        return;
      }

      setSelectedImage(null);
      toast.success("Product updated!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error(err.message || "Failed to update product!");
    },
  });

  const onSubmit = (data: CreateProductType) => {
    mutate(data);
  };

  const formatedCategories =
    categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? [];

  const isDirty = form.formState.isDirty || !!selectedImage;

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 ">
          <div className="mt-4 ">
            <ImageUpload
              height={400}
              onImageSelect={handleImageSelect}
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
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductPageForm;
