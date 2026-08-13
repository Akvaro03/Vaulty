"use server";
import getTransactionService from "@/features/transactions/service/getTransaction";
import getCategoriesService from "@/features/categories/service/getCategories";
import getAccountService from "@/features/account/service/getService";
import { APP_TIMEZONE, getLocalMonthBoundaries } from "@/lib/date-utils";
import { format, subMonths } from "date-fns";
import prisma from "@/lib/prisma";
import { formatInTimeZone } from "date-fns-tz";
import getCurrentUser from "@/features/auth/service/getCurrentUser";
import invalidateSession from "@/features/auth/service/invalidateSession";
import { UnauthorizedError } from "@/features/auth/types/authType";
import { DayOfWeek, Frequency } from "@/generated/prisma/enums";
import getAllAccountsDb from "@/features/account/data/get";
import getAllCategoriesDb from "@/features/categories/data/get";
import getAllTransactionsDb from "@/features/transactions/data/get";

export async function getDashboardMetrics(date: Date = new Date()) {
  const totalStart = performance.now();
  let start = performance.now();

  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    if (
      auth.reason === "SESSION_EXPIRED" ||
      auth.reason === "SESSION_NOT_FOUND"
    ) {
      await invalidateSession();
    }
    throw new UnauthorizedError();
  }
  const userId = auth.session.userId;
  // console.log(`[Dashboard] Auth: ${(performance.now() - start).toFixed(2)}ms`);
  start = performance.now();

  const {
    currentMonth,
    currentMonthEnd,
    currentMonthStart,
    currentYear,
    prevMonthEnd,
    prevMonthStart,
  } = getLocalMonthBoundaries(date);
  // console.log(
  //   `[Dashboard] Local Time: ${(performance.now() - start).toFixed(2)}ms`,
  // );

  start = performance.now();
  // 🚀 TODO EN PARALELO: Únicamente consultas livianas e indexadas
  const [
    accounts,
    categories,
    recentTransactions,
    recurringSummary,
    globalTransactions,
    prevGlobalTransactions,
    currentMonthTransactions,
    prevMonthTransactions,
    currentMonthExpensesByCategory,
    budgets,
  ] = await Promise.all([
    getAllAccountsDb({ userId }),
    getAllCategoriesDb({ userId }),
    getAllTransactionsDb({ userId, limit: 10 }), // 💡 Recuerda agregar limit/take en este servicio
    getRecurringSummary(userId),

    // A. Saldo Total Histórico (acumulado hasta la fecha)
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    }),

    // B. Saldo acumulado al cierre del mes anterior
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { lte: prevMonthEnd },
      },
      _sum: { amount: true },
    }),

    // C. Ingresos y Gastos del Mes Actual
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { amount: true },
    }),

    // D. Ingresos y Gastos del Mes Anterior (para cálculo de % de variación)
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { gte: prevMonthStart, lte: prevMonthEnd },
      },
      _sum: { amount: true },
    }),

    // E. Gastos por categoría del mes actual (para los presupuestos)
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { amount: true },
    }),

    // F. Presupuestos del mes
    prisma.budget.findMany({
      where: { userId, month: currentMonth, year: currentYear },
      include: { category: true },
    }),
  ]);

  // console.log(
  //   `[Dashboard] Peticiones en paralelo: ${(performance.now() - start).toFixed(2)}ms`,
  // );

  // --- CÁLCULOS Y PROCESAMIENTO ---
  start = performance.now();
  // Totales Mes Actual
  const currentIncome = getAmount(currentMonthTransactions, "INCOME");
  const currentExpense = getAmount(currentMonthTransactions, "EXPENSE");
  const currentSavings = currentIncome - currentExpense;

  // Totales Mes Anterior
  const prevIncome = getAmount(prevMonthTransactions, "INCOME");
  const prevExpense = getAmount(prevMonthTransactions, "EXPENSE");
  const prevSavings = prevIncome - prevExpense;

  // Totales Globales
  const totalIncome = getAmount(globalTransactions, "INCOME");
  const totalExpense = getAmount(globalTransactions, "EXPENSE");
  const totalBalance = totalIncome - totalExpense;

  const totalPrevIncome = getAmount(prevGlobalTransactions, "INCOME");
  const totalPrevExpense = getAmount(prevGlobalTransactions, "EXPENSE");
  const totalPrevBalance = totalPrevIncome - totalPrevExpense;

  // Cálculo de Presupuestos
  let totalBudgetLimit = 0;
  let totalBudgetSpent = 0;
  const budgetProgress = budgets.map((budget) => {
    const spentInDB = currentMonthExpensesByCategory.find(
      (t) => t.categoryId === budget.categoryId,
    );
    const spentAmount = spentInDB?._sum.amount?.toNumber() || 0;
    const budgetLimit = budget.amount.toNumber();

    totalBudgetLimit += budgetLimit;
    totalBudgetSpent += spentAmount;

    return {
      categoryId: budget.categoryId,
      categoryName: budget.category.name,
      limit: budgetLimit,
      spent: spentAmount,
      percentage: budgetLimit > 0 ? (spentAmount / budgetLimit) * 100 : 0,
      isOverBudget: spentAmount > budgetLimit,
    };
  });

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(
      (((current - previous) / Math.abs(previous)) * 100).toFixed(1),
    );
  };

  // console.log(
  //   `[Dashboard] Total de cálculos: ${(performance.now() - start).toFixed(2)}ms`,
  // );
  // console.log(
  //   `[Dashboard] TOTAL: ${(performance.now() - totalStart).toFixed(2)}ms`,
  // );

  return {
    metrics: {
      income: {
        amount: currentIncome,
        percentageChange: calculateChange(currentIncome, prevIncome),
        periodLabel: "Este mes",
      },
      expense: {
        amount: currentExpense,
        percentageChange: calculateChange(currentExpense, prevExpense),
        periodLabel: "Este mes",
      },
      savings: {
        amount: currentSavings,
        percentageChange: calculateChange(currentSavings, prevSavings),
        periodLabel: "Este mes",
      },
      budget: {
        percentageUsed:
          totalBudgetLimit > 0
            ? Number(((totalBudgetSpent / totalBudgetLimit) * 100).toFixed(0))
            : 0,
        totalBudget: totalBudgetLimit,
        freeBudget: totalBudgetLimit - totalBudgetSpent,
        spentBudget: totalBudgetSpent,
      },
    },
    monthlySavings: currentSavings,
    totalPrevBalance,
    totalBalance,
    totalIncome,
    totalExpense,
    recurringTransaction: recurringSummary,
    budgetProgress,
    transactions: recentTransactions,
    categories,
    accounts,
  };
}
function calculateNextPayday(
  frequency: Frequency,
  day: number | string | null,
): Date {
  const { currentDate: referenceDate } = getLocalMonthBoundaries();

  const year = Number(formatInTimeZone(referenceDate, APP_TIMEZONE, "yyyy"));

  const month = Number(formatInTimeZone(referenceDate, APP_TIMEZONE, "MM")) - 1;

  const today = Number(formatInTimeZone(referenceDate, APP_TIMEZONE, "dd"));
  if (frequency === "DAILY") {
    return new Date(Date.UTC(year, month, today + 1, 3, 0, 0, 0));
  }
  if (frequency === "WEEKLY") {
    if (!day) {
      throw new Error("El día de la semana es requerido");
    }

    const targetDay = WEEK_DAYS[day as DayOfWeek];

    if (targetDay === undefined) {
      throw new Error(`Día de la semana inválido: ${day}`);
    }

    // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const currentDayOfWeek =
      Number(formatInTimeZone(referenceDate, APP_TIMEZONE, "i")) % 7;

    let daysUntilTarget = (targetDay - currentDayOfWeek + 7) % 7;
    if (daysUntilTarget === 0) {
      daysUntilTarget = 7;
    }

    return new Date(Date.UTC(year, month, today + daysUntilTarget, 3, 0, 0, 0));
  }

  if (frequency === "MONTHLY") {
    if (day === null) {
      throw new Error("El día del mes es requerido");
    }

    const targetDay = Number(day);

    if (!Number.isInteger(targetDay) || targetDay < 1 || targetDay > 31) {
      throw new Error(`Día del mes inválido: ${day}`);
    }

    let targetYear = year;
    let targetMonth = month;

    if (today >= targetDay) {
      targetMonth += 1;

      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }
    }

    const lastDayOfTargetMonth = new Date(
      Date.UTC(targetYear, targetMonth + 1, 0),
    ).getUTCDate();

    const validDay = Math.min(targetDay, lastDayOfTargetMonth);

    return new Date(Date.UTC(targetYear, targetMonth, validDay, 3, 0, 0, 0));
  }

  throw new Error(`Frecuencia inválida: ${frequency}`);
}
export async function getRecurringSummary(userId: string) {
  // 1. Obtener todas las transacciones recurrentes activas del usuario
  const recurringTransactions = await prisma.recurringTransaction.findMany({
    where: {
      userId,
      isActive: true,
    },
    include: {
      account: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, color: true } },
    },
    orderBy: {
      dayOfMonth: "asc",
    },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  let nextIncomePayday: Date | null = null;

  // 2. Mapear y calcular los totales
  const formattedTransactions = recurringTransactions.map((item) => {
    const amount = Number(item.expectedAmount); // Convertir Decimal a Number
    const nextPayday = calculateNextPayday(
      item.frequency,
      item.frequency === "WEEKLY" ? item.dayOfWeek : item.dayOfMonth,
    );
    if (item.type === "INCOME") {
      totalIncome += amount;

      // Guardar la fecha de cobro de sueldo/ingreso más cercana en el futuro
      if (!nextIncomePayday || nextPayday < nextIncomePayday) {
        nextIncomePayday = nextPayday;
      }
    } else if (item.type === "EXPENSE") {
      totalExpense += amount;
    }

    return {
      ...item,
      expectedAmount: amount,
      nextPayday,
    };
  });

  // 3. Sueldo neto = Total Ingresos - Total Gastos
  const sueldoNeto = totalIncome - totalExpense;

  return {
    summary: {
      sueldoNeto,
      totalIncome,
      totalExpense,
      nextPayday: nextIncomePayday, // Próxima fecha global en que ingresa dinero
    },
    transactions: formattedTransactions,
  };
}

const WEEK_DAYS: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const getDashboardHistory = async () => {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    if (
      auth.reason === "SESSION_EXPIRED" ||
      auth.reason === "SESSION_NOT_FOUND"
    ) {
      await invalidateSession();
    }
    throw new UnauthorizedError();
  }
  const userId = auth.session.userId;
  const date = new Date();
  const { currentDate, historyStartDate } = getLocalMonthBoundaries(date);
  const previousMonthDate = new Date(currentDate);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

  const [globalTransactions, monthlyHistoryRaw] = await Promise.all([
    // A. Saldo Total Histórico
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    }), // E. Totales mensuales (Sirve para gráfico histórico Y para extraer datos de mes actual/anterior)
    prisma.$queryRaw<{ monthKey: string; type: string; total: number }[]>`
      SELECT 
        TO_CHAR(
          DATE_TRUNC('month', "date" AT TIME ZONE 'UTC' AT TIME ZONE ${APP_TIMEZONE}), 
          'YYYY-MM'
        ) as "monthKey",
        "type",
        SUM("amount")::float as total
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND "date" >= ${historyStartDate}
      GROUP BY 1, 2
      ORDER BY 1 ASC
    `,
  ]);
  const monthlyMap = new Map<string, { income: number; expense: number }>();
  monthlyHistoryRaw.forEach((row) => {
    const monthKey = row.monthKey;
    const current = monthlyMap.get(monthKey) || { income: 0, expense: 0 };

    if (row.type === "INCOME") current.income += Number(row.total);
    if (row.type === "EXPENSE") current.expense += Number(row.total);

    monthlyMap.set(monthKey, current);
  });
  const totalIncome = getAmount(globalTransactions, "INCOME");
  const totalExpense = getAmount(globalTransactions, "EXPENSE");
  const totalBalance = totalIncome - totalExpense;

  const last36MonthsHistory = [];
  let runningBalance = totalBalance;

  for (let i = 0; i < 36; i++) {
    const targetDate = subMonths(currentDate, i);
    const monthKey = format(targetDate, "yyyy-MM");
    const monthLabel = format(targetDate, "MMM yyyy");

    const monthData = monthlyMap.get(monthKey) || { income: 0, expense: 0 };
    const netChange = monthData.income - monthData.expense;

    last36MonthsHistory.unshift({
      monthKey,
      label: monthLabel,
      income: monthData.income,
      expense: monthData.expense,
      netChange,
      accumulatedBalance: Number(runningBalance.toFixed(2)),
    });

    runningBalance -= netChange;
  }
  return {
    historyMonthly: {
      last6Months: last36MonthsHistory.slice(-6),
      lastYear: last36MonthsHistory.slice(-12),
      last3Years: last36MonthsHistory,
    },
  };
};

const getAmount = (arr: TransactionGroupByResult[], type: string) =>
  arr.find((t) => t.type === type)?._sum.amount?.toNumber() || 0;
type TransactionGroupByResult = {
  type: string;
  _sum: { amount?: { toNumber: () => number } | null };
};
