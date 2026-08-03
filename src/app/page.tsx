"use client";
import { RecentTransactions } from "@/features/transactions/components/RecentTransactions";
import { MoneyEvolutionChart } from "@/features/salary/components/MoneyEvolutionChart";
import { CategoryChart } from "@/features/categories/components/CategoryChart";
import { Budgets } from "@/features/Budgets/components/BudgetsLineChart";
import { SalaryCard } from "@/features/salary/components/SalaryCard";
import { BalanceCard } from "@/features/user/component/BalanceCard";
import { Goals } from "@/features/goals/components/GoalsLineChart";
import { StatCards } from "@/components/statCards";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import getDashboard from "@/hooks/getDashboard";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 20,
  });
  // console.log(dashboard);
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 px-5 py-6 md:px-8">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* Columna principal */}
            <div className="flex flex-col gap-5 xl:col-span-2">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <BalanceCard
                  balance={dashboard?.totalBalance}
                  isLoadingDashboard={isLoadingDashboard}
                />
                <SalaryCard
                  isLoading={isLoadingDashboard}
                  recurringTransaction={dashboard?.recurringTransaction}
                />
              </div>

              <StatCards data={dashboard?.metrics} />
              <MoneyEvolutionChart history={dashboard?.historyMonthly} />

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <CategoryChart />
                <Budgets
                  budgets={dashboard?.budgetProgress || []}
                  isLoading={isLoadingDashboard}
                />
              </div>
            </div>

            {/* Columna lateral */}
            <div className="flex flex-col gap-5">
              <RecentTransactions
                data={dashboard?.transactions}
                isLoadingData={isLoadingDashboard}
              />
              <Goals />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
