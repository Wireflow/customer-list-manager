"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PLACEHOLDER_IMG_URL } from "@/data/constants";
import { ProductWithSales } from "@/hooks/queries/products/useProductsById";
import { Row } from "@/types/supabase/table";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/utils";
import { Minus, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  product: ProductWithSales;
  disableSelect?: boolean;
  disableDelete?: boolean;
  disableQuantity?: boolean;
  onClick?: () => void;
  onChecked?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disableAdd?: boolean;
  onAdd?: (product: Row<"products">) => void;
  onDelete?: () => void;
  onQuantityChange?: (newQuantity: number) => void;
  isDeleting?: boolean;
  checked?: boolean;
  quantity?: number;
};

const SharedProductCard: React.FC<Props> = ({
  product,
  onClick,
  disableSelect = false,
  disableQuantity = false,
  onChecked,
  onQuantityChange,
  checked = false,
  disableAdd,
  onAdd,
  quantity = 0,
}) => {
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuantityChange) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuantityChange && quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <Card
      onClick={onClick}
      className={cn("shadow-none", {
        "cursor-pointer hover:shadow-[0px_0px_20px_1px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden":
          !!onClick,
      })}
    >
      <CardContent className="py-4 px-6 flex flex-col gap-4 h-full justify-between">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-4 items-center">
            {!disableSelect && (
              <Checkbox
                checked={checked}
                onClick={onChecked}
                className="w-[20px] h-[20px]"
              />
            )}
            {product.imageUrls.length > 0 ? (
              <Carousel className="w-[300px]">
                <CarouselContent>
                  {product.imageUrls.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="relative flex-shrink-0 overflow-hidden w-[300px] h-[200px]">
                        <Image
                          src={img.imageUrl ?? PLACEHOLDER_IMG_URL}
                          alt={`product image ${index + 1}`}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="relative flex-shrink-0 overflow-hidden">
                <Image
                  src={product?.imageUrls[0]?.imageUrl || PLACEHOLDER_IMG_URL}
                  alt="product image"
                  width={270}
                  height={200}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col ml-2">
          <CardTitle className="text-lg capitalize">
            {product?.name}{" "}
            {product?.unit && (
              <span className="text-gray-500 font-normal">
                ({product?.unit})
              </span>
            )}
          </CardTitle>
          <CardDescription>{formatCurrency(product?.price)}</CardDescription>
        </div>

        <div className="flex items-center justify-between w-full gap-2">
          {!disableQuantity && onQuantityChange && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity === 0}
              >
                <Minus size={16} />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                type="button"
              >
                <Plus size={16} />
              </Button>
            </div>
          )}

          {onAdd && (
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(product);
              }}
              disabled={disableAdd || product.quantityInStock === 0}
            >
              {disableAdd
                ? "Already in Cart"
                : product.quantityInStock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SharedProductCard;
