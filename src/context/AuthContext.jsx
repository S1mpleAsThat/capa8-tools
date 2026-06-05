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
  loginWithEmail,
  registerWithEmail,
  logout,
  restoreSession,
  saveSession,
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
      const newSession =
        await loginGoogle();

      setSession(newSession);

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

      setSession(newSession);

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

  async function handleLoginWithEmail({
    email,
    password,
  }) {
    setLoading(true);
    setAuthError("");

    try {
      const result =
        await loginWithEmail({
          email,
          password,
        });

      const supabaseUser =
        result?.user ||
        result?.data?.user ||
        result?.session?.user ||
        result?.data?.session?.user ||
        null;

      const accessToken =
        result?.session?.access_token ||
        result?.data?.session?.access_token ||
        "";

      const newSession = {
        provider: "email",

        accessToken,

        user: {
          id:
            supabaseUser?.id ||
            email,

          name:
            supabaseUser?.user_metadata?.name ||
            supabaseUser?.email ||
            email,

          email:
            supabaseUser?.email ||
            email,

          picture:
            supabaseUser?.user_metadata?.avatar_url ||
            "",

          provider: "email",
        },

        createdAt:
          new Date().toISOString(),
      };

      saveSession(newSession);
      setSession(newSession);

      return newSession;
    } catch (error) {
      const message =
        error?.message ||
        "No se pudo iniciar sesión con correo.";

      setAuthError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterWithEmail({
    name,
    email,
    password,
  }) {
    setLoading(true);
    setAuthError("");

    try {
      const result =
        await registerWithEmail({
          name,
          email,
          password,
        });

      return result;
    } catch (error) {
      const message =
        error?.message ||
        "No se pudo crear la cuenta.";

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

      loginWithEmail:
        handleLoginWithEmail,

      registerWithEmail:
        handleRegisterWithEmail,

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