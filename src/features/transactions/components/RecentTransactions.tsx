import {
  Home,
  ShoppingCart,
  Music,
  Car,
  HeartPulse,
  Briefcase,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/finance-data";
import { cn } from "@/lib/utils";
import { transactionType } from "../types/type";
import { formatShortDate } from "@/lib/formats";
import { Skeleton } from "@/components/ui/skeleton";

const iconFor: Record<string, typeof Home> = {
  Vivienda: Home,
  Alimentación: ShoppingCart,
  Ocio: Music,
  Transporte: Car,
  Salud: HeartPulse,
  Extra: Briefcase,
  Salario: Banknote,
};

interface PropsRecent {
  data?: transactionType[];
  isLoadingData?: boolean;
}

// Subcomponente reutilizable para las filas de carga
function TransactionsSkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 border-b border-border py-3 last:border-0"
        >
          {/* Avatar / Icono */}
          <Skeleton className="size-10 shrink-0 rounded-xl" />

          {/* Información principal (Título y Subtítulo) */}
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>

          {/* Monto */}
          <Skeleton className="h-4 w-16 shrink-0" />
        </li>
      ))}
    </>
  );
}

export function RecentTransactions({ data, isLoadingData }: PropsRecent) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Últimos movimientos</h2>
        <button className="text-sm font-medium text-primary transition-opacity hover:opacity-80">
          Ver todos
        </button>
      </div>

      <ul className="mt-4 flex flex-col">
        {isLoadingData ? (
          <TransactionsSkeletonList rows={4} />
        ) : (
          data?.map((t) => {
            const categoryName =
              typeof t.category === "object" ? t.category.name : t.category;
            const Icon = iconFor[categoryName] ?? Banknote;
            const isIncome = t.type === "INCOME";

            return (
              <li
                key={t.id}
                className="flex items-center gap-3 border-b border-border py-3 last:border-0"
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    isIncome
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {t.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {categoryName} · {formatShortDate(t.date)}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex items-center gap-0.5 font-mono text-sm font-semibold tabular-nums",
                    isIncome ? "text-primary" : "text-foreground",
                  )}
                >
                  {isIncome ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5 text-muted-foreground" />
                  )}
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount, { decimals: true })}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
