import React from "react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
type Props = {};

const MiniRadialChart = (props: Props) => {
    const chartData = [
        { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
      ];
      const chartConfig = {
        visitors: {
          label: "Visitors",
        },
        safari: {
          label: "Safari",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig;
  return (
    <div className="flex justify-center items-center h-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-22 w-28"
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={250}
          innerRadius={40}
          outerRadius={55}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[43, 37]}
          />
          <RadialBar dataKey="visitors" background cornerRadius={5} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {chartData[0].visitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}
                        className="fill-muted-foreground text-xs"
                      >
                        Visitors
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};

export default MiniRadialChart;
