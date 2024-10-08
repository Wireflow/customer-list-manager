"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import DangerDialog from "@/components/ui/danger-dialog";
import { Row } from "@/types/supabase/table";
import { cn } from "@/utils/cn";
import { getImageUrl } from "@/utils/imageUtils";
import { formatCurrency } from "@/utils/utils";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  product: Row<"products">;
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

const ProductCard = ({
  product,
  onClick,
  disableDelete = false,
  disableSelect = false,
  disableQuantity = false,
  isDeleting = false,
  onChecked,
  onDelete,
  onQuantityChange,
  checked = false,
  disableAdd,
  onAdd,
  quantity = 0,
}: Props) => {
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
      <CardContent className="p-2 px-6 flex flex-row items-center justify-between h-[75px] overflow-hidden">
        <div className="flex gap-2 items-center">
          <div className="flex gap-4 items-center">
            {!disableSelect ? (
              <Checkbox
                checked={checked}
                onClick={onChecked}
                className="w-[20px] h-[20px]"
              />
            ) : null}
            <div className="relative flex-shrink-0 overflow-hidden md:w-auto md:h-auto h-16 w-16">
              <Image
                src={getImageUrl(product?.imageUrl)}
                alt="product image"
                width={75}
                height={75}
                style={{ objectFit: "contain", overflow: "hidden" }}
              />
            </div>
          </div>

          <div className="flex flex-col ml-2">
            <CardTitle className="md:text-lg text-sm capitalize items-center justify-center">
              {product?.name}
            </CardTitle>
            {product?.unit && (
              <span className="text-gray-500 text-xs font-normal">
                ({product?.unit})
              </span>
            )}
            <CardDescription>{formatCurrency(product?.price)}</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2 iteme-center justify-center">
            <Badge
              className="self-end w-4 h-4 p-0"
              variant={product.quantityInStock > 0 ? "success" : "destructive"}
            ></Badge>
            {!disableQuantity && onQuantityChange && (
              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity === 0}
                  className="h-8 w-8 rounded-l-md"
                >
                  <Minus size={16} />
                </Button>
                <div className="h-8 w-12 flex items-center justify-center border-y border-input text-sm font-medium">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={handleIncrement}
                  className="h-8 w-8 rounded-r-md"
                >
                  <Plus size={16} />
                </Button>
              </div>
            )}
          </div>

          {!disableDelete && onDelete ? (
            <div onClick={(e) => e.stopPropagation()}>
              <DangerDialog
                title="Remove item?"
                description="This will remove item from this list"
                trigger={
                  <Button
                    variant={"outline"}
                    loading={isDeleting}
                    disabled={isDeleting}
                    className="w-fit"
                    type="button"
                  >
                    <Trash size={20} />
                  </Button>
                }
                onConfirm={() => onDelete()}
              />
            </div>
          ) : null}

          {!disableAdd && onAdd ? (
            <Button
              type="button"
              className="w-fit"
              onClick={() => onAdd(product)}
            >
              <Plus size={20} />
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
