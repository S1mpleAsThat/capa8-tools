// src/pages/LoginPage.jsx

import {
  useEffect,
  useState,
} from "react";

import logoSymbolPremium from "../assets/branding/logo-symbol-premium.png";
import capa8Logo from "../assets/branding/capa8_logo.png";

import glowCorner from "../assets/effects/glow-corner.png";
import particlesOverlay from "../assets/effects/particles-overlay.png";
import scanlines from "../assets/effects/scanlines.png";

import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";

const REGISTER_SUCCESS_STORAGE_KEY =
  "capa8-register-success";

const REGISTER_SUCCESS_MESSAGE =
  "Cuenta creada correctamente.\nRevisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.";

const EMAIL_NOT_CONFIRMED_MESSAGE =
  "Debes confirmar tu correo electrónico antes de iniciar sesión.";

const PASSWORDS_DO_NOT_MATCH_MESSAGE =
  "Las contraseñas no coinciden.";

export default function LoginPage() {
  const {
    loginGoogle,
    loginWithEmail,
    registerWithEmail,
    loading,
    authError,
  } = useAuth();

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const authText = t.auth || {
    loginTitle: "Iniciar sesión",
    registerTitle: "Crear cuenta",
    loginText: "Ingresa con Google o correo electrónico.",
    registerText: "Crea tu cuenta con correo y contraseña.",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    namePlaceholder: "Nombre completo",
    loginEmail: "Ingresar con correo",
    createAccount: "Crear cuenta",
    needAccount: "Crear una cuenta nueva",
    alreadyHaveAccount: "Ya tengo una cuenta",
    or: "o",
    loginError: "No se pudo iniciar sesión.",
    registerError: "No se pudo crear la cuenta.",
    accountCreated: REGISTER_SUCCESS_MESSAGE,
  };

  const [localError, setLocalError] =
    useState("");

  const [localStatus, setLocalStatus] =
    useState("");

  const [authMode, setAuthMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    pendingLanguage,
    setPendingLanguage,
  ] = useState(language);

  const [
    languageStatus,
    setLanguageStatus,
  ] = useState("");

  const isRegisterMode =
    authMode === "register";

  useEffect(() => {
    setPendingLanguage(language);
  }, [language]);

  useEffect(() => {
    try {
      const savedStatus = sessionStorage.getItem(
        REGISTER_SUCCESS_STORAGE_KEY,
      );

      if (savedStatus) {
        setLocalStatus(savedStatus);
        sessionStorage.removeItem(
          REGISTER_SUCCESS_STORAGE_KEY,
        );
      }
    } catch {
      // sessionStorage may be unavailable in restricted environments.
    }
  }, []);

  function clearMessages() {
    setLocalError("");
    setLocalStatus("");
  }

  function getAuthErrorMessage(error, fallbackMessage) {
    const message =
      error?.message ||
      fallbackMessage ||
      "No se pudo completar la autenticación.";

    if (
      message
        .toLowerCase()
        .includes("email not confirmed") ||
      message
        .toLowerCase()
        .includes("correo electrónico antes de iniciar sesión")
    ) {
      return EMAIL_NOT_CONFIRMED_MESSAGE;
    }

    return message;
  }

  function handleSaveLanguage() {
    setLanguage(pendingLanguage);
    setLanguageStatus(t.languageSaved);

    setTimeout(() => {
      setLanguageStatus("");
    }, 1800);
  }

  function handleToggleMode() {
    clearMessages();

    setAuthMode((currentMode) =>
      currentMode === "login"
        ? "register"
        : "login",
    );
  }

  function handleTogglePasswordVisibility() {
    setShowPassword((currentValue) => !currentValue);
  }

  async function handleGoogleLogin() {
    clearMessages();

    try {
      await loginGoogle();
    } catch (error) {
      setLocalError(
        getAuthErrorMessage(
          error,
          "No se pudo iniciar sesión con Google.",
        ),
      );
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();

    clearMessages();

    try {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          setLocalError(PASSWORDS_DO_NOT_MATCH_MESSAGE);
          return;
        }

        await registerWithEmail({
          name,
          email,
          password,
        });

        try {
          sessionStorage.setItem(
            REGISTER_SUCCESS_STORAGE_KEY,
            REGISTER_SUCCESS_MESSAGE,
          );
        } catch {
          // sessionStorage may be unavailable in restricted environments.
        }

        setName("");
        setPassword("");
        setConfirmPassword("");
        setAuthMode("login");
        setLocalError("");
        setLocalStatus(REGISTER_SUCCESS_MESSAGE);

        return;
      }

      await loginWithEmail({
        email,
        password,
      });
    } catch (error) {
      setLocalError(
        getAuthErrorMessage(
          error,
          isRegisterMode
            ? authText.registerError
            : authText.loginError,
        ),
      );
    }
  }

  const errorMessage =
    localError || authError;

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "34px 24px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        background:
          "radial-gradient(circle at center, rgba(0,255,170,.10), transparent 38%), linear-gradient(180deg, #020806 0%, #000000 100%)",
      }}
    >
      <img
        src={particlesOverlay}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.22,
          pointerEvents: "none",
        }}
      />

      <img
        src={scanlines}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.13,
          pointerEvents: "none",
        }}
      />

      <img
        src={glowCorner}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          top: "-90px",
          right: "-90px",
          width: "280px",
          opacity: 0.46,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <img
          src={logoSymbolPremium}
          alt="CAPA 8"
          decoding="async"
          style={{
            width: "184px",
            maxWidth: "62vw",
            height: "auto",
            objectFit: "contain",
            marginBottom: "26px",
            filter:
              "drop-shadow(0 0 34px rgba(24,255,173,.46)) drop-shadow(0 24px 62px rgba(0,0,0,.78))",
          }}
        />

        <div
          style={{
            width: "100%",
            display: "grid",
            gap: "12px",
            padding: "18px",
            borderRadius: "24px",
            border:
              "1px solid rgba(0,255,170,.13)",
            background:
              "linear-gradient(180deg, rgba(5,18,14,.84), rgba(0,0,0,.72))",
            boxShadow:
              "0 20px 60px rgba(0,0,0,.38), inset 0 0 24px rgba(0,255,170,.035)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "6px",
              marginBottom: "4px",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                lineHeight: 1.05,
                letterSpacing: "-.8px",
              }}
            >
              {isRegisterMode
                ? authText.registerTitle
                : authText.loginTitle}
            </h1>

            <p
              style={{
                color:
                  "rgba(255,255,255,.62)",
                fontSize: "13px",
                lineHeight: 1.45,
              }}
            >
              {isRegisterMode
                ? authText.registerText
                : authText.loginText}
            </p>
          </div>

          <button
            className="ghost-btn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "52px",
              padding: "0 22px",
              background:
                "linear-gradient(180deg, rgba(8,32,26,.82), rgba(0,0,0,.72))",
              border:
                "1px solid rgba(0,255,170,.24)",
              boxShadow:
                "0 18px 44px rgba(0,0,0,.42), inset 0 0 22px rgba(0,255,170,.045), 0 0 28px rgba(0,255,170,.09)",
              borderRadius: "18px",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {loading
              ? t.connecting
              : t.loginGoogle}
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color:
                "rgba(255,255,255,.38)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: ".8px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                flex: 1,
                height: "1px",
                background:
                  "rgba(255,255,255,.08)",
              }}
            />

            {authText.or}

            <span
              style={{
                flex: 1,
                height: "1px",
                background:
                  "rgba(255,255,255,.08)",
              }}
            />
          </div>

          <form
            onSubmit={handleEmailSubmit}
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
            {isRegisterMode ? (
              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder={
                  authText.namePlaceholder
                }
                autoComplete="name"
                style={{
                  minHeight: "46px",
                  width: "100%",
                  borderRadius: "16px",
                  border:
                    "1px solid rgba(0,255,170,.14)",
                  background:
                    "rgba(0,0,0,.42)",
                  color: "#ffffff",
                  padding: "0 14px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            ) : null}

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder={
                authText.emailPlaceholder
              }
              autoComplete="email"
              style={{
                minHeight: "46px",
                width: "100%",
                borderRadius: "16px",
                border:
                  "1px solid rgba(0,255,170,.14)",
                background:
                  "rgba(0,0,0,.42)",
                color: "#ffffff",
                padding: "0 14px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder={
                  authText.passwordPlaceholder
                }
                autoComplete={
                  isRegisterMode
                    ? "new-password"
                    : "current-password"
                }
                style={{
                  minHeight: "46px",
                  width: "100%",
                  borderRadius: "16px",
                  border:
                    "1px solid rgba(0,255,170,.14)",
                  background:
                    "rgba(0,0,0,.42)",
                  color: "#ffffff",
                  padding: "0 98px 0 14px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <button
                type="button"
                onClick={handleTogglePasswordVisibility}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#18ffad",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  padding: "6px 4px",
                }}
              >
                {showPassword
                  ? "👁 Ocultar"
                  : "👁 Mostrar"}
              </button>
            </div>

            {isRegisterMode ? (
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirmar contraseña"
                autoComplete="new-password"
                style={{
                  minHeight: "46px",
                  width: "100%",
                  borderRadius: "16px",
                  border:
                    "1px solid rgba(0,255,170,.14)",
                  background:
                    "rgba(0,0,0,.42)",
                  color: "#ffffff",
                  padding: "0 14px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            ) : null}

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                minHeight: "48px",
              }}
            >
              {loading
                ? t.connecting
                : isRegisterMode
                  ? authText.createAccount
                  : authText.loginEmail}
            </button>
          </form>

          {localStatus ? (
            <div
              style={{
                width: "100%",
                border:
                  "1px solid rgba(0,255,170,.18)",
                background:
                  "rgba(0,255,170,.08)",
                borderRadius: "16px",
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  color:
                    "rgba(220,255,240,.9)",
                  fontSize: "13px",
                  lineHeight: 1.45,
                  whiteSpace: "pre-line",
                }}
              >
                {localStatus}
              </p>
            </div>
          ) : null}

          <button
            className="ghost-btn"
            type="button"
            onClick={handleToggleMode}
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "44px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.018))",
              border:
                "1px solid rgba(255,255,255,.10)",
              color:
                "rgba(255,255,255,.76)",
              fontSize: "13px",
              fontWeight: 800,
            }}
          >
            {isRegisterMode
              ? authText.alreadyHaveAccount
              : authText.needAccount}
          </button>
        </div>

        {errorMessage ? (
          <div
            style={{
              marginTop: "16px",
              width: "100%",
              border:
                "1px solid rgba(255,120,120,.18)",
              background:
                "rgba(120,0,0,.12)",
              borderRadius: "16px",
              padding: "12px 14px",
            }}
          >
            <p
              style={{
                color:
                  "rgba(255,220,220,.88)",
                fontSize: "13px",
                lineHeight: 1.45,
              }}
            >
              {errorMessage}
            </p>
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            justifyItems: "center",
            gap: "10px",
            marginTop: "28px",
          }}
        >
          <p
            style={{
              color:
                "rgba(255,255,255,.38)",
              fontSize: "12px",
              letterSpacing: ".6px",
            }}
          >
            {t.poweredBy}
          </p>

          <img
            src={capa8Logo}
            alt="CAPA 8"
            loading="lazy"
            decoding="async"
            style={{
              width: "66px",
              maxWidth: "22vw",
              height: "auto",
              objectFit: "contain",
              opacity: 0.64,
            }}
          />

          <label
            style={{
              display: "grid",
              gap: "8px",
              marginTop: "14px",
              width: "180px",
            }}
          >
            <span
              style={{
                color:
                  "rgba(255,255,255,.46)",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: ".8px",
                textTransform: "uppercase",
              }}
            >
              {t.language}
            </span>

            <select
              value={pendingLanguage}
              onChange={(event) =>
                setPendingLanguage(
                  event.target.value,
                )
              }
              style={{
                minHeight: "40px",
                width: "100%",
                borderRadius: "14px",
                border:
                  "1px solid rgba(0,255,170,.14)",
                background:
                  "rgba(0,0,0,.42)",
                color: "#ffffff",
                padding: "0 12px",
                outline: "none",
              }}
            >
              <option value="es">
                {t.spanish}
              </option>

              <option value="en">
                {t.english}
              </option>
            </select>
          </label>

          <button
            className="ghost-btn"
            type="button"
            onClick={handleSaveLanguage}
            style={{
              width: "180px",
              minHeight: "40px",
              fontSize: "12px",
            }}
          >
            {t.saveLanguage}
          </button>

          {languageStatus ? (
            <p
              style={{
                color: "#18ffad",
                fontSize: "11px",
              }}
            >
              {languageStatus}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}