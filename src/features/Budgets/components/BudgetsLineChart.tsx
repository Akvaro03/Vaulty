import { Skeleton } from "@/components/ui/skeleton";
import { budgetProgress } from "@/features/dashboard/type";
import { formatCurrency } from "@/lib/finance-data";
import { cn } from "@/lib/utils";

export function Budgets({
  budgets,
  isLoading,
}: {
  budgets: budgetProgress[];
  isLoading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Presupuestos</h2>
        <button className="text-sm font-medium text-primary transition-opacity hover:opacity-80">
          Gestionar
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-4">
        {isLoading ? (
          <>
            <li>
              <Skeleton className="h-8 w-full bg-primary-foreground/20" />
            </li>
            <li>
              <Skeleton className="h-8 w-full bg-primary-foreground/20" />
            </li>
          </>
        ) : (
          budgets.map((b, key) => {
            const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100);
            const over = b.spent > b.limit;
            return (
              <li key={key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{b.categoryName}</span>
                  <span className="text-muted-foreground">
                    <span className={cn(over && "text-primary font-medium")}>
                      {formatCurrency(b.spent)}
                    </span>{" "}
                    / {formatCurrency(b.limit)}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      over ? "bg-primary" : "bg-foreground/70",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {over && (
                  <p className="mt-1.5 text-xs font-medium text-primary">
                    Has superado el límite en{" "}
                    {formatCurrency(b.spent - b.limit)}
                  </p>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
