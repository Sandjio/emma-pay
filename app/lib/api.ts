const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type AuthResponse = { user: ApiUser; token: string };

export type ApiCard = {
  id: string;
  type: "VIRTUAL" | "PHYSICAL";
  currency: string;
  balance: string;
  lastFour: string;
  variant: "BLUE" | "PURPLE" | "GREEN" | "OBSIDIAN";
  createdAt: string;
};

export type ApiCardDetail = ApiCard & {
  fullNumber: string;
  expiry: string;
  cvv: string;
};

export type ApiTransactionBank = {
  institutionName: string;
  lastFour: string;
  logoColor: string;
  logoLetter: string;
};

export type ApiTransaction = {
  id: string;
  type: "SEND" | "RECEIVE" | "TOPUP" | "WITHDRAW";
  amount: string;
  currency: string;
  counterpartyName: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  bankAccount: ApiTransactionBank | null;
};

export type ApiContact = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  accentColor: string;
};

export type ApiBankAccount = {
  id: string;
  institutionId: string;
  institutionName: string;
  logoColor: string;
  logoLetter: string;
  accountType: "CHECKING" | "SAVINGS";
  lastFour: string;
  isPrimary: boolean;
  createdAt: string;
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
};

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, token, signal } = opts;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Could not reach the server. Check your connection and try again.",
      err,
    );
  }

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const error =
      data && typeof data === "object" && "error" in data
        ? (data as { error: { code?: string; message?: string; details?: unknown } }).error
        : undefined;
    throw new ApiError(
      res.status,
      error?.code ?? "REQUEST_FAILED",
      error?.message ?? `Request failed with status ${res.status}`,
      error?.details,
    );
  }

  return data as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const auth = {
  signup: (input: { name: string; email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/signup", { method: "POST", body: input }),
  login: (input: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body: input }),
  me: (token: string) => apiFetch<{ user: ApiUser }>("/auth/me", { token }),
};

export const users = {
  me: (token: string) => apiFetch<{ user: ApiUser }>("/users/me", { token }),
};

export const cards = {
  list: (token: string) =>
    apiFetch<{ cards: ApiCard[] }>("/cards", { token }),
  get: (token: string, id: string) =>
    apiFetch<{ card: ApiCardDetail }>(`/cards/${id}`, { token }),
  create: (
    token: string,
    input: { type: "VIRTUAL" | "PHYSICAL"; variant?: ApiCard["variant"]; currency?: string },
  ) =>
    apiFetch<{ card: ApiCard }>("/cards", {
      method: "POST",
      body: input,
      token,
    }),
};

export const transactions = {
  list: (token: string, cursor?: string) =>
    apiFetch<{ transactions: ApiTransaction[]; nextCursor: string | null }>(
      `/transactions${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`,
      { token },
    ),
  send: (
    token: string,
    input: { amount: string; currency: string; counterpartyName: string; contactId?: string },
  ) =>
    apiFetch<{ transaction: ApiTransaction }>("/transactions/send", {
      method: "POST",
      body: input,
      token,
    }),
  topUp: (
    token: string,
    input: { amount: string; currency: string; cardId: string; bankAccountId?: string },
  ) =>
    apiFetch<{ transaction: ApiTransaction }>("/transactions/top-up", {
      method: "POST",
      body: input,
      token,
    }),
  withdraw: (
    token: string,
    input: { amount: string; currency: string; cardId: string; bankAccountId?: string },
  ) =>
    apiFetch<{ transaction: ApiTransaction }>("/transactions/withdraw", {
      method: "POST",
      body: input,
      token,
    }),
};

export const contacts = {
  list: (token: string) =>
    apiFetch<{ contacts: ApiContact[] }>("/contacts", { token }),
};

export const bankAccounts = {
  list: (token: string) =>
    apiFetch<{ bankAccounts: ApiBankAccount[] }>("/bank-accounts", { token }),
  create: (
    token: string,
    input: {
      institutionId: string;
      institutionName: string;
      logoColor: string;
      logoLetter: string;
      accountType?: "CHECKING" | "SAVINGS";
      isPrimary?: boolean;
    },
  ) =>
    apiFetch<{ bankAccount: ApiBankAccount }>("/bank-accounts", {
      method: "POST",
      body: input,
      token,
    }),
  remove: (token: string, id: string) =>
    apiFetch<void>(`/bank-accounts/${id}`, { method: "DELETE", token }),
};
