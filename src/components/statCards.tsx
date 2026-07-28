import { TrendingUp, TrendingDown, PiggyBank, Gauge } from "lucide-react"
import { summary, formatCurrency } from "@/lib/finance-data"
import { cn } from "@/lib/utils"

const budgetPct = Math.round((summary.budgetUsed / summary.budgetTotal) * 100)

const stats = [
  {
    label: "Ingresos",
    value: formatCurrency(summary.income),
    delta: "+12,4%",
    positive: true,
    icon: TrendingUp,
    sub: "Este mes",
  },
  {
    label: "Gastos",
    value: formatCurrency(summary.expenses, { decimals: true }),
    delta: "-4,1%",
    positive: true,
    icon: TrendingDown,
    sub: "Este mes",
  },
  {
    label: "Ahorro",
    value: formatCurrency(summary.savings),
    delta: "+8,7%",
    positive: true,
    icon: PiggyBank,
    sub: "Este mes",
  },
  {
    label: "Presupuesto usado",
    value: `${budgetPct}%`,
    delta: `${formatCurrency(summary.budgetTotal - summary.budgetUsed)} libres`,
    positive: budgetPct < 90,
    icon: Gauge,
    sub: `de ${formatCurrency(summary.budgetTotal)}`,
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <s.icon className="size-[18px]" aria-hidden="true" />
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                s.positive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {s.delta}
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
