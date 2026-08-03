"use server";
import getAccountService from "@/features/account/service/getService";
import getCategoriesService from "@/features/categories/service/getCategories";
import getTransactionService from "@/features/transactions/service/getTransaction";
import prisma from "@/lib/prisma";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

export async function getDashboardMetrics(
  userId: string,
  date: Date = new Date(),
) {
  const accounts = await getAccountService();
  const categories = await getCategoriesService();
  const transactions = await getTransactionService();

  // 1. Fechas para el mes actual y el mes anterior
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  const prevMonthDate = subMonths(date, 1);
  const prevStartDate = startOfMonth(prevMonthDate);
  const prevEndDate = endOfMonth(prevMonthDate);

  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const recurringSummary = await getRecurringSummary(userId);

  // 1. Ejecutar consultas pesadas en paralelo (Promise.all) para máxima velocidad
  const [
    globalTransactions,
    currentMonthTransactions,
    prevMonthTransactions,
    currentMonthExpensesByCategory,
    budgets,
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
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),

    // C. Ingresos y Gastos totales (Mes Anterior - Para el porcentaje)
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { gte: prevStartDate, lte: prevEndDate },
      },
      _sum: { amount: true },
    }),

    // D. Gastos por categoría (Mes Actual - Solo para los presupuestos)
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),

    // E. Presupuestos asignados para el mes actual
    prisma.budget.findMany({
      where: { userId, month: currentMonth, year: currentYear },
      include: { category: true },
    }),
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
