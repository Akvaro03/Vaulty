export const user = {
  name: "Martín",
  fullName: "Martín Herrera",
  initials: "MH",
}

export const formatCurrency = (value: number, opts?: { decimals?: boolean }) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(value)

export const summary = {
  totalBalance: 48250.75,
  lastYearBalance: 39120.4,
  income: 6420,
  expenses: 3180.5,
  savings: 1850,
  budgetTotal: 4200,
  budgetUsed: 3180.5,
}

// Evolución del dinero — saldo mensual este año vs el año pasado
export const moneyEvolution = [
  { month: "Ene", actual: 39800, anterior: 32100 },
  { month: "Feb", actual: 40950, anterior: 33400 },
  { month: "Mar", actual: 41200, anterior: 34050 },
  { month: "Abr", actual: 42800, anterior: 34900 },
  { month: "May", actual: 43650, anterior: 35600 },
  { month: "Jun", actual: 44100, anterior: 36200 },
  { month: "Jul", actual: 45300, anterior: 36850 },
  { month: "Ago", actual: 45980, anterior: 37400 },
  { month: "Sep", actual: 46750, anterior: 37900 },
  { month: "Oct", actual: 47300, anterior: 38350 },
  { month: "Nov", actual: 47900, anterior: 38700 },
  { month: "Dic", actual: 48250, anterior: 39120 },
]

// Gastos por categoría
export const spendingByCategory = [
  { category: "Vivienda", value: 1250, key: "vivienda" },
  { category: "Alimentación", value: 640, key: "alimentacion" },
  { category: "Transporte", value: 380, key: "transporte" },
  { category: "Ocio", value: 460, key: "ocio" },
  { category: "Salud", value: 290, key: "salud" },
  { category: "Otros", value: 160.5, key: "otros" },
]

export type Transaction = {
  id: string
  name: string
  category: string
  date: string
  amount: number
  type: "ingreso" | "gasto"
}

export const recentTransactions: Transaction[] = [
  { id: "1", name: "Nómina — Ferrán Studio", category: "Salario", date: "28 Jul", amount: 3200, type: "ingreso" },
  { id: "2", name: "Alquiler apartamento", category: "Vivienda", date: "27 Jul", amount: -1250, type: "gasto" },
  { id: "3", name: "Mercadona", category: "Alimentación", date: "26 Jul", amount: -86.42, type: "gasto" },
  { id: "4", name: "Spotify Premium", category: "Ocio", date: "25 Jul", amount: -10.99, type: "gasto" },
  { id: "5", name: "Freelance — diseño web", category: "Extra", date: "24 Jul", amount: 620, type: "ingreso" },
  { id: "6", name: "Gasolinera Repsol", category: "Transporte", date: "23 Jul", amount: -62.3, type: "gasto" },
  { id: "7", name: "Farmacia Central", category: "Salud", date: "22 Jul", amount: -34.5, type: "gasto" },
]

export type Budget = {
  category: string
  spent: number
  limit: number
  key: string
}

export const budgets: Budget[] = [
  { category: "Vivienda", spent: 1250, limit: 1300, key: "vivienda" },
  { category: "Alimentación", spent: 640, limit: 700, key: "alimentacion" },
  { category: "Transporte", spent: 380, limit: 350, key: "transporte" },
  { category: "Ocio", spent: 460, limit: 500, key: "ocio" },
]

export type Goal = {
  name: string
  saved: number
  target: number
  deadline: string
}

export const goals: Goal[] = [
  { name: "Fondo de emergencia", saved: 8400, target: 12000, deadline: "Dic 2026" },
  { name: "Viaje a Japón", saved: 2650, target: 5000, deadline: "May 2027" },
  { name: "Coche nuevo", saved: 6100, target: 18000, deadline: "Ene 2028" },
]

export const salary = {
  net: 3200,
  gross: 4100,
  nextPayday: "28 de agosto",
  frequency: "Mensual",
  employer: "Ferrán Studio",
  breakdown: [
    { label: "Salario bruto", value: 4100 },
    { label: "IRPF", value: -640 },
    { label: "Seguridad Social", value: -260 },
  ],
}
