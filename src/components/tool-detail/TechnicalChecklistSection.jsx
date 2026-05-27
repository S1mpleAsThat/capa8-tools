// src/components/tool-detail/TechnicalChecklistSection.jsx

export default function TechnicalChecklistSection({
  checklistItems,
  newChecklistItem,
  setNewChecklistItem,
  handleToggleChecklistItem,
  handleAddChecklistItem,
  handleDeleteChecklistItem,
  handleResetChecklist,
}) {
  return (
    <div className="tool-workspace">
      <div className="tool-output">
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {checklistItems.map((item) => (
            <label
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <input
                type="checkbox"
                checked={item.completed}
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
          ))}
        </div>
      </div>

      <textarea
        className="tool-input"
        value={newChecklistItem}
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
        onClick={handleAddChecklistItem}
      >
        Agregar
      </button>

      <button
        className="ghost-btn tool-action-btn"
        type="button"
        onClick={handleResetChecklist}
      >
        Reiniciar checklist
      </button>
    </div>
  );
}