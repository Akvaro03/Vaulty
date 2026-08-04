"use server";
import getTransactionService from "@/features/transactions/service/getTransaction";
import getCategoriesService from "@/features/categories/service/getCategories";
import getAccountService from "@/features/account/service/getService";
import { APP_TIMEZONE, getLocalMonthBoundaries } from "@/lib/date-utils";
import { format, subMonths } from "date-fns";
import prisma from "@/lib/prisma";

export async function getDashboardMetrics(
  userId: string,
  date: Date = new Date(),
) {
  const accounts = await getAccountService();
  const categories = await getCategoriesService();
  const transactions = await getTransactionService();
  const {
    currentMonth,
    currentMonthEnd,
    currentMonthStart,
    currentYear,
    historyStartDate,
    prevMonthEnd,
    prevMonthStart,
  } = getLocalMonthBoundaries(date);
  // 1. Fechas para el mes actual y el mes anterior

  const recurringSummary = await getRecurringSummary(userId);
  // 1. Ejecutar consultas pesadas en paralelo (Promise.all) para máxima velocidad
  const [
    globalTransactions,
    currentMonthTransactions,
    prevMonthTransactions,
    currentMonthExpensesByCategory,
    budgets,
    monthlyHistoryRaw,
  ] = await Promise.all([
    // A. Saldo Total (Histórico completo)
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    }),

    // B. Ingresos y Gastos totales (Mes Actual)
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { amount: true },
    }),

    // C. Ingresos y Gastos totales (Mes Anterior - Para el porcentaje)
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { gte: prevMonthStart, lte: prevMonthEnd },
      },
      _sum: { amount: true },
    }),

    // D. Gastos por categoría (Mes Actual - Solo para los presupuestos)
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { amount: true },
    }),

    // E. Presupuestos asignados para el mes actual
    prisma.budget.findMany({
      where: { userId, month: currentMonth, year: currentYear },
      include: { category: true },
    }),
    // F. 🚀 NUEVO: Totales mensuales de Ingresos/Gastos de los últimos 3 años (36 meses)
    prisma.$queryRaw<{ month: Date; type: string; total: number }[]>`
      SELECT 
        DATE_TRUNC('month', "date" AT TIME ZONE 'UTC' AT TIME ZONE ${APP_TIMEZONE}) as month,
        "type",
        SUM("amount")::float as total
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND "date" >= ${historyStartDate}
      GROUP BY 1, 2
      ORDER BY 1 ASC
    `,
  ]);
  // --- 2. Procesamiento de Resultados ---
  // Cálculo del Saldo Total
  type TransactionGroupByResult = {
    type: string;
    _sum: { amount?: { toNumber: () => number } | null };
  };
  const getAmount = (arr: TransactionGroupByResult[], type: string) =>
    arr.find((t) => t.type === type)?._sum.amount?.toNumber() || 0;
  // Totales Globales (Para balance de la app)
  const totalIncome = getAmount(globalTransactions, "INCOME");
  const totalExpense = getAmount(globalTransactions, "EXPENSE");
  const totalBalance = totalIncome - totalExpense; // Cálculo de Ahorro del Mes
  // Totales Mes Actual
  const currentIncome = getAmount(currentMonthTransactions, "INCOME");
  const currentExpense = getAmount(currentMonthTransactions, "EXPENSE");
  const currentSavings = currentIncome - currentExpense;

  // Totales Mes Anterior
  const prevIncome = getAmount(prevMonthTransactions, "INCOME");
  const prevExpense = getAmount(prevMonthTransactions, "EXPENSE");
  const prevSavings = prevIncome - prevExpense;
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
  // Función para calcular porcentaje de cambio
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    // Usamos Math.abs en el denominador para manejar correctamente ahorros negativos previos
    return Number(
      (((current - previous) / Math.abs(previous)) * 100).toFixed(1),
    );
  };

  // (Asumiendo que hiciste una query extra similar para los ingresos del mes, o lo filtras del monthlyTransactions si quitas el type: 'EXPENSE')
  // Para mantener el ejemplo simple, supongamos que lo obtuvimos:
  const monthlyIncome = totalIncome | 0;
  const monthlyExpense = currentMonthTransactions.reduce(
    (acc, curr) => acc + (curr._sum.amount?.toNumber() || 0),
    0,
  );
  const monthlySavings = monthlyIncome - monthlyExpense;
  const monthlyMap = new Map<string, { income: number; expense: number }>();

  monthlyHistoryRaw.forEach((row) => {
    const monthKey = format(new Date(row.month), "yyyy-MM");
    const current = monthlyMap.get(monthKey) || { income: 0, expense: 0 };

    if (row.type === "INCOME") current.income += Number(row.total);
    if (row.type === "EXPENSE") current.expense += Number(row.total);

    monthlyMap.set(monthKey, current);
  });

  // --- B. Generar el array de los últimos 36 meses continuos ---
  // Para no dejar "huecos" en meses donde el usuario no tuvo transacciones
  const last36MonthsHistory = [];
  let runningBalance = totalBalance; // Partimos del saldo actual calculado en Step 3

  for (let i = 0; i < 36; i++) {
    const targetDate = subMonths(date, i);
    const monthKey = format(targetDate, "yyyy-MM");
    const monthLabel = format(targetDate, "MMM yyyy"); // Ej: "Ago 2026"

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

    // Calculamos el saldo acumulado del mes anterior restando el neto de este mes
    runningBalance -= netChange;
  }

  // --- C. Cortar los rangos requeridos para el Frontend ---
  const historyMonthly = {
    last6Months: last36MonthsHistory.slice(-6),
    lastYear: last36MonthsHistory.slice(-12),
    last3Years: last36MonthsHistory,
  };
  // Cálculo de Presupuestos Usados (Uniendo datos)
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
    historyMonthly,
    monthlySavings,
    totalBalance,
    totalIncome,
    totalExpense,
    recurringTransaction: recurringSummary,
    budgetProgress,
    transactions,
    categories,
    accounts,
  };
}

function calculateNextPayday(
  dayOfMonth: number,
  referenceDate = new Date(),
): Date {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth(); // 0 a 11
  const today = referenceDate.getDate();

  let targetYear = year;
  let targetMonth = month;

  // Si hoy es posterior al día programado, el próximo pago es el mes que viene
  if (today > dayOfMonth) {
    targetMonth += 1;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
  }

  // Manejo de días inválidos (ej: día 31 en febrero o abril)
  const lastDayOfTargetMonth = new Date(
    targetYear,
    targetMonth + 1,
    0,
  ).getDate();
  const validDay = Math.min(dayOfMonth, lastDayOfTargetMonth);

  return new Date(targetYear, targetMonth, validDay);
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
    const nextPayday = calculateNextPayday(item.dayOfMonth);

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
