// src/components/tool-detail/ToolHeader.jsx

import { useLanguageContext } from "../../context/LanguageContext";

export default function ToolHeader({
  tool,
  onBack,
}) {
  const { t } =
    useLanguageContext();

  return (
    <div className="hero-content">
      <p className="eyebrow">
        {t.toolEyebrow}
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
          {t.back}
        </button>
      </div>
    </div>
  );
}