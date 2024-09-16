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
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  product: Row<"products">;
  disableSelect?: boolean;
  disableDelete?: boolean;
  onClick?: () => void;
  onChecked?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  checked?: boolean;
};

const ProductCard = ({
  product,
  onClick,
  disableDelete = false,
  disableSelect = false,
  isDeleting = false,
  onChecked,
  onDelete,
  checked = false,
}: Props) => {
  return (
    <Card
      onClick={onClick}
      className={cn("shadow-none", {
        "cursor-pointer hover:shadow-[0px_0px_20px_1px_rgba(0,0,0,0.1)] transition-all duration-500":
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
      </CardContent>
    </Card>
  );
};

export default ProductCard;
