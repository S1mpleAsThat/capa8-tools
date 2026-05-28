// src/components/tool-detail/TechnicalChecklistSection.jsx

import useLanguage from "../../hooks/useLanguage";

export default function TechnicalChecklistSection({
  checklistItems,
  newChecklistItem,
  setNewChecklistItem,
  handleToggleChecklistItem,
  handleAddChecklistItem,
  handleDeleteChecklistItem,
  handleResetChecklist,
  onBack,
}) {
  const { t, language } = useLanguage();

  const backHomeLabel =
    language === "en" ? "← Back to Home" : "← Volver al inicio";

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
                  {t.checklist.delete}
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
        placeholder={t.checklist.placeholder}
        rows="3"
      />

      <button
        className="primary-btn tool-action-btn"
        type="button"
        onClick={handleAddChecklistItem}
      >
        {t.checklist.add}
      </button>

      <button
        className="ghost-btn tool-action-btn"
        type="button"
        onClick={handleResetChecklist}
      >
        {t.checklist.reset}
      </button>

      <div
        style={{
          marginTop: "28px",
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