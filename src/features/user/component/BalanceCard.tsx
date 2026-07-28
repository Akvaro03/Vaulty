import { ArrowUpRight, Eye } from "lucide-react"
import { summary, formatCurrency } from "@/lib/finance-data"

export function BalanceCard() {
  const diff = summary.totalBalance - summary.lastYearBalance
  const pct = (diff / summary.lastYearBalance) * 100

  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground md:p-7">
      {/* decorative dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-0 h-full w-1/2 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
          maskImage: "linear-gradient(to left, black, transparent)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <p className="text-sm font-medium text-primary-foreground/80">Saldo total</p>
        <button
          aria-label="Ocultar saldo"
          className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
        >
          <Eye className="size-4" />
        </button>
      </div>

      <p className="relative mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        {formatCurrency(summary.totalBalance, { decimals: true })}
      </p>

      <div className="relative mt-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-sm font-semibold">
          <ArrowUpRight className="size-4" />
          {pct.toFixed(1)}%
        </span>
        <span className="text-sm text-primary-foreground/80">
          {formatCurrency(diff)} más que el año pasado
        </span>
      </div>
    </section>
  )
}
