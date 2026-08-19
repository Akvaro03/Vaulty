import { Skeleton } from "@/components/ui/skeleton";
import { budgetProgress } from "@/features/dashboard/type";
import { formatCurrency } from "@/lib/finance-data";
import { cn } from "@/lib/utils";
import { BudgetDialog } from "./BudgetDialog";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { AnimatePresence, motion } from "framer-motion";

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
        <BudgetDialog />
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
                    <span className={cn(over && "font-medium text-primary")}>
                      <AnimatedNumber value={b.spent} />
                    </span>{" "}
                    / {formatCurrency(b.limit)}
                  </span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      over ? "bg-primary" : "bg-foreground/70",
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {over && (
                    <motion.p
                      key="over-budget"
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                      className="mt-1.5 text-xs font-medium text-primary"
                    >
                      Has superado el límite en{" "}
                      <AnimatedNumber value={b.spent - b.limit} />
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
