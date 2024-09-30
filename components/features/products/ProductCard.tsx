"use client";

import SubmitButton from "@/components/form/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import DangerDialog from "@/components/ui/danger-dialog";
import { PLACEHOLDER_IMG_URL } from "@/data/constants";
import { Row } from "@/types/supabase/table";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/utils";
import { Trash, Plus, Minus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  product: Row<"products">;
  disableSelect?: boolean;
  disableDelete?: boolean;
  disableQuantity?: boolean;
  onClick?: () => void;
  onChecked?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
      <CardContent className="p-2 px-6 flex flex-row items-center justify-between h-[75px]">
        <div className="flex gap-2 items-center">
          <div className="flex gap-4 items-center">
            {!disableSelect ? (
              <Checkbox
                checked={checked}
                onClick={onChecked}
                className="w-[20px] h-[20px]"
              />
            ) : null}
            <div className="relative flex-shrink-0 overflow-hidden">
              <Image
                src={product?.imageUrl || PLACEHOLDER_IMG_URL}
                alt="product image"
                width={75}
                height={75}
                style={{ objectFit: "contain" }}
              />
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
        </div>

        <div className="flex items-center gap-2">
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

          {!disableDelete && onDelete ? (
            <DangerDialog
              title="Remove item?"
              description="This will remove item from this list"
              trigger={
                <SubmitButton
                  variant={"outline"}
                  pendingText="Deleting..."
                  pending={isDeleting}
                  className="w-fit"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash size={20} />
                </SubmitButton>
              }
              onConfirm={onDelete}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
