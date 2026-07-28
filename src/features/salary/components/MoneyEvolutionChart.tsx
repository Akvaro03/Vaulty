"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { moneyEvolution, formatCurrency } from "@/lib/finance-data"
import { cn } from "@/lib/utils"

const chartConfig = {
  actual: { label: "Este año", color: "var(--chart-1)" },
  anterior: { label: "Año pasado", color: "var(--chart-5)" },
} satisfies ChartConfig

const ranges = ["6M", "1A", "Todo"] as const

export function MoneyEvolutionChart() {
  const [range, setRange] = useState<(typeof ranges)[number]>("1A")
  const data = range === "6M" ? moneyEvolution.slice(-6) : moneyEvolution

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">Evolución del dinero</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Saldo acumulado por mes</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                range === r
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ChartContainer config={chartConfig} className="mt-5 h-[260px] w-full">
        <AreaChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <defs>
            <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-actual)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-actual)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label}
                    </span>
                    <span className="font-mono font-medium">
                      {formatCurrency(value as number)}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Area
            dataKey="anterior"
            type="monotone"
            stroke="var(--color-anterior)"
            strokeWidth={2}
            strokeDasharray="5 4"
            fill="transparent"
            dot={false}
          />
          <Area
            dataKey="actual"
            type="monotone"
            stroke="var(--color-actual)"
            strokeWidth={2.5}
            fill="url(#fillActual)"
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
