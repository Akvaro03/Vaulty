import { TrendingUp, TrendingDown, PiggyBank, Gauge } from "lucide-react";
import { formatCurrency } from "@/lib/finance-data";
import { cn } from "@/lib/utils";
import { DashboardMetrics } from "@/features/dashboard/type";
import { Skeleton } from "./ui/skeleton";
import { AnimatedNumber } from "./AnimatedNumber";

type StatCardsProps = {
  data?: DashboardMetrics;
  isLoading?: boolean;
};

export function StatCards({ data, isLoading }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {isLoading || !data ? (
        <>
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </>
      ) : (
        <>
          <StatCard
            delta={String(data?.income.percentageChange || "")}
            icon={TrendingUp}
            label="Ingresos"
            positive
            sub="Este mes"
            value={<AnimatedNumber value={data.income.amount || 0} />}
          />
          <StatCard
            delta={String(data?.expense.percentageChange || "")}
            icon={TrendingDown}
            label="Gastos"
            positive
            sub="Este mes"
            value={<AnimatedNumber value={data.expense.amount || 0} />}
          />
          <StatCard
            delta={String(data?.savings.percentageChange || "")}
            icon={PiggyBank}
            label="Ahorro"
            positive
            sub="Este mes"
            value={<AnimatedNumber value={data.savings.amount || 0} />}
          />
          <StatCard
            delta={
              `${formatCurrency(data.budget.totalBudget - data.budget.spentBudget)} libres` ||
              ""
            }
            icon={Gauge}
            label="Presupuesto usado"
            positive
            sub={`de ${formatCurrency(data?.budget.totalBudget || 0)}`}
            value={
              data?.budget.spentBudget
                ? `${Math.round((data.budget.spentBudget / data.budget.totalBudget) * 100)}%`
                : "0%"
            }
          />
        </>
      )}
    </div>
  );
}

const StatCard = ({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  delta: string;
  positive: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  sub: string;
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            positive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {delta}
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
};
