"use client";

import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/utils";
import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { ProductWithSales } from "@/hooks/queries/financials/useTopSellingProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type TopSellingProductsListProps = {
  products: ProductWithSales[];
};

const TopSellingProductsList = ({ products }: TopSellingProductsListProps) => {
  const router = useRouter();

  const navigateToProduct = (productId: string) => {
    router.push(`/dashboard/products/${productId}`);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity > 50) return { color: "bg-green-500", text: "In Stock" };
    if (quantity > 10) return { color: "bg-yellow-500", text: "Low Stock" };
    return { color: "bg-red-500", text: "Critical Stock" };
  };

  const calculateProfit = (costPrice: number, sellingPrice: number) => {
    const profit = sellingPrice - costPrice;
    const profitPercentage = (profit / costPrice) * 100;
    return { profit, profitPercentage };
  };

  const maxSales = Math.max(...products.map((p) => p.sales));

  const fields: TableField<ProductWithSales>[] = [
    {
      key: (row) => (
        <div className="flex items-center space-x-2">
          <img
            src={row.imageUrl || "/placeholder.png"}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
      label: "Product",
    },
    {
      key: (row) => (
        <div className="flex flex-col">
          <span className="font-bold">{row.sales}</span>
          <Progress value={(row.sales / maxSales) * 100} className="w-24 h-2" />
        </div>
      ),
      label: "Sales",
    },
    {
      key: (row) => (
        <div className="flex flex-col">
          <span>{formatCurrency(row.costPrice ?? 0)}</span>
          <span className="text-xs text-gray-500">Cost Price</span>
        </div>
      ),
      label: "Cost",
    },
    {
      key: (row) => (
        <div className="flex flex-col">
          <span>{formatCurrency(row.price)}</span>
          <span className="text-xs text-gray-500">Selling Price</span>
        </div>
      ),
      label: "Price",
    },
    {
      key: (row) => {
        const { profit, profitPercentage } = calculateProfit(
          row.costPrice ?? 0,
          row.price
        );
        const isPositive = profit > 0;
        return (
          <div className="flex items-center space-x-1">
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
              {formatCurrency(profit)}
            </span>
            {isPositive ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span className="text-xs">({profitPercentage.toFixed(2)}%)</span>
          </div>
        );
      },
      label: "Profit",
    },
    {
      key: (row) => {
        const status = getStockStatus(row.quantityInStock);
        return (
          <Badge className={`${status.color} text-white`}>
            {status.text} ({row.quantityInStock})
          </Badge>
        );
      },
      label: "Stock",
      className: "min-w-[200px]",
    },
    {
      key: (row) => (
        <Button
          size="sm"
          className="text-xs"
          onClick={() => navigateToProduct(row.id)}
        >
          View Details
        </Button>
      ),
      label: "Action",
    },
  ];

  return (
    <div className="space-y-4">
      {products.some((p) => p.quantityInStock < 10) && (
        <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-100 p-2 rounded mt-4">
          <AlertTriangle size={20} />
          <span>Some products are low in stock. Consider restocking soon.</span>
        </div>
      )}
      <DynamicTable
        fields={fields}
        data={products ?? []}
        emptyMessage="No products found"
      />
    </div>
  );
};

export default TopSellingProductsList;
