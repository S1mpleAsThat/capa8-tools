// src/context/AuthContext.jsx

import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginGoogle,
  loginDemo,
  logout,
  restoreSession,
} from "../services/auth/authService";

export const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authError, setAuthError] =
    useState("");

  useEffect(() => {
    try {
      const restoredSession =
        restoreSession();

      if (
        restoredSession?.user
      ) {
        setSession(
          restoredSession,
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleLoginGoogle() {
    setLoading(true);
    setAuthError("");

    try {
      const newSession =
        await loginGoogle();

      setSession(
        newSession,
      );

      return newSession;
    } catch (error) {
      const message =
        error?.message ||
        "No se pudo iniciar sesión con Google.";

      setAuthError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginDemo() {
    setLoading(true);
    setAuthError("");

    try {
      const newSession =
        await loginDemo();

      setSession(
        newSession,
      );

      return newSession;
    } catch (error) {
      const message =
        error?.message ||
        "No se pudo iniciar sesión demo.";

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

      user:
        session?.user ||
        null,

      loading,

      authError,

      isAuthenticated:
        !!session?.user,

      loginGoogle:
        handleLoginGoogle,

      loginDemo:
        handleLoginDemo,

      logout:
        handleLogout,
    }),
    [
      session,
      loading,
      authError,
    ],
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}