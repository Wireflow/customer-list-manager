"use client";

import React from "react";
import { useProfit } from "@/hooks/queries/financials/useProfit";
import { useRevenue } from "@/hooks/queries/financials/useRevenue";
import { useTopSellingProducts } from "@/hooks/queries/financials/useTopSellingProducts";
import { formatCurrency } from "@/utils/utils";
import TopSellingProductsList from "@/components/features/financials/TopSellingProductsList";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingCart,
} from "lucide-react";

const currentDate = new Date();
const firstDayOfCurrentMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
);
const firstDayOfLastMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 1,
  1
);
const lastDayOfLastMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  0
);

const FinancialsPage = () => {
  const { data: products } = useTopSellingProducts();

  const { data: thisMonthRevenue } = useRevenue({
    startDate: firstDayOfCurrentMonth.toISOString(),
    endDate: currentDate.toISOString(),
  });

  const { data: lastMonthRevenue } = useRevenue({
    startDate: firstDayOfLastMonth.toISOString(),
    endDate: lastDayOfLastMonth.toISOString(),
  });

  const { data: profit } = useProfit();

  const profitPercentage =
    thisMonthRevenue && profit ? (profit / thisMonthRevenue) * 100 : 0;
  const isProfitPositive = profitPercentage > 0;

  const totalSales =
    products?.reduce((sum, product) => sum + product.sales, 0) || 0;

  // Calculate the percentage change in revenue
  const revenuePercentageChange = (() => {
    if (lastMonthRevenue === 0 && (thisMonthRevenue ?? 0) > 0) {
      return 100; // 100% increase if there were no sales last month but there are sales this month
    } else if (lastMonthRevenue === 0 && (thisMonthRevenue ?? 0) === 0) {
      return 0; // 0% change if there were no sales in both months
    } else {
      return (
        ((thisMonthRevenue ?? 0 - (lastMonthRevenue ?? 0)) /
          (lastMonthRevenue ?? 0)) *
        100
      );
    }
  })();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-none overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(thisMonthRevenue ?? 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
            <div className="mt-4 text-sm">
              <span className="font-medium">
                {revenuePercentageChange > 0 ? "+" : ""}
                {revenuePercentageChange.toFixed(2)}%
              </span>{" "}
              from last month
            </div>
          </CardContent>
        </Card>

        <Card className={`overflow-hidden shadow-none`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">Total Profit</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(profit ?? 0)}
                </p>
              </div>
              {isProfitPositive ? (
                <ArrowUpRight className="h-8 w-8 opacity-80" />
              ) : (
                <ArrowDownRight className="h-8 w-8 opacity-80" />
              )}
            </div>
            <div className="mt-4 text-sm">
              Profit Margin:{" "}
              <span className="font-medium">
                {profitPercentage.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">Total Sales</p>
                <p className="text-3xl font-bold mt-2">{totalSales}</p>
              </div>
              <ShoppingCart className="h-8 w-8 opacity-80" />
            </div>
            <div className="mt-4 text-sm">
              Across {products?.length ?? 0} products
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Selling Products
            </h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <TopSellingProductsList products={products ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialsPage;
