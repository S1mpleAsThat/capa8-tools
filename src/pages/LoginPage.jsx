// src/pages/LoginPage.jsx

import { useEffect, useState } from "react";

import logoSymbolPremium from "../assets/branding/logo-symbol-premium.png";
import capa8Logo from "../assets/branding/capa8_logo.png";

import glowCorner from "../assets/effects/glow-corner.png";
import particlesOverlay from "../assets/effects/particles-overlay.png";
import scanlines from "../assets/effects/scanlines.png";

import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";

export default function LoginPage() {
  const {
    loginGoogle,
    loginEmail,
    registerEmail,
    loading,
    authError,
  } = useAuth();

  const { language, setLanguage, t } = useLanguage();

  const [authMode, setAuthMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [localError, setLocalError] = useState("");
  const [localStatus, setLocalStatus] = useState("");

  const [pendingLanguage, setPendingLanguage] = useState(language);
  const [languageStatus, setLanguageStatus] = useState("");

  const isRegisterMode = authMode === "register";

  useEffect(() => {
    setPendingLanguage(language);
  }, [language]);

  function handleSaveLanguage() {
    setLanguage(pendingLanguage);
    setLanguageStatus(t.languageSaved);

    setTimeout(() => {
      setLanguageStatus("");
    }, 1800);
  }

  function resetMessages() {
    setLocalError("");
    setLocalStatus("");
  }

  function toggleAuthMode() {
    resetMessages();
    setAuthMode((currentMode) =>
      currentMode === "login" ? "register" : "login",
    );
  }

  async function handleGoogleLogin() {
    resetMessages();

    try {
      await loginGoogle();
    } catch (error) {
      setLocalError(
        error?.message || t.auth.googleError,
      );
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    resetMessages();

    try {
      if (isRegisterMode) {
        const result = await registerEmail({
          name,
          email,
          password,
        });

        if (result?.pendingEmailConfirmation) {
          setLocalStatus(t.auth.confirmEmailMessage);
          return;
        }

        setLocalStatus(t.auth.accountCreated);
        return;
      }

      await loginEmail({
        email,
        password,
      });
    } catch (error) {
      setLocalError(
        error?.message ||
          (isRegisterMode
            ? t.auth.registerError
            : t.auth.loginError),
      );
    }
  }

  const errorMessage = localError || authError;

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "38px 24px 28px",
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
            width: "190px",
            maxWidth: "62vw",
            height: "auto",
            objectFit: "contain",
            marginBottom: "28px",
            filter:
              "drop-shadow(0 0 34px rgba(24,255,173,.46)) drop-shadow(0 24px 62px rgba(0,0,0,.78))",
          }}
        />

        <div
          style={{
            width: "100%",
            border: "1px solid rgba(0,255,170,.13)",
            borderRadius: "24px",
            padding: "18px",
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
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                color: "#18ffad",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "1.6px",
                textTransform: "uppercase",
              }}
            >
              {isRegisterMode
                ? t.auth.registerEyebrow
                : t.auth.loginEyebrow}
            </p>

            <h1
              style={{
                color: "#ffffff",
                fontSize: "24px",
                lineHeight: 1.05,
                letterSpacing: "-.8px",
              }}
            >
              {isRegisterMode
                ? t.auth.registerTitle
                : t.auth.loginTitle}
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,.62)",
                fontSize: "13px",
                lineHeight: 1.45,
              }}
            >
              {isRegisterMode
                ? t.auth.registerText
                : t.auth.loginText}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "12px",
              width: "100%",
            }}
          >
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
                border: "1px solid rgba(0,255,170,.24)",
                boxShadow:
                  "0 18px 44px rgba(0,0,0,.42), inset 0 0 22px rgba(0,255,170,.045), 0 0 28px rgba(0,255,170,.09)",
                borderRadius: "18px",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {loading ? t.connecting : t.loginGoogle}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "rgba(255,255,255,.38)",
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
                  background: "rgba(255,255,255,.08)",
                }}
              />

              {t.auth.or}

              <span
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,.08)",
                }}
              />
            </div>

            <form
              onSubmit={handleEmailSubmit}
              style={{
                display: "grid",
                gap: "10px",
                width: "100%",
              }}
            >
              {isRegisterMode ? (
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t.auth.namePlaceholder}
                  autoComplete="name"
                  style={{
                    minHeight: "48px",
                    width: "100%",
                    borderRadius: "16px",
                    border: "1px solid rgba(0,255,170,.14)",
                    background: "rgba(0,0,0,.42)",
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.auth.emailPlaceholder}
                autoComplete="email"
                style={{
                  minHeight: "48px",
                  width: "100%",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,255,170,.14)",
                  background: "rgba(0,0,0,.42)",
                  color: "#ffffff",
                  padding: "0 14px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                autoComplete={
                  isRegisterMode
                    ? "new-password"
                    : "current-password"
                }
                style={{
                  minHeight: "48px",
                  width: "100%",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,255,170,.14)",
                  background: "rgba(0,0,0,.42)",
                  color: "#ffffff",
                  padding: "0 14px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <button
                className="primary-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  minHeight: "50px",
                  marginTop: "2px",
                }}
              >
                {loading
                  ? t.connecting
                  : isRegisterMode
                    ? t.auth.createAccount
                    : t.auth.loginEmail}
              </button>
            </form>

            <button
              className="ghost-btn"
              type="button"
              onClick={toggleAuthMode}
              disabled={loading}
              style={{
                width: "100%",
                minHeight: "44px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.018))",
                border: "1px solid rgba(255,255,255,.10)",
                color: "rgba(255,255,255,.76)",
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              {isRegisterMode
                ? t.auth.alreadyHaveAccount
                : t.auth.needAccount}
            </button>
          </div>

          {errorMessage ? (
            <div
              style={{
                marginTop: "14px",
                width: "100%",
                border: "1px solid rgba(255,120,120,.18)",
                background: "rgba(120,0,0,.12)",
                borderRadius: "16px",
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  color: "rgba(255,220,220,.88)",
                  fontSize: "13px",
                  lineHeight: 1.45,
                }}
              >
                {errorMessage}
              </p>
            </div>
          ) : null}

          {localStatus ? (
            <div
              style={{
                marginTop: "14px",
                width: "100%",
                border: "1px solid rgba(0,255,170,.18)",
                background: "rgba(0,255,170,.08)",
                borderRadius: "16px",
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  color: "rgba(218,255,240,.9)",
                  fontSize: "13px",
                  lineHeight: 1.45,
                }}
              >
                {localStatus}
              </p>
            </div>
          ) : null}
        </div>

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
              color: "rgba(255,255,255,.38)",
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
                color: "rgba(255,255,255,.46)",
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
                setPendingLanguage(event.target.value)
              }
              style={{
                minHeight: "40px",
                width: "100%",
                borderRadius: "14px",
                border: "1px solid rgba(0,255,170,.14)",
                background: "rgba(0,0,0,.42)",
                color: "#ffffff",
                padding: "0 12px",
                outline: "none",
              }}
            >
              <option value="es">{t.spanish}</option>
              <option value="en">{t.english}</option>
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