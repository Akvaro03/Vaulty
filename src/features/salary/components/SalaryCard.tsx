import { CalendarClock } from "lucide-react";
import { salary, formatCurrency } from "@/lib/finance-data";
import { cn } from "@/lib/utils";

export function SalaryCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Sueldo</h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {salary.frequency}
        </span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Neto mensual · {salary.employer}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {formatCurrency(salary.net)}
      </p>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-secondary/60 p-3 text-sm">
        <CalendarClock
          className="size-[18px] text-primary"
          aria-hidden="true"
        />
        <span className="text-muted-foreground">Próximo pago</span>
        <span className="ml-auto font-medium">{salary.nextPayday}</span>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
        {salary.breakdown.map((row) => {
          const negative = row.value < 0;
          return (
            <li
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span
                className={cn(
                  "font-mono font-medium",
                  negative && "text-muted-foreground",
                )}
              >
                {negative ? "-" : ""}
                {formatCurrency(Math.abs(row.value))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
