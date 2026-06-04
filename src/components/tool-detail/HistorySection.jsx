// src/components/tool-detail/HistorySection.jsx

import panelCard from "../../assets/ui/panel-card.png";

export default function HistorySection({
  history,
  handleCopy,
  handleReuseHistory,
  handleDeleteHistory,
  handleClearHistory,
}) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div
      className="tools-grid"
      style={{ padding: 0 }}
    >
      <div
        className="section-header"
        style={{
          padding: 0,
          marginBottom: 0,
        }}
      >
        <p>HISTORIAL</p>

        <h2>Generaciones recientes</h2>

        <button
          className="ghost-btn"
          type="button"
          onClick={handleClearHistory}
          style={{
            marginTop: "12px",
          }}
        >
          Limpiar historial
        </button>
      </div>

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

            <p
              style={{
                color: "rgba(255,255,255,.44)",
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              {item.createdAt}
            </p>

            <p>
              {item.output.slice(0, 120)}
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
                  handleCopy(item.output)
                }
              >
                Copiar
              </button>

              <button
                className="ghost-btn"
                type="button"
                onClick={() =>
                  handleReuseHistory(item)
                }
              >
                Reutilizar
              </button>

              <button
                className="ghost-btn"
                type="button"
                onClick={() =>
                  handleDeleteHistory(item.id)
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}