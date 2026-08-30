export const MS_PER_DAY = 86_400_000;

export const parseIsoDate = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    ? date
    : null;
};

export const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

export const addDaysUtc = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * MS_PER_DAY);

export const addMonthsUtc = (date: Date, months: number): Date => {
  const day = date.getUTCDate();
  const monthStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(
    Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0),
  ).getUTCDate();

  return new Date(Date.UTC(
    monthStart.getUTCFullYear(),
    monthStart.getUTCMonth(),
    Math.min(day, lastDay),
  ));
};

export const daysBetweenUtc = (start: Date, end: Date): number =>
  Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);

export const minDate = (a: Date, b: Date): Date =>
  a.getTime() <= b.getTime() ? a : b;

export const isWeekday = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};
