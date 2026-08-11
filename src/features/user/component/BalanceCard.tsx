import { ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/finance-data";
import { Skeleton } from "@/components/ui/skeleton";

export function BalanceCard({
  balance,
  prevBalance,
  isLoadingDashboard,
}: {
  balance: number | undefined;
  prevBalance: number | undefined;
  isLoadingDashboard: boolean;
}) {
  const diff = balance && prevBalance ? balance - prevBalance : 0;
  const pct = prevBalance ? (diff / prevBalance) * 100 : 0;
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
        <p className="text-sm font-medium text-primary-foreground/80">
          Saldo total
        </p>
        <button
          aria-label="Ocultar saldo"
          className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
        >
          <Eye className="size-4" />
        </button>
      </div>

      {balance !== undefined ? (
        <p className="relative mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          {formatCurrency(balance, { decimals: true })}
        </p>
      ) : (
        <Skeleton className="mt-3 h-10 w-32 bg-primary-foreground/20" />
      )}
      <div className="relative mt-5 flex flex-wrap items-center gap-3">
        {isLoadingDashboard && (
          <>
            <Skeleton className="h-8 w-20 rounded-full bg-primary-foreground/20" />
            <Skeleton className="h-5 w-48 bg-primary-foreground/20" />
          </>
        )}
        {pct !== 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-sm font-semibold">
            {pct > 0 ? (
              <>
                <ArrowUpRight className="size-4" />
                {pct.toFixed(1) + "%"}
              </>
            ) : (
              <>
                <ArrowDownRight className="size-4" />
                {Math.abs(pct).toFixed(1) + "%"}
              </>
            )}
          </span>
        )}
        {diff !== 0 && (
          <>
            {pct > 0 ? (
              <span className="text-sm text-primary-foreground/80">
                {formatCurrency(diff)} más que el año pasado
              </span>
            ) : (
              <span className="text-sm text-primary-foreground/80">
                {formatCurrency(diff)} menos que el año pasado
              </span>
            )}
          </>
        )}
      </div>
    </section>
  );
}
