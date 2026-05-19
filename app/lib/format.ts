import type { ApiTransaction } from "./api";

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function handleFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const slug = local.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `@${slug || "user"}`;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function formatCurrency(amount: string | number, currency = "USD"): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const sign = value < 0 ? "-" : "";
    return `${sign}$${Math.abs(value).toFixed(2)}`;
  }
}

export function formatCurrencyParts(
  amount: string | number,
  currency = "USD",
): { whole: string; fraction: string } {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const safe = Number.isFinite(value) ? value : 0;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
  const dot = formatted.lastIndexOf(".");
  if (dot === -1) return { whole: formatted, fraction: "" };
  return {
    whole: formatted.slice(0, dot),
    fraction: formatted.slice(dot),
  };
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function formatRelativeDay(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / dayMs,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const am = hours < 12;
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${am ? "AM" : "PM"}`;
}

export function transactionTitle(t: ApiTransaction): string {
  if (t.counterpartyName) return t.counterpartyName;
  switch (t.type) {
    case "TOPUP":
      return "Top up";
    case "WITHDRAW":
      return "Withdrawal";
    case "SEND":
      return "Sent";
    case "RECEIVE":
      return "Received";
    default:
      return "Transaction";
  }
}

export function transactionSubtitle(t: ApiTransaction, now?: Date): string {
  const day = formatRelativeDay(t.createdAt, now);
  switch (t.type) {
    case "TOPUP":
      return t.bankAccount ? `Top up · ${day}` : day;
    case "WITHDRAW":
      return t.bankAccount
        ? `Withdraw · **${t.bankAccount.lastFour} · ${day}`
        : `Withdraw · ${day}`;
    case "SEND":
      return `Sent · ${day}`;
    case "RECEIVE":
      return `Received · ${day}`;
    default:
      return day;
  }
}

export function signedAmount(t: ApiTransaction, currency = "USD"): string {
  const positive = t.type === "TOPUP" || t.type === "RECEIVE";
  const formatted = formatCurrency(Math.abs(Number(t.amount)), currency);
  return `${positive ? "+" : "-"}${formatted}`;
}

export function isPositive(t: ApiTransaction): boolean {
  return t.type === "TOPUP" || t.type === "RECEIVE";
}
