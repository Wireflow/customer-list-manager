import ProductForm from "@/components/features/products/actions/ProductForm";
import { useCategoryDetailsById } from "@/hooks/queries/categories/useCategoryDetailsById";
import { formatDateToString } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import { Row } from "@/types/supabase/table";
import { getImageUrl } from "@/utils/imageUtils";
import { formatCurrency } from "@/utils/utils";
import { Edit } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  product: Row<"products">;
};

const ProductDetailsContainer = ({ product }: Props) => {
    const { setOpen, setProduct } = useProductStore();
    const { data: category } = useCategoryDetailsById(product?.categoryId ?? "");
    const handleClick =() => {
        setOpen(true);
        setProduct(product);
    }
  return (
    <div className=" flex ">
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex flex-col gap-3 w-full">
        <Image
  className="border rounded-lg p-4 flex flex-col gap-4  "
  src={getImageUrl(product?.imageUrl)}
  alt="product image"
  width={1200}
  height={800}
/>
        </div>
        <div className="w-full flex justify-between">
          <div className="flex flex-col sm:flex-row justify-between w-full max-w-[450px] gap-5 ">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-neutral-600 font-semibold">Product Name</p>
                <p className="font-bold">{product?.name}</p>
              </div>
              <div>
                <p className="text-neutral-600 font-semibold">Category</p>
                <p className="font-bold">
                  {category ? category?.name : "No category"}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 font-semibold">Product Price</p>
                <p className="font-bold">{formatCurrency(product?.price)}</p>
              </div>
              <div>
                <p className="text-neutral-600 font-semibold">Cost Price</p>
                <p className=" font-bold">
                  {formatCurrency(product?.costPrice ? product?.costPrice : 0)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p>Product Description</p>
                <p className="font-bold">
                  {product?.description
                    ? product?.description
                    : "No description"}
                </p>
              </div>
              <div>
                <p className="font-bold">Unit</p>
                <p>{product?.unit ? product?.unit : "No unit"}</p>
              </div>
              <div>
                <p className="font-bold">Created At</p>
                <p>{formatDateToString(new Date(product?.createdAt))}</p>
              </div>
            </div>
          </div>
     
          <ProductForm mode="edit"  />
          <Edit onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsContainer;
