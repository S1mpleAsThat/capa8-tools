// src/components/tool-detail/ToolHeader.jsx

export default function ToolHeader({
  tool,
  onBack,
}) {
  return (
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
  );
}