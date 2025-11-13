"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { calculatePercentage, convertFileSize } from "@/lib/utils";
import { useEffect, useState } from "react";

const chartConfig = {
  size: { label: "Size" },
  used: { label: "Used", color: "white" },
} satisfies ChartConfig;

export const Chart = ({ used = 0 }: { used: number }) => {
  const chartData = [{ name: "used", storage: used, fill: "white" }];

  const percentage = used ? calculatePercentage(used) : 0;
  const percentageStr = percentage.toString();

  // Track viewport width to make chart responsive
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Prevent rendering before width is known (avoids 1023px glitch)
  if (width === null) return null;

  // Smooth transition sizes based on width
  const isMobile = width < 1024;
  const innerRadius = isMobile ? 45 : 55;
  const outerRadius = isMobile ? 52 : 70;
  const polarRadius = isMobile ? [44, 40] : [58, 52];

  return (
    <Card className="chart w-full lg:w-auto">
      <CardContent className="chart-content">
        <ChartContainer config={chartConfig} className="chart-container">
          <RadialBarChart
            width={isMobile ? 160 : 200}
            height={isMobile ? 160 : 200}
            data={chartData}
            startAngle={90}
            endAngle={90 + percentage}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="rgba(255, 255, 255, 0.2)"
              className="polar-grid"
              polarRadius={polarRadius}
              strokeWidth={5}
              fill="#242424"
            />
            <RadialBar
              dataKey="storage"
              background={{ fill: "white" }}
              cornerRadius={10}
              fill="white"
            />
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
                          y={(viewBox.cy || 0) - (isMobile ? 6 : 8)}
                          className="chart-total-percentage"
                        >
                          {percentageStr}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + (isMobile ? 12 : 16)}
                          className="chart-space-label"
                        >
                          Space Used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardHeader className="chart-details">
        <CardTitle className="chart-title sm:hidden lg:inline ">Available Storage</CardTitle>
        <CardDescription className="chart-description">
          {used ? convertFileSize(used) : "4.5 MB"} / 2 GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
