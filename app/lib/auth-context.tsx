import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, ApiUser, auth } from "./api";
import { clearToken, getToken, saveToken } from "./auth-storage";
import { queryClient } from "./queryClient";

type AuthStatus = "loading" | "authed" | "anon";

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  user: ApiUser | null;
  signIn: (token: string, user: ApiUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const stored = await getToken();
        if (!stored) {
          if (!cancelled) setStatus("anon");
          return;
        }
        try {
          const { user: fetched } = await auth.me(stored);
          if (cancelled) return;
          setToken(stored);
          setUser(fetched);
          setStatus("authed");
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            await clearToken();
          }
          if (!cancelled) setStatus("anon");
        }
      } catch {
        if (!cancelled) setStatus("anon");
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (nextToken: string, nextUser: ApiUser) => {
    await saveToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setStatus("authed");
  }, []);

  const signOut = useCallback(async () => {
    await clearToken();
    queryClient.clear();
    setToken(null);
    setUser(null);
    setStatus("anon");
  }, []);

  const value = useMemo(
    () => ({ status, token, user, signIn, signOut }),
    [status, token, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function useAuthToken(): string {
  const { token } = useAuth();
  if (!token) {
    throw new Error("useAuthToken called without an authenticated session");
  }
  return token;
}
