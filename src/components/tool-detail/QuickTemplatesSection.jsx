// src/components/tool-detail/QuickTemplatesSection.jsx

import useLanguage from "../../hooks/useLanguage";

function isValidTemplate(template) {
  return (
    template &&
    typeof template === "object" &&
    typeof template.id === "string" &&
    typeof template.category === "string" &&
    typeof template.title === "string" &&
    typeof template.text === "string"
  );
}

export default function QuickTemplatesSection({
  templateSearch,
  setTemplateSearch,
  favoriteTemplates,
  recentTemplates,
  filteredTemplates,
  handleTemplateCopy,
  handleUseTemplate,
  handleTemplateFavorite,
  isTemplateFavorite,
  onBack,
}) {
  const { t, language } = useLanguage();

  const backHomeLabel =
    language === "en" ? "← Back to Home" : "← Volver al inicio";

  const safeFavorites = Array.isArray(favoriteTemplates)
    ? favoriteTemplates.filter(isValidTemplate)
    : [];

  const safeRecents = Array.isArray(recentTemplates)
    ? recentTemplates.filter(isValidTemplate)
    : [];

  const safeFilteredTemplates = Array.isArray(filteredTemplates)
    ? filteredTemplates.filter(isValidTemplate)
    : [];

  function renderTemplateCard(template) {
    if (!isValidTemplate(template)) {
      return null;
    }

    const favoriteActive = isTemplateFavorite(template.id);

    return (
      <article
        key={template.id}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          padding: "22px 24px",
          background:
            "linear-gradient(180deg, rgba(6,22,18,.86), rgba(0,0,0,.78))",
          border: "1px solid rgba(0,255,170,.14)",
          boxShadow:
            "0 18px 42px rgba(0,0,0,.36), inset 0 0 24px rgba(0,255,170,.035)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at top right, rgba(24,255,173,.08), transparent 34%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              color: "#18ffad",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            {template.category}
          </p>

          <h3
            style={{
              fontSize: "20px",
              lineHeight: 1.1,
              letterSpacing: "-0.6px",
              marginBottom: "10px",
            }}
          >
            {template.title}
          </h3>

          <p
            style={{
              color: "rgba(255,255,255,.72)",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {template.text}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <button
              className="ghost-btn"
              type="button"
              onClick={() => handleTemplateCopy(template)}
              style={{
                minHeight: "40px",
                fontSize: "12px",
              }}
            >
              {t.templates.copy}
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={() => handleUseTemplate(template)}
              style={{
                minHeight: "40px",
                fontSize: "12px",
              }}
            >
              {t.templates.useInAI}
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={() => handleTemplateFavorite(template)}
              style={{
                minHeight: "40px",
                fontSize: "12px",
                gridColumn: "1 / -1",
                border: favoriteActive
                  ? "1px solid rgba(24,255,173,.5)"
                  : undefined,
                color: favoriteActive ? "#18ffad" : undefined,
              }}
            >
              {favoriteActive
                ? t.templates.activeFavorite
                : t.templates.addFavorite}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="tool-workspace">
      <input
        className="tool-input"
        type="text"
        value={templateSearch}
        onChange={(event) => setTemplateSearch(event.target.value)}
        placeholder={t.templates.search}
        style={{
          minHeight: "56px",
        }}
      />

      {safeFavorites.length > 0 ? (
        <div
          className="tools-grid"
          style={{
            padding: 0,
          }}
        >
          <div
            className="section-header"
            style={{
              padding: 0,
              marginBottom: 0,
            }}
          >
            <p>{t.templates.favoritesEyebrow}</p>

            <h2>{t.templates.favoritesTitle}</h2>
          </div>

          {safeFavorites.map((template) => renderTemplateCard(template))}
        </div>
      ) : null}

      {safeRecents.length > 0 ? (
        <div
          className="tools-grid"
          style={{
            padding: 0,
            marginTop: "20px",
          }}
        >
          <div
            className="section-header"
            style={{
              padding: 0,
              marginBottom: 0,
            }}
          >
            <p>{t.templates.recentsEyebrow}</p>

            <h2>{t.templates.recentsTitle}</h2>
          </div>

          {safeRecents.map((template) => renderTemplateCard(template))}
        </div>
      ) : null}

      <div
        className="tools-grid"
        style={{
          padding: 0,
          marginTop: "20px",
        }}
      >
        <div
          className="section-header"
          style={{
            padding: 0,
            marginBottom: 0,
          }}
        >
          <p>{t.templates.libraryEyebrow}</p>

          <h2>{t.templates.libraryTitle}</h2>
        </div>

        {safeFilteredTemplates.map((template) =>
          renderTemplateCard(template),
        )}
      </div>

      <div
        style={{
          marginTop: "30px",
          paddingTop: "4px",
        }}
      >
        <button
          className="ghost-btn tool-action-btn"
          type="button"
          onClick={onBack}
          style={{
            width: "100%",
            minHeight: "52px",
            borderRadius: "18px",
            border: "1px solid rgba(0,255,170,.18)",
            background:
              "linear-gradient(180deg, rgba(8,32,26,.74), rgba(0,0,0,.70))",
            boxShadow:
              "0 18px 42px rgba(0,0,0,.38), inset 0 0 22px rgba(0,255,170,.04), 0 0 24px rgba(0,255,170,.06)",
          }}
        >
          {backHomeLabel}
        </button>
      </div>
    </div>
  );
}