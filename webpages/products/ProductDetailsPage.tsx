"use client";
import PageHeader from "@/components/layout/PageHeader";
import InfoCard from "@/components/shared-ui/InfoCard";
import { useProductsById } from "@/hooks/queries/products/useProductsById";
import { formatCurrency } from "@/utils/utils";
import ProductDetailsContainer from "./ProductDetailsContainer";

type Props = {
  id: string;
};

const ProductDetailsPage = ({ id }: Props) => {
  const { data: product } = useProductsById(id);
  const StockValue = product?.costPrice
    ? product?.costPrice * product?.quantityInStock
    : 0;

  if (!product) return <div>Product not found</div>;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Product Details" description="View product details" />
      <div className="flex flex-col lg:flex-row gap-5 items-center">
        <InfoCard title="Qunatity In Stock" value={product?.quantityInStock} />
        <InfoCard
          title="Total Stock Value"
          value={formatCurrency(StockValue)}
        />
        <InfoCard title="Total Sales" value={product?.sales} />
      </div>

      <ProductDetailsContainer product={product} />
    </div>
  );
};

export default ProductDetailsPage;
