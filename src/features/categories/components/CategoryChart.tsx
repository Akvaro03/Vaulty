"use client"

import { Pie, PieChart, Cell, Label } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { spendingByCategory, formatCurrency } from "@/lib/finance-data"

const palette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-5)",
  "var(--muted-foreground)",
]

const chartConfig = spendingByCategory.reduce((acc, item, i) => {
  acc[item.key] = { label: item.category, color: palette[i] }
  return acc
}, {} as ChartConfig)

const total = spendingByCategory.reduce((s, c) => s + c.value, 0)

export function CategoryChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-base font-semibold">Gastos por categoría</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">Distribución de este mes</p>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <ChartContainer config={chartConfig} className="h-[180px] w-[180px] shrink-0">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        {chartConfig[name as string]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(value as number, { decimals: true })}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={spendingByCategory}
              dataKey="value"
              nameKey="key"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={2}
              strokeWidth={0}
            >
              {spendingByCategory.map((entry, i) => (
                <Cell key={entry.key} fill={palette[i]} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 6}
                          className="fill-foreground text-lg font-semibold"
                        >
                          {formatCurrency(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 14}
                          className="fill-muted-foreground text-xs"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="grid w-full grid-cols-1 gap-2.5">
          {spendingByCategory.map((c, i) => (
            <li key={c.key} className="flex items-center gap-2.5 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: palette[i] }}
                aria-hidden="true"
              />
              <span className="flex-1 text-muted-foreground">{c.category}</span>
              <span className="font-medium">{Math.round((c.value / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
