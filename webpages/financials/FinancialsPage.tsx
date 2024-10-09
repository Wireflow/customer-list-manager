"use client";
import React, { useState } from "react";
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
  ShoppingCart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared-ui/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { useTotalSales } from "@/hooks/queries/financials/useTotalSales";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstDayOfCurrentMonth,
    to: currentDate,
  });
  const [selectedLimit, setSelectedLimit] = useState(10);
  const { data: products } = useTopSellingProducts(selectedLimit);

  const { data: thisMonthRevenue } = useRevenue({
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  const { data: lastMonthRevenue } = useRevenue({
    startDate: firstDayOfLastMonth.toISOString(),
    endDate: lastDayOfLastMonth.toISOString(),
  });

  const { data: thisMonthSales } = useTotalSales({
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  const { data: lastMonthSales } = useTotalSales({
    startDate: firstDayOfLastMonth.toISOString(),
    endDate: lastDayOfLastMonth.toISOString(),
  });

  const limits = [5, 10, 20, 50];

  const { data: profit } = useProfit({
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  const profitPercentage =
    thisMonthRevenue && profit ? (profit / thisMonthRevenue) * 100 : 0;
  const isProfitPositive = profitPercentage > 0;

  const revenuePercentageChange = (() => {
    if (lastMonthRevenue === 0 && (thisMonthRevenue ?? 0) > 0) {
      return 100;
    } else if (lastMonthRevenue === 0 && (thisMonthRevenue ?? 0) === 0) {
      return 0;
    } else {
      return (
        ((thisMonthRevenue ?? 0 - (lastMonthRevenue ?? 0)) /
          (lastMonthRevenue ?? 0)) *
        100
      );
    }
  })();

  const handleLimitChange = (value: string) => {
    setSelectedLimit(Number(value));
  };

  return (
    <div className="space-y-8">
      <DatePickerWithRange onDateChange={setDateRange} date={dateRange} />
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
                <p className="text-3xl font-bold mt-2">{thisMonthSales}</p>
              </div>
              <ShoppingCart className="h-8 w-8 opacity-80" />
            </div>
            <div className="mt-4 text-sm">
              Last Month: <span className="font-medium">{lastMonthSales}</span>
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
            <Select
              onValueChange={handleLimitChange}
              value={String(selectedLimit)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a limit" />
              </SelectTrigger>
              <SelectContent>
                {limits.map((limit) => (
                  <SelectItem key={limit} value={String(limit)}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TopSellingProductsList products={products ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialsPage;
