// src/pages/ProPage.jsx

import { useEffect } from "react";

import logoStacked from "../assets/capa8-pro/logo-stacked-pro.png";
import logoHorizontal from "../assets/capa8-pro/logo-horizontal-pro.png";

import useLanguage from "../hooks/useLanguage";

export default function ProPage() {
  const { language } = useLanguage();

  const isEnglish = language === "en";

  useEffect(() => {
    document.title = "CAPA 8 PRO";
  }, []);

  function goHome() {
    window.location.href = "/";
  }

  return (
    <section className="tools-section">
      <div
        style={{
          display: "grid",
          gap: "18px",
          padding: "0 10px",
        }}
      >
        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(255,215,120,.18)",
            background:
              "linear-gradient(180deg, rgba(18,18,18,.92), rgba(0,0,0,.86))",
            padding: "28px",
            textAlign: "center",
            boxShadow: "0 0 44px rgba(255,190,80,.08)",
          }}
        >
          <img
            src={logoStacked}
            alt="CAPA 8 PRO"
            style={{
              width: "220px",
              maxWidth: "100%",
              margin: "0 auto 20px",
            }}
          />

          <p
            style={{
              color: "#18ffad",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            PREMIUM EXPERIENCE
          </p>

          <h2
            style={{
              fontSize: "32px",
              marginBottom: "14px",
            }}
          >
            CAPA 8 PRO
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,.72)",
              lineHeight: 1.6,
            }}
          >
            {isEnglish
              ? "Unlock a premium workspace for advanced productivity, cleaner tools, extended usage and future automation features."
              : "Desbloquea un espacio premium para productividad avanzada, herramientas más limpias, uso extendido y futuras funciones de automatización."}
          </p
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          <div
            style={{
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,.08)",
              padding: "22px",
              background:
                "linear-gradient(180deg, rgba(10,18,16,.88), rgba(0,0,0,.78))",
            }}
          >
            <h3>FREE</h3>

            <ul
              style={{
                marginTop: "14px",
                paddingLeft: "18px",
                lineHeight: 1.9,
                color: "rgba(255,255,255,.72)",
              }}
            >
              <li>
                {isEnglish
                  ? "Local AI generator"
                  : "Generador IA local"}
              </li>
              <li>
                {isEnglish
                  ? "Technical checklist"
                  : "Checklist técnico"}
              </li>
              <li>
                {isEnglish
                  ? "Quick templates"
                  : "Plantillas rápidas"}
              </li>
              <li>
                {isEnglish
                  ? "Basic local history"
                  : "Historial local básico"}
              </li>
              <li>{isEnglish ? "Ads included" : "Con anuncios"}</li>
            </ul>
          </div>

          <div
            style={{
              borderRadius: "24px",
              border: "1px solid rgba(255,215,120,.20)",
              padding: "22px",
              background:
                "linear-gradient(180deg, rgba(30,22,8,.88), rgba(0,0,0,.82))",
              boxShadow: "0 0 36px rgba(255,190,80,.08)",
            }}
          >
            <h3>PRO</h3>

            <ul
              style={{
                marginTop: "14px",
                paddingLeft: "18px",
                lineHeight: 1.9,
                color: "rgba(255,255,255,.76)",
              }}
            >
              <li>{isEnglish ? "No ads" : "Sin anuncios"}</li>
              <li>
                {isEnglish
                  ? "Extended history"
                  : "Historial extendido"}
              </li>
              <li>
                {isEnglish
                  ? "Advanced templates"
                  : "Plantillas avanzadas"}
              </li>
              <li>
                {isEnglish
                  ? "Future PDF export"
                  : "Exportación PDF futura"}
              </li>
              <li>
                {isEnglish
                  ? "Future TXT export"
                  : "Exportación TXT futura"}
              </li>
              <li>
                {isEnglish
                  ? "Future premium tools"
                  : "Herramientas premium futuras"}
              </li>
              <li>
                {isEnglish
                  ? "Future priority support"
                  : "Soporte prioritario futuro"}
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(255,215,120,.16)",
            background:
              "linear-gradient(180deg, rgba(18,18,18,.88), rgba(0,0,0,.82))",
            padding: "22px",
            textAlign: "center",
          }}
        >
          <img
            src={logoHorizontal}
            alt="CAPA 8 PRO"
            style={{
              width: "260px",
              maxWidth: "100%",
              margin: "0 auto 18px",
            }}
          />

          <p
            style={{
              color: "rgba(255,255,255,.62)",
              fontSize: "14px",
              lineHeight: 1.6,
              marginBottom: "18px",
            }}
          >
            {isEnglish
              ? "Subscriptions are not active yet. CAPA 8 PRO is being prepared for the Android and AdMob monetization phase."
              : "Las suscripciones aún no están activas. CAPA 8 PRO está preparado para la fase Android y monetización con AdMob."}
          </p>

          <button
            className="primary-btn"
            type="button"
            style={{
              width: "100%",
              marginBottom: "12px",
            }}
          >
            {isEnglish
              ? "CAPA 8 PRO coming soon"
              : "CAPA 8 PRO próximamente"}
          </button>

          <button
            className="ghost-btn"
            type="button"
            onClick={goHome}
            style={{
              width: "100%",
            }}
          >
            {isEnglish ? "Back to home" : "Volver al inicio"}
          </button>
        </div>
      </div>
    </section>
  );
}