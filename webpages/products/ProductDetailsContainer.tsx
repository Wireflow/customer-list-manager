import ProductPageForm from "@/components/features/products/actions/ProductUpdateForm";
import { Row, ViewRow } from "@/types/supabase/table";

type Props = {
  product: ViewRow<"products_with_sales">;
};

const ProductDetailsContainer = ({ product }: Props) => {
  return (
    <div className=" flex ">
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <ProductPageForm product={product} />
      </div>
    </div>
  );
};

export default ProductDetailsContainer;
