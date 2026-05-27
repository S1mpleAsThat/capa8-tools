// src/components/ToolsSection.jsx

import ToolCard from "./ToolCard";

const tools = [
  {
    id: "ai-generator",
    title: "Generador IA",
    description:
      "Crea textos, prompts y respuestas rápidas para trabajo, estudio o soporte.",
  },
  {
    id: "technical-checklist",
    title: "Checklist técnico",
    description: "Organiza diagnósticos, pasos de revisión y tareas de soporte.",
  },
  {
    id: "quick-templates",
    title: "Plantillas rápidas",
    description: "Mensajes profesionales listos para copiar y adaptar.",
  },
];

export default function ToolsSection({ onSelectTool }) {
  return (
    <section className="tools-section">
      <div className="section-header">
        <p>UTILIDADES</p>
        <h2>Base inicial de la aplicación</h2>
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