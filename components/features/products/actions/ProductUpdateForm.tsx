import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProduct } from "@/actions/products";
import { useCategories } from "@/hooks/queries/categories/useCategories";
import {
  ImageFile,
  UpdateProductSchema,
  UpdateProductType,
} from "@/types/validation/product";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormDescription } from "@/components/ui/form";

import InputField from "@/components/form/InputField";
import MultiImageUpload from "@/components/form/MultiImageUpload";
import SelectField from "@/components/form/SelectField";
import TextareaField from "@/components/form/TextareaField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteProductImage } from "@/hooks/mutations/products/useDeleteProductImage";
import { ProductWithDetails } from "@/hooks/queries/products/useProductsById";
import { SelectItem } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import { useDeleteProductOption } from "@/hooks/mutations/products/useDeleteProductOptions";

type Props = {
  product: ProductWithDetails;
};

const ProductUpdateForm = ({ product }: Props) => {
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<UpdateProductType>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || "",
      unit: product.unit || "",
      costPrice: product.costPrice ?? 0,
      quantityInStock: product.quantityInStock,
      categoryId: product.categoryId ?? "",
    },
  });

  useEffect(() => {
    setSelectedImages(
      product.imageUrls?.map((img) => ({
        file: new File([], img.imageUrl),
        preview: img.imageUrl,
        id: img.id,
      })) || []
    );
  }, [product]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-product"],
    mutationFn: async (data: UpdateProductType) => {
      const formData = new FormData();
      newImages.forEach((img) => {
        formData.append(`images`, img.file, img.file.name);
      });
      return updateProduct(data, formData);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to update product!");
        return;
      }
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.refetchQueries({ queryKey: ["products", product.id] });

      router.refresh();

      if (newImages.length > 0) {
        setNewImages([]);
        window.location.reload();
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update product!");
    },
  });

  const onSubmit = (data: UpdateProductType) => {
    mutate(data);
  };

  const formatedCategories =
    categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? [];

  const { mutate: deleteImage } = useDeleteProductImage({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to remove image");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["products", product.id] });
      toast("Image removed");
    },
  });

  const handleImageSelect = (files: ImageFile[]) => {
    const newImageFiles = files.filter(
      (file) => !selectedImages.some((img) => img.preview === file.preview)
    );
    setSelectedImages(files);
    setNewImages((prevNewImages) => [...prevNewImages, ...newImageFiles]);
  };

  const handleImageRemove = (id?: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((img) => img.id !== id)
    );

    setNewImages((prevNewImages) =>
      prevNewImages.filter((img) => img.id !== id)
    );

    const isNew = newImages.some((img) => img.id === id);

    if (id && !isNew) {
      deleteImage(id);
    }
  };

  const isDirty = form.formState.isDirty || newImages.length > 0;

  const { mutate: deleteOption, isPending: isDeletingOption } =
    useDeleteProductOption();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiImageUpload
                onRemoveImage={handleImageRemove}
                onImagesSelect={handleImageSelect}
                images={selectedImages}
              />
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="flex md:flex-row flex-col gap-4">
                  <div className="flex-1">
                    <InputField
                      name="unit"
                      control={form.control}
                      label="Unit"
                      placeholder="ex. 24 PK, 10oz, 1 lb"
                      description="Units the product is sold at"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <Label>Selections</Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a selection" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.options.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id}
                            className="flex items-center justify-between p-2 px-3"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteOption(option.id);
                            }}
                            disabled={isDeletingOption}
                          >
                            {option.name}
                            <Button size={"sm"} variant={"outline"}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </SelectItem>
                        ))}
                        <SelectItem value="lb" className="mt-2">
                          <Button size={"sm"} className="w-full text-xs">
                            <Plus size={16} className="mr-2" />
                            Add Option
                          </Button>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Different product selections
                    </FormDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pricing and Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <TextareaField
              name="description"
              control={form.control}
              label="Description (optional)"
              description="Detailed description of the product"
            />
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? (
              <Save className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Update Product
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductUpdateForm;
