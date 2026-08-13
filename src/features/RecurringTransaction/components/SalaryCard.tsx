import { salaryType } from "@/features/dashboard/type";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { RecurringTransactionDialog } from "@/features/transactions/components/RecurringTransactionDialog";
import { formatCurrency } from "@/lib/finance-data";

export function SalaryCard({
  recurringTransaction,
  isLoading = false,
}: {
  recurringTransaction?: salaryType;
  isLoading?: boolean;
}) {
  if (isLoading || !recurringTransaction) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <Skeleton className="mt-4 h-4 w-36" />
        <Skeleton className="mt-2 h-9 w-44" />

        <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-secondary/60 p-3">
          <CalendarClock
            className="size-[18px] text-primary/50"
            aria-hidden="true"
          />

          <div className="flex flex-1 items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const summary = recurringTransaction.summary;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Sueldo</h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {"Mensual"}
        </span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Neto mensual · {summary && formatCurrency(summary.totalIncome)}
      </p>

      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {formatCurrency(summary?.sueldoNeto)}
      </p>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-secondary/60 p-3 text-sm">
        <CalendarClock
          className="size-[18px] text-primary"
          aria-hidden="true"
        />

        <span className="text-muted-foreground">Próximo pago</span>

        <span className="ml-auto font-medium">
          {summary?.nextPayday ? formatDate(summary?.nextPayday) : ""}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
        {recurringTransaction?.transactions?.map((row, key) => {
          const negative = row.type === "EXPENSE";

          return (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.description}</span>

              <span
                className={cn(
                  "font-mono font-medium",
                  !negative ? " text-primary" : "text-muted-foreground",
                )}
              >
                {negative ? "-" : ""}
                {formatCurrency(Math.abs(row.expectedAmount))}
              </span>
            </li>
          );
        })}
        <li>
          <RecurringTransactionDialog />
        </li>
      </ul>
    </div>
  );
}

export function formatDate(dateString: Date | string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}