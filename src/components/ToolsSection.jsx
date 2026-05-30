// src/components/ToolsSection.jsx

import useLanguage from "../hooks/useLanguage";

import ToolCard from "./ToolCard";

import logoStackedpro from "../assets/capa8-pro/logo-staked-pro.png";

export default function ToolsSection({ onSelectTool }) {
  const { t, language } = useLanguage();

  const isEnglish = language === "en";

  const tools = [
    {
      id: "ai-generator",
      title: t.tools.ai.title,
      description: t.tools.ai.description,
    },
    {
      id: "technical-checklist",
      title: t.tools.checklist.title,
      description: t.tools.checklist.description,
    },
    {
      id: "quick-templates",
      title: t.tools.templates.title,
      description: t.tools.templates.description,
    },
  ];

  function openPro() {
    window.location.href = "/pro";
  }

  function handleProKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPro();
    }
  }

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>{t.toolsEyebrow}</p>
        <h2>{t.toolsTitle}</h2>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            onClick={() => onSelectTool(tool)}
          />
        ))}

        <article
          className="tool-card"
          onClick={openPro}
          onKeyDown={handleProKeyDown}
          role="button"
          tabIndex={0}
          aria-label="CAPA 8 PRO"
        >
          <div
            className="card-content"
            style={{
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <img
              src={logoStackedpro}
              alt="CAPA 8 PRO"
              style={{
                width: "220px",
                maxWidth: "100%",
                marginBottom: "14px",
              }}
            />

            <h3>CAPA 8 PRO</h3>

            <p>
              {isEnglish
                ? "Unlock an ad-free experience, extended history and premium tools."
                : "Desbloquea una experiencia sin anuncios, historial extendido y herramientas premium."}
            </p>

            <p
              style={{
                marginTop: "12px",
                color: "#18ffad",
                fontWeight: 800,
              }}
            >
              {isEnglish ? "Coming soon" : "Próximamente"}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}