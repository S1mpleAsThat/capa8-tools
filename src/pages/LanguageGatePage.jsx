// src/pages/LanguageGatePage.jsx

import logoSymbolPremium from "../assets/branding/logo-symbol-premium.png";

import glowCorner from "../assets/effects/glow-corner.png";
import particlesOverlay from "../assets/effects/particles-overlay.png";
import scanlines from "../assets/effects/scanlines.png";

import useLanguage from "../hooks/useLanguage";

export default function LanguageGatePage({
  onFinish,
}) {
  const { setLanguage } = useLanguage();

  function handleSelectLanguage(language) {
    setLanguage(language);
    onFinish();
  }

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "34px 24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        background:
          "radial-gradient(circle at center, rgba(0,255,170,.12), transparent 36%), linear-gradient(180deg, #020806 0%, #000000 100%)",
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
          opacity: 0.24,
          pointerEvents: "none",
          zIndex: 1,
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
          zIndex: 2,
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
          opacity: 0.48,
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          maxWidth: "430px",
          display: "grid",
          justifyItems: "center",
          textAlign: "center",
        }}
      >
        <img
          src={logoSymbolPremium}
          alt="CAPA 8 TOOLS"
          decoding="async"
          style={{
            width: "220px",
            maxWidth: "72vw",
            height: "auto",
            objectFit: "contain",
            marginBottom: "34px",
            filter:
              "drop-shadow(0 0 34px rgba(24,255,173,.48)) drop-shadow(0 24px 62px rgba(0,0,0,.78))",
          }}
        />

        <div
          style={{
            width: "100%",
            padding: "22px 18px 20px",
            borderRadius: "26px",
            border: "1px solid rgba(0,255,170,.16)",
            background:
              "linear-gradient(180deg, rgba(8,32,26,.64), rgba(0,0,0,.72))",
            boxShadow:
              "0 24px 70px rgba(0,0,0,.52), inset 0 0 26px rgba(0,255,170,.045), 0 0 34px rgba(0,255,170,.08)",
            backdropFilter: "blur(18px)",
          }}
        >
          <p
            style={{
              color: "#18ffad",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            CAPA 8 TOOLS
          </p>

          <h1
            style={{
              fontSize: "29px",
              lineHeight: 1.05,
              letterSpacing: "-.9px",
              marginBottom: "8px",
            }}
          >
            Selecciona tu idioma
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,.62)",
              fontSize: "15px",
              lineHeight: 1.5,
              marginBottom: "22px",
            }}
          >
            Choose your language
          </p>

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
              onClick={() => handleSelectLanguage("es")}
              style={{
                width: "100%",
                minHeight: "56px",
                padding: "0 22px",
                borderRadius: "18px",
                border: "1px solid rgba(0,255,170,.24)",
                background:
                  "linear-gradient(180deg, rgba(8,32,26,.88), rgba(0,0,0,.76))",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 900,
                boxShadow:
                  "0 18px 44px rgba(0,0,0,.42), inset 0 0 22px rgba(0,255,170,.045), 0 0 28px rgba(0,255,170,.09)",
              }}
            >
              Español
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={() => handleSelectLanguage("en")}
              style={{
                width: "100%",
                minHeight: "56px",
                padding: "0 22px",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,.11)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.052), rgba(255,255,255,.018))",
                color: "rgba(255,255,255,.84)",
                fontSize: "16px",
                fontWeight: 900,
              }}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}