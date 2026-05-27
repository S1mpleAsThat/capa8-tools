// src/components/ToolsSection.jsx

import useLanguage from "../hooks/useLanguage";

import ToolCard from "./ToolCard";

export default function ToolsSection({ onSelectTool }) {
  const { t } = useLanguage();

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
      </div>
    </section>
  );
}