// src/components/tool-detail/QuickTemplatesSection.jsx

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
}) {
  function renderTemplateCard(template) {
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
          border:
            "1px solid rgba(0,255,170,.14)",
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
              onClick={() =>
                handleTemplateCopy(template)
              }
              style={{
                minHeight: "40px",
                fontSize: "12px",
              }}
            >
              Copiar
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={() =>
                handleUseTemplate(template)
              }
              style={{
                minHeight: "40px",
                fontSize: "12px",
              }}
            >
              Usar en IA
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={() =>
                handleTemplateFavorite(
                  template,
                )
              }
              style={{
                minHeight: "40px",
                fontSize: "12px",
                gridColumn: "1 / -1",
                border: isTemplateFavorite(
                  template.id,
                )
                  ? "1px solid rgba(24,255,173,.5)"
                  : undefined,
                color: isTemplateFavorite(
                  template.id,
                )
                  ? "#18ffad"
                  : undefined,
              }}
            >
              {isTemplateFavorite(template.id)
                ? "Favorito activo"
                : "Agregar favorito"}
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
        onChange={(event) =>
          setTemplateSearch(
            event.target.value,
          )
        }
        placeholder="Buscar plantilla..."
        style={{
          minHeight: "56px",
        }}
      />

      {favoriteTemplates.length > 0 ? (
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
            <p>FAVORITOS</p>

            <h2>Plantillas favoritas</h2>
          </div>

          {favoriteTemplates.map((template) =>
            renderTemplateCard(template),
          )}
        </div>
      ) : null}

      {recentTemplates.length > 0 ? (
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
            <p>RECIENTES</p>

            <h2>Usadas recientemente</h2>
          </div>

          {recentTemplates.map((template) =>
            renderTemplateCard(template),
          )}
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
          <p>PLANTILLAS</p>

          <h2>Biblioteca rápida</h2>
        </div>

        {filteredTemplates.map((template) =>
          renderTemplateCard(template),
        )}
      </div>
    </div>
  );
}