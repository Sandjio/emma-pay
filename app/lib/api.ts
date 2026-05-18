const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type AuthResponse = { user: ApiUser; token: string };

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
