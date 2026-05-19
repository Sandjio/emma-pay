import type { ApiTransaction } from "./api";

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function startOfWeek(d: Date): Date {
  // Monday-start ISO week
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setDate(d.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function weekdayIndex(d: Date): number {
  // Monday=0..Sunday=6
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

export type TransactionsSummary = {
  monthlyChange: string;
  weeklySpent: string;
  weekByDay: number[];
};

export function summarizeTransactions(
  txns: ApiTransaction[],
  now: Date = new Date(),
): TransactionsSummary {
  const monthStart = startOfMonth(now);
  const weekStart = startOfWeek(now);

  let monthly = 0;
  let weekly = 0;
  const weekByDay = [0, 0, 0, 0, 0, 0, 0];

  for (const t of txns) {
    const created = new Date(t.createdAt);
    const amount = Number(t.amount);
    if (!Number.isFinite(amount)) continue;
    const positive = t.type === "TOPUP" || t.type === "RECEIVE";
    const signed = positive ? amount : -amount;

    if (created >= monthStart) monthly += signed;

    if (created >= weekStart && !positive) {
      weekly += amount;
      weekByDay[weekdayIndex(created)] += amount;
    }
  }

  return {
    monthlyChange: monthly.toFixed(2),
    weeklySpent: weekly.toFixed(2),
    weekByDay,
  };
}

export function sumCardBalances(
  cards: { balance: string; currency: string }[],
  currency = "USD",
): number {
  return cards
    .filter((c) => c.currency === currency)
    .reduce((acc, c) => acc + Number(c.balance), 0);
}
