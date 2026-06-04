// src/components/ToolCard.jsx

import panelCard from "../assets/ui/panel-card.png";

export default function ToolCard({ title, description, onClick }) {
  return (
    <article
      className="tool-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <img className="card-bg" src={panelCard} alt="" />

      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}