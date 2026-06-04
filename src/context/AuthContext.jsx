// src/context/AuthContext.jsx

import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginEmailPassword,
  loginGoogle,
  logout,
  registerEmailPassword,
  restoreSession,
} from "../services/auth/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    try {
      const restoredSession = restoreSession();

      if (restoredSession?.user) {
        setSession(restoredSession);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleLoginGoogle() {
    setLoading(true);
    setAuthError("");

    try {
      const newSession = await loginGoogle();
      setSession(newSession);
      return newSession;
    } catch (error) {
      const message =
        error?.message || "No se pudo iniciar sesión con Google.";

      setAuthError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginEmail(credentials) {
    setLoading(true);
    setAuthError("");

    try {
      const newSession = await loginEmailPassword(credentials);
      setSession(newSession);
      return newSession;
    } catch (error) {
      const message =
        error?.message || "No se pudo iniciar sesión.";

      setAuthError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterEmail(credentials) {
    setLoading(true);
    setAuthError("");

    try {
      const newSession = await registerEmailPassword(credentials);
      setSession(newSession);
      return newSession;
    } catch (error) {
      const message =
        error?.message || "No se pudo crear la cuenta.";

      setAuthError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);

    try {
      await logout();
      setSession(null);
      setAuthError("");
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      loading,
      authError,
      isAuthenticated: !!session?.user,
      loginGoogle: handleLoginGoogle,
      loginEmail: handleLoginEmail,
      registerEmail: handleRegisterEmail,
      logout: handleLogout,
    }),
    [session, loading, authError],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}