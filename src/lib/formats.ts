export function formatShortDate(date: Date | string): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));

  return formatted;
}