"use client";

import { createProduct } from "@/actions/products";
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
import {
  CreateProductSchema,
  CreateProductType,
} from "@/types/validation/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { convertToBase64 } from "@/utils/utils";

type Props = {};

const CreateProduct = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateProductType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      price: undefined,
      description: "",
      unit: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: async (data: CreateProductType) => {
      if (!selectedImage) {
        throw new Error("Please select an image for the product.");
      }

      const formData = new FormData();
      const base64Image = await convertToBase64(selectedImage);

      formData.append("product", JSON.stringify(data));
      formData.append("imageBase64", base64Image);
      formData.append("fileName", selectedImage.name);

      return createProduct(formData);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data.success) {
        toast.error("Failed to create product!");
        return;
      }

      toast.success("Product created!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      //   router.push(`/dashboard/products/${data.data?.id}`);
      setOpen(false);
      setSelectedImage(null);
      setPreviewUrl(null);

      form.reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create product!");
    },
  });

  const onSubmit = (data: CreateProductType) => {
    mutate(data);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4 -ml-2" /> New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>New Product</DialogTitle>
              <DialogDescription>
                Fill out required information to add a product
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div
                  className="relative w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <>
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        layout="fill"
                        objectFit="contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload image
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="name"
                  control={form.control}
                  label="Name"
                  description="This is the display name of the product"
                />
                <InputField
                  name="price"
                  control={form.control}
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  className="no-spinners"
                  placeholder="ex. 29.99"
                  description="This is the display price lists will have"
                />
                <InputField
                  name="unit"
                  control={form.control}
                  label="Unit"
                  placeholder="ex. 24 PK, 10oz, 1 lb"
                  description="This is the units the product is sold at"
                />
                <InputField
                  name="description"
                  control={form.control}
                  label="Description (optional)"
                  description="This is the description of the product"
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
                disabled={
                  isPending || !form.formState.isValid || !selectedImage
                }
              >
                {isPending ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
