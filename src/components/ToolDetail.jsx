// src/components/ToolDetail.jsx

import { useEffect, useRef, useState } from "react";

import logoMain from "../assets/branding/logo-main.png";
import logoIcon from "../assets/branding/logo-icon.png";
import panelCard from "../assets/ui/panel-card.png";

import { generateAIContent } from "../services/aiService";

const generatorTypes = [
  "Prompt para ChatGPT",
  "Mensaje profesional",
  "Respuesta para WhatsApp",
  "Publicación redes sociales",
];

const quickTemplates = [
  {
    id: "support-restart",
    category: "Soporte técnico",
    title: "Reinicio de servicio",
    text:
      "Hola. Hemos realizado un reinicio controlado del servicio para estabilizar el sistema. Por favor vuelve a probar y confirma si el problema continúa.",
  },
  {
    id: "support-evidence",
    category: "Soporte técnico",
    title: "Solicitud de evidencia",
    text:
      "Necesitamos una captura de pantalla del error y una breve descripción de los pasos realizados antes de que ocurriera el problema.",
  },
  {
    id: "support-maintenance",
    category: "Soporte técnico",
    title: "Mantenimiento programado",
    text:
      "El sistema tendrá una ventana de mantenimiento programada durante las próximas horas. Algunos servicios podrían presentar lentitud temporal.",
  },
  {
    id: "customer-followup",
    category: "Atención cliente",
    title: "Seguimiento cliente",
    text:
      "Hola. Queríamos confirmar si la solución entregada resolvió correctamente tu solicitud. Quedamos atentos a cualquier duda adicional.",
  },
  {
    id: "customer-response",
    category: "Atención cliente",
    title: "Respuesta cordial",
    text:
      "Gracias por contactarnos. Revisaremos tu caso lo antes posible para entregarte una solución clara y rápida.",
  },
  {
    id: "customer-confirmation",
    category: "Atención cliente",
    title: "Confirmación recepción",
    text:
      "Tu solicitud fue recibida correctamente y ya está siendo revisada por nuestro equipo.",
  },
  {
    id: "sales-intro",
    category: "Ventas",
    title: "Presentación servicio",
    text:
      "Ofrecemos soluciones digitales rápidas y optimizadas para automatizar procesos y mejorar productividad.",
  },
  {
    id: "sales-offer",
    category: "Ventas",
    title: "Oferta limitada",
    text:
      "Tenemos disponibilidad limitada para nuevos proyectos este mes. Podemos coordinar una reunión rápida para revisar tu necesidad.",
  },
  {
    id: "sales-close",
    category: "Ventas",
    title: "Cierre comercial",
    text:
      "Quedamos atentos para avanzar con la implementación y comenzar el proyecto lo antes posible.",
  },
  {
    id: "social-productivity",
    category: "Redes sociales",
    title: "Post productividad",
    text:
      "🚀 Automatizar tareas simples puede ahorrar horas de trabajo cada semana. La eficiencia también es una ventaja competitiva.",
  },
  {
    id: "social-tech",
    category: "Redes sociales",
    title: "Post tecnología",
    text:
      "⚡ Herramientas digitales bien diseñadas permiten trabajar más rápido, con menos errores y mejor organización.",
  },
  {
    id: "social-motivation",
    category: "Redes sociales",
    title: "Post motivacional",
    text:
      "💡 Construir sistemas simples pero útiles es una de las mejores formas de crear productos escalables.",
  },
];

const defaultChecklistItems = [
  "Revisar conexión a internet",
  "Verificar energía y cables",
  "Reiniciar equipo o servicio",
  "Revisar mensajes de error",
  "Validar permisos de usuario",
  "Probar desde otro navegador o dispositivo",
  "Registrar diagnóstico final",
];

const aiHistoryStorageKey = "capa8-ai-history";

const checklistStorageKey =
  "capa8-technical-checklist";

const templateFavoritesStorageKey =
  "capa8-template-favorites";

const templateRecentsStorageKey =
  "capa8-template-recents";

const aiPrefillStorageKey =
  "capa8-ai-prefill";

function safeReadStorage(
  key,
  fallback = [],
) {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch {
    return null;
  }
}

function buildDefaultChecklist() {
  return defaultChecklistItems.map(
    (text, index) => ({
      id: `default-${index}`,
      text,
      completed: false,
      custom: false,
    }),
  );
}

export default function ToolDetail({
  tool,
  onBack,
}) {
  const [input, setInput] =
    useState("");

  const [type, setType] =
    useState(generatorTypes[0]);

  const [output, setOutput] =
    useState("");

  const [
    displayedOutput,
    setDisplayedOutput,
  ] = useState("");

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const [loadingDots, setLoadingDots] =
    useState(".");

  const [copyLabel, setCopyLabel] =
    useState("Copiar");

  const [history, setHistory] =
    useState(() =>
      safeReadStorage(
        aiHistoryStorageKey,
        [],
      ),
    );

  const [
    checklistItems,
    setChecklistItems,
  ] = useState(() => {
    const saved = safeReadStorage(
      checklistStorageKey,
      [],
    );

    return saved.length > 0
      ? saved
      : buildDefaultChecklist();
  });

  const [
    newChecklistItem,
    setNewChecklistItem,
  ] = useState("");

  const [
    templateSearch,
    setTemplateSearch,
  ] = useState("");

  const [
    favoriteTemplates,
    setFavoriteTemplates,
  ] = useState(() =>
    safeReadStorage(
      templateFavoritesStorageKey,
      [],
    ),
  );

  const [
    recentTemplates,
    setRecentTemplates,
  ] = useState(() =>
    safeReadStorage(
      templateRecentsStorageKey,
      [],
    ),
  );

  const textareaRef = useRef(null);

  const isAiGenerator =
    tool.id === "ai-generator";

  const isTechnicalChecklist =
    tool.id === "technical-checklist";

  const isQuickTemplates =
    tool.id === "quick-templates";

  const filteredTemplates =
    quickTemplates.filter((template) => {
      const search =
        templateSearch.toLowerCase();

      return (
        template.title
          .toLowerCase()
          .includes(search) ||
        template.category
          .toLowerCase()
          .includes(search) ||
        template.text
          .toLowerCase()
          .includes(search)
      );
    });

  useEffect(() => {
    safeWriteStorage(
      aiHistoryStorageKey,
      history.slice(0, 10),
    );
  }, [history]);

  useEffect(() => {
    safeWriteStorage(
      checklistStorageKey,
      checklistItems,
    );
  }, [checklistItems]);

  useEffect(() => {
    safeWriteStorage(
      templateFavoritesStorageKey,
      favoriteTemplates,
    );
  }, [favoriteTemplates]);

  useEffect(() => {
    safeWriteStorage(
      templateRecentsStorageKey,
      recentTemplates.slice(0, 5),
    );
  }, [recentTemplates]);

  useEffect(() => {
    if (!isAiGenerator) {
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    try {
      const savedPrefill =
        localStorage.getItem(
          aiPrefillStorageKey,
        );

      if (savedPrefill) {
        setInput(savedPrefill);

        localStorage.removeItem(
          aiPrefillStorageKey,
        );
      }
    } catch {
      return;
    }
  }, [isAiGenerator]);

  useEffect(() => {
    if (!isGenerating) {
      return undefined;
    }

    const dots = [".", "..", "..."];

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % dots.length;

      setLoadingDots(dots[index]);
    }, 300);

    return () =>
      clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    if (!output) {
      setDisplayedOutput("");

      return undefined;
    }

    setDisplayedOutput("");

    let index = 0;

    const interval = setInterval(() => {
      index += 1;

      setDisplayedOutput(
        output.slice(0, index),
      );

      if (index >= output.length) {
        clearInterval(interval);
      }
    }, 12);

    return () =>
      clearInterval(interval);
  }, [output]);

  async function handleGenerate() {
    if (
      isGenerating ||
      !input.trim()
    ) {
      return;
    }

    setIsGenerating(true);

    setOutput("");

    setDisplayedOutput("");

    setCopyLabel("Copiar");

    setTimeout(async () => {
      const generatedOutput =
        await generateAIContent({
          input,
          type,
        });

      setOutput(generatedOutput);

      setHistory(
        (currentHistory) =>
          [
            {
              id: `history-${Date.now()}`,
              type,
              input,
              output: generatedOutput,
              createdAt:
                new Date().toLocaleString(
                  "es-CL",
                ),
            },
            ...currentHistory,
          ].slice(0, 10),
      );

      setIsGenerating(false);
    }, 600);
  }
  async function handleCopy(
    text = output,
  ) {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        text,
      );

      setCopyLabel("Copiado");

      setTimeout(() => {
        setCopyLabel("Copiar");
      }, 2000);
    } catch {
      setCopyLabel("Error");

      setTimeout(() => {
        setCopyLabel("Copiar");
      }, 2000);
    }
  }

  function handleClearOutput() {
    setOutput("");
    setDisplayedOutput("");
  }

  function handleReuseHistory(item) {
    setInput(item.input);
    setType(item.type);
    setOutput(item.output);
  }

  function handleDeleteHistory(id) {
    setHistory((currentHistory) =>
      currentHistory.filter(
        (item) => item.id !== id,
      ),
    );
  }

  function handleToggleChecklistItem(
    id,
  ) {
    setChecklistItems(
      (currentItems) =>
        currentItems.map((item) =>
          item.id === id
            ? {
                ...item,
                completed:
                  !item.completed,
              }
            : item,
        ),
    );
  }

  function handleAddChecklistItem() {
    const cleanItem =
      newChecklistItem.trim();

    if (!cleanItem) {
      return;
    }

    setChecklistItems(
      (currentItems) => [
        ...currentItems,
        {
          id: `custom-${Date.now()}`,
          text: cleanItem,
          completed: false,
          custom: true,
        },
      ],
    );

    setNewChecklistItem("");
  }

  function handleDeleteChecklistItem(
    id,
  ) {
    setChecklistItems(
      (currentItems) =>
        currentItems.filter(
          (item) => item.id !== id,
        ),
    );
  }

  function handleResetChecklist() {
    setChecklistItems(
      buildDefaultChecklist(),
    );

    setNewChecklistItem("");
  }

  function handleTemplateRecent(
    template,
  ) {
    setRecentTemplates(
      (currentRecents) => {
        const filtered =
          currentRecents.filter(
            (item) =>
              item.id !==
              template.id,
          );

        return [
          template,
          ...filtered,
        ].slice(0, 5);
      },
    );
  }

  function handleTemplateFavorite(
    template,
  ) {
    const exists =
      favoriteTemplates.some(
        (item) =>
          item.id === template.id,
      );

    if (exists) {
      setFavoriteTemplates(
        (currentFavorites) =>
          currentFavorites.filter(
            (item) =>
              item.id !==
              template.id,
          ),
      );

      return;
    }

    setFavoriteTemplates(
      (currentFavorites) => [
        template,
        ...currentFavorites,
      ],
    );
  }

  async function handleTemplateCopy(
    template,
  ) {
    await handleCopy(template.text);

    handleTemplateRecent(template);
  }

  function handleUseTemplate(
    template,
  ) {
    try {
      localStorage.setItem(
        aiPrefillStorageKey,
        template.text,
      );
    } catch {
      return;
    }

    handleTemplateRecent(template);
  }

  function isTemplateFavorite(id) {
    return favoriteTemplates.some(
      (item) => item.id === id,
    );
  }

  function renderTemplateCard(
    template,
  ) {
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
              gridTemplateColumns:
                "1fr 1fr",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <button
              className="ghost-btn"
              type="button"
              onClick={() =>
                handleTemplateCopy(
                  template,
                )
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
                handleUseTemplate(
                  template,
                )
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
                gridColumn:
                  "1 / -1",
                border:
                  isTemplateFavorite(
                    template.id,
                  )
                    ? "1px solid rgba(24,255,173,.5)"
                    : undefined,
                color:
                  isTemplateFavorite(
                    template.id,
                  )
                    ? "#18ffad"
                    : undefined,
              }}
            >
              {isTemplateFavorite(
                template.id,
              )
                ? "Favorito activo"
                : "Agregar favorito"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="tools-section">
      <nav className="navbar">
        <img
          className="nav-icon"
          src={logoIcon}
          alt="CAPA 8"
        />

        <img
          className="nav-logo"
          src={logoMain}
          alt="CAPA 8 TOOLS"
        />
      </nav>

      <div className="hero-content">
        <p className="eyebrow">
          HERRAMIENTA
        </p>

        <h1>{tool.title}</h1>

        <p className="hero-text">
          {tool.description}
        </p>

        <div className="hero-actions">
          <button
            className="ghost-btn"
            type="button"
            onClick={onBack}
          >
            Volver
          </button>
        </div>
      </div>

      {isAiGenerator ? (
        <div className="tool-workspace">
          <textarea
            ref={textareaRef}
            className="tool-input"
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value,
              )
            }
            placeholder="Escribe aquí tu idea o contexto..."
            rows="6"
          />

          <div
            style={{
              marginTop: "-6px",
              color:
                "rgba(255,255,255,.42)",
              fontSize: "12px",
              paddingLeft: "4px",
            }}
          >
            {input.length} caracteres
          </div>

          <select
            className="tool-select"
            value={type}
            onChange={(event) =>
              setType(
                event.target.value,
              )
            }
          >
            {generatorTypes.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ),
            )}
          </select>

          <button
            className="primary-btn tool-action-btn"
            type="button"
            onClick={handleGenerate}
            disabled={
              isGenerating ||
              !input.trim()
            }
          >
            {isGenerating
              ? `Generando${loadingDots}`
              : "Generar"}
          </button>

          <div className="tool-output">
            <p>
              {displayedOutput ||
                "La IA generará una respuesta basada en tu contexto."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "12px",
            }}
          >
            <button
              className="ghost-btn tool-action-btn"
              type="button"
              onClick={() =>
                handleCopy(output)
              }
              disabled={!output}
            >
              {copyLabel}
            </button>

            <button
              className="ghost-btn tool-action-btn"
              type="button"
              onClick={
                handleClearOutput
              }
              disabled={!output}
            >
              Limpiar
            </button>
          </div>

          <div
            className="tools-grid"
            style={{ padding: 0 }}
          >
            {history.map((item) => (
              <article
                className="tool-card"
                key={item.id}
              >
                <img
                  className="card-bg"
                  src={panelCard}
                  alt=""
                />

                <div className="card-content">
                  <h3>{item.type}</h3>

                  <p>
                    {item.output.slice(
                      0,
                      120,
                    )}
                    ...
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr 1fr",
                      gap: "8px",
                      marginTop: "14px",
                    }}
                  >
                    <button
                      className="ghost-btn"
                      type="button"
                      onClick={() =>
                        handleCopy(
                          item.output,
                        )
                      }
                    >
                      Copiar
                    </button>

                    <button
                      className="ghost-btn"
                      type="button"
                      onClick={() =>
                        handleReuseHistory(
                          item,
                        )
                      }
                    >
                      Reutilizar
                    </button>

                    <button
                      className="ghost-btn"
                      type="button"
                      onClick={() =>
                        handleDeleteHistory(
                          item.id,
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : isTechnicalChecklist ? (
        <div className="tool-workspace">
          <div className="tool-output">
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {checklistItems.map(
                (item) => (
                  <label
                    key={item.id}
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        item.completed
                      }
                      onChange={() =>
                        handleToggleChecklistItem(
                          item.id,
                        )
                      }
                    />

                    <span
                      style={{
                        flex: 1,
                        textDecoration:
                          item.completed
                            ? "line-through"
                            : "none",
                      }}
                    >
                      {item.text}
                    </span>

                    {item.custom ? (
                      <button
                        className="ghost-btn"
                        type="button"
                        onClick={() =>
                          handleDeleteChecklistItem(
                            item.id,
                          )
                        }
                      >
                        Eliminar
                      </button>
                    ) : null}
                  </label>
                ),
              )}
            </div>
          </div>

          <textarea
            className="tool-input"
            value={
              newChecklistItem
            }
            onChange={(event) =>
              setNewChecklistItem(
                event.target.value,
              )
            }
            placeholder="Agregar nuevo paso técnico..."
            rows="3"
          />

          <button
            className="primary-btn tool-action-btn"
            type="button"
            onClick={
              handleAddChecklistItem
            }
          >
            Agregar
          </button>

          <button
            className="ghost-btn tool-action-btn"
            type="button"
            onClick={
              handleResetChecklist
            }
          >
            Reiniciar checklist
          </button>
        </div>
      ) : isQuickTemplates ? (
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

          {favoriteTemplates.length >
          0 ? (
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

                <h2>
                  Plantillas favoritas
                </h2>
              </div>

              {favoriteTemplates.map(
                (
                  template,
                ) =>
                  renderTemplateCard(
                    template,
                  ),
              )}
            </div>
          ) : null}

          {recentTemplates.length >
          0 ? (
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

                <h2>
                  Usadas recientemente
                </h2>
              </div>

              {recentTemplates.map(
                (
                  template,
                ) =>
                  renderTemplateCard(
                    template,
                  ),
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

              <h2>
                Biblioteca rápida
              </h2>
            </div>

            {filteredTemplates.map(
              (template) =>
                renderTemplateCard(
                  template,
                ),
            )}
          </div>
        </div>
      ) : (
        <div className="tool-output">
          <p>
            Herramienta en
            construcción.
          </p>
        </div>
      )}
    </section>
  );
}