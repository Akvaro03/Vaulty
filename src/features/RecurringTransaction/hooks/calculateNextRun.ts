import {
  DayOfWeek,
  Frequency,
  RecurringTransaction,
} from "@/generated/prisma/client";
import { addDays, addMonths, addWeeks } from "date-fns";

export default function calculateNextRun(
  recurring: RecurringTransaction,
): Date {
  switch (recurring.frequency) {
    case "DAILY":
      return addDays(recurring.nextRunAt!, 1);

    case "WEEKLY":
      return addWeeks(recurring.nextRunAt!, 1);

    case "MONTHLY":
      return addMonths(recurring.nextRunAt!, 1);

    default:
      throw new Error(`Unsupported frequency: ${recurring.frequency}`);
  }
}

export function calculateNextRunStart(
  frequency: Frequency,
  dayOfWeek?: DayOfWeek | null | undefined,
  dayOfMonth?: number | null | undefined,
  from: Date = new Date(),
): Date {
  const next = new Date(from);

  switch (frequency) {
    case Frequency.DAILY: {
      next.setDate(next.getDate() + 1);
      return next;
    }

    case Frequency.WEEKLY: {
      // Convierte DayOfWeek (MONDAY=0..SUNDAY=6) al formato de Date.getDay() (SUNDAY=0..SATURDAY=6)
      if (!dayOfWeek) return next;
      const dayIndex = DAY_INDEX_MAP[dayOfWeek]; // Es un número válido
      const targetJsDay = (dayIndex + 1) % 7;

      // Se posiciona a partir del día siguiente
      next.setDate(next.getDate() + 1);

      const diff = (targetJsDay - next.getDay() + 7) % 7;
      next.setDate(next.getDate() + diff);
      return next;
    }

    case Frequency.MONTHLY: {
      const currentDay = next.getDate();
      if (!dayOfMonth) return next;

      if (currentDay <= dayOfMonth) {
        // La fecha objetivo aún no ocurre en el mes actual
        const maxDaysThisMonth = new Date(
          next.getFullYear(),
          next.getMonth() + 1,
          0,
        ).getDate();
        next.setDate(Math.min(dayOfMonth, maxDaysThisMonth));
      } else {
        // La fecha ocurre en el próximo mes
        next.setMonth(next.getMonth() + 1, 1); // Se establece temporalmente el día 1 para evitar desbordamientos de mes
        const maxDaysNextMonth = new Date(
          next.getFullYear(),
          next.getMonth() + 1,
          0,
        ).getDate();
        next.setDate(Math.min(dayOfMonth, maxDaysNextMonth));
      }
      return next;
    }

    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
}
const DAY_INDEX_MAP: Record<DayOfWeek, number> = {
  [DayOfWeek.MONDAY]: 0,
  [DayOfWeek.TUESDAY]: 1,
  [DayOfWeek.WEDNESDAY]: 2,
  [DayOfWeek.THURSDAY]: 3,
  [DayOfWeek.FRIDAY]: 4,
  [DayOfWeek.SATURDAY]: 5,
  [DayOfWeek.SUNDAY]: 6,
};
