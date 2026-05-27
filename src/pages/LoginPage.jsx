// src/pages/LoginPage.jsx

import { useState } from "react";

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
    loginDemo,
    loading,
    authError,
  } = useAuth();

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const [localError, setLocalError] = useState("");

  async function handleGoogleLogin() {
    setLocalError("");

    try {
      await loginGoogle();
    } catch (error) {
      setLocalError(
        error.message ||
          "No se pudo iniciar sesión con Google.",
      );
    }
  }

  async function handleDemoLogin() {
    setLocalError("");

    try {
      await loginDemo();
    } catch (error) {
      setLocalError(
        error.message ||
          "No se pudo iniciar sesión demo.",
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
            width: "218px",
            maxWidth: "70vw",
            height: "auto",
            objectFit: "contain",
            marginBottom: "44px",
            filter:
              "drop-shadow(0 0 34px rgba(24,255,173,.46)) drop-shadow(0 24px 62px rgba(0,0,0,.78))",
          }}
        />

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

          <button
            className="ghost-btn"
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "50px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.018))",
              border:
                "1px solid rgba(255,255,255,.10)",
              color: "rgba(255,255,255,.76)",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {t.loginDemo}
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
              padding:
                "12px 14px",
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
            marginTop: "38px",
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
              width: "72px",
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
              marginTop: "18px",
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
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
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
        </div>
      </div>
    </section>
  );
}