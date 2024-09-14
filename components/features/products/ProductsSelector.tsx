import { Row } from "@/types/supabase/table.types";
import { useEffect, useState } from "react";
import ListFilter from "../lists/ListFilter";
import ProductCard from "./ProductCard";

type Props = {
  products?: Row<"products">[] | null;
  onSelection: (products: Row<"products">[]) => void;
};

const ProductsSelector = ({ products, onSelection }: Props) => {
  const [selected, setSelected] = useState<Row<"products">[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Row<"products">[]>(
    []
  );

  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (products) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleSelect = (product: Row<"products">) => {
    const updatedSelection = selected.some((p) => p.id === product.id)
      ? selected.filter((p) => p.id !== product.id)
      : [...selected, product];

    setSelected(updatedSelection);
    onSelection(updatedSelection);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <ListFilter
        onChangeText={setSearchQuery}
        label="Find items"
        description="Search products by name..."
      />
      <div className="max-h-[330px] overflow-auto no-scrollbar">
        <div className="grid gap-4">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                product={product}
                onClick={() => handleSelect(product)}
                onChecked={() => handleSelect(product)}
                checked={!!selected.find((p) => p.id === product.id)}
                disableSelect={false}
              />
            ))
          ) : (
            <div className="p-2 text-center h-full">No products available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSelector;
