import ProductForm from "@/components/features/products/actions/ProductForm";
import ProductPageForm from "@/components/features/products/actions/ProductPageForm";
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

  const { data: category } = useCategoryDetailsById(product?.categoryId ?? "");

  return (
    <div className=" flex ">
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <ProductPageForm product={product} mode="edit" />
      </div>
    </div>
  );
};

export default ProductDetailsContainer;
