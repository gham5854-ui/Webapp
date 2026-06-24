import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "sender" | "recipient";
  joinedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

const API_BASE = "http://localhost:5000/api";

// ─── Context ─────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // starts loading to check token
    error: null,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("giftpin_token");
    if (!token) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          localStorage.removeItem("giftpin_token");
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkToken();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.error || "Authentication failed."
        }));
        return;
      }

      localStorage.setItem("giftpin_token", data.token);
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Cannot connect to the server."
      }));
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.error || "Failed to create account."
        }));
        return;
      }

      localStorage.setItem("giftpin_token", data.token);
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Cannot connect to the server."
      }));
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("giftpin_token");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
