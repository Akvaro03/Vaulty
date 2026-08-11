import { startOfMonth, endOfMonth, subMonths, subYears } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

// Si luego expandes tu app, este valor podría venir del perfil del User en la DB
export const APP_TIMEZONE = "America/Argentina/Buenos_Aires";

export function getLocalMonthBoundaries(
  baseDate: Date = new Date(),
  timezone: string = APP_TIMEZONE,
) {
  // 1. Llevamos la fecha UTC del servidor a la hora real del usuario
  const localDateString = formatInTimeZone(
    baseDate,
    timezone,
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
  );
  const localDate = new Date(localDateString);

  // 2. Calculamos bordes y devolvemos las fechas en formato UTC para Prisma
  return {
    currentMonthStart: toDate(startOfMonth(localDate), { timeZone: timezone }),
    currentMonthEnd: toDate(endOfMonth(localDate), { timeZone: timezone }),
    currentMonth: localDate.getMonth() + 1,
    currentYear: localDate.getFullYear(),
    currentDate: localDate,
    // Mes Anterior
    prevMonthStart: toDate(startOfMonth(subMonths(localDate, 1)), {
      timeZone: timezone,
    }),
    prevMonthEnd: toDate(endOfMonth(subMonths(localDate, 1)), {
      timeZone: timezone,
    }),

    // Histórico (Ej: 3 años)
    historyStartDate: toDate(startOfMonth(subYears(localDate, 3)), {
      timeZone: timezone,
    }),
  };
}
