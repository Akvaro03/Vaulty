import { Target } from "lucide-react"
import { goals, formatCurrency } from "@/lib/finance-data"

export function Goals() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Objetivos</h2>
        <button className="text-sm font-medium text-primary transition-opacity hover:opacity-80">
          Nuevo
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-4">
        {goals.map((g) => {
          const pct = Math.min(Math.round((g.saved / g.target) * 100), 100)
          return (
            <li key={g.name} className="rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Target className="size-[18px]" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{g.name}</p>
                  <p className="text-xs text-muted-foreground">Meta {g.deadline}</p>
                </div>
                <span className="text-sm font-semibold">{pct}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{formatCurrency(g.saved)}</span>
                <span>de {formatCurrency(g.target)}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
