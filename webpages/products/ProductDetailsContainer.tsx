import ProductPageForm from "@/components/features/products/actions/ProductPageForm";
import { Row } from "@/types/supabase/table";

type Props = {
  product: Row<"products">;
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
