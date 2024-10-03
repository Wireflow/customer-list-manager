"use client";

import { createProduct, updateProduct } from "@/actions/products";
import ImageUpload from "@/components/form/ImageUpload";
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
import { useProductStore } from "@/store/useProductStore";
import {
  CreateProductSchema,
  CreateProductType,
} from "@/types/validation/product";

import { convertToBase64 } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const ProductForm = (props: Props) => {
  const { open, setOpen, setProduct, product } = useProductStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateProductType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      quantityInStock: undefined,
      costPrice: undefined,
      name: "",
      price: undefined,
      description: "",
      unit: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name ?? "",
        price: product.price ?? undefined,
        description: product.description ?? "",
        unit: product.unit ?? "",
        costPrice: product.costPrice ?? undefined,
        quantityInStock: product.quantityInStock ?? undefined,
      });
    } else {
      form.reset({
        name: "",
        price: undefined,
        description: "",
        unit: "",
        costPrice: undefined,
        quantityInStock: undefined,
      });
      setSelectedImage(null);
    }
  }, [product, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["product-action"],
    mutationFn: async (data: CreateProductType) => {
      if (!selectedImage && !product) {
        throw new Error("Please select an image for the product.");
      }

      const formData = new FormData();
      const base64Image =
        selectedImage && (await convertToBase64(selectedImage));

      formData.append("product", JSON.stringify(data));
      base64Image && formData.append("imageBase64", base64Image);
      selectedImage && formData.append("fileName", selectedImage.name);

      if (product) {
        return updateProduct(product.id, formData);
      } else {
        return createProduct(formData);
      }
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
      setSelectedImage(null);
      form.reset();
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
      setProduct(undefined);
      form.reset();
      setSelectedImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4 -ml-2" /> New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] max-h-[700px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {product ? "Edit Product" : "New Product"}
              </DialogTitle>
              <DialogDescription>
                {product
                  ? "Update product information"
                  : "Fill out required information to add a product"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="mt-4">
                <ImageUpload
                  onImageSelect={setSelectedImage}
                  image={selectedImage}
                  previewUrl={product?.imageUrl || ""}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="name"
                  control={form.control}
                  label="Name"
                  description="Display name of the product"
                />
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
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  className="no-spinners"
                  placeholder="ex. 29.99"
                  description="Display price lists will have"
                />
                <InputField
                  name="unit"
                  control={form.control}
                  label="Unit"
                  placeholder="ex. 24 PK, 10oz, 1 lb"
                  description="Units the product is sold at"
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
                <InputField
                  name="description"
                  control={form.control}
                  label="Description (optional)"
                  description="Description of the product"
                />
              </div>
            </div>

            <DialogFooter className="gap-4 mt-4">
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending
                  ? product
                    ? "Updating..."
                    : "Creating..."
                  : product
                    ? "Update Product"
                    : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
