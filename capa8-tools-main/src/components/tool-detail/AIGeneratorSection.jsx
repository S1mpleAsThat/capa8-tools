// src/components/tool-detail/AIGeneratorSection.jsx

import useLanguage from "../../hooks/useLanguage";

import HistorySection from "./HistorySection";
import BackupToolsSection from "./BackupToolsSection";

export default function AIGeneratorSection({
  input,
  setInput,
  type,
  setType,
  output,
  displayedOutput,
  isGenerating,
  loadingDots,
  copyLabel,
  history,
  generatorTypes,
  textareaRef,
  generatorFormRef,
  backupFileInputRef,
  backupStatus,
  handleGenerate,
  handleCopy,
  handleClearOutput,
  handleReuseHistory,
  handleDeleteHistory,
  handleClearHistory,
  handleExportBackup,
  handleOpenImportBackup,
  handleImportBackup,
  handleClearBackupData,
  onBack,
}) {
  const { t, language } = useLanguage();

  const backHomeLabel =
    language === "en" ? "← Back to Home" : "← Volver al inicio";

  return (
    <div
      className="tool-workspace"
      ref={generatorFormRef}
    >
      <textarea
        ref={textareaRef}
        className="tool-input"
        value={input}
        onChange={(event) =>
          setInput(event.target.value)
        }
        placeholder={t.ai.placeholder}
        rows="6"
      />

      <div
        style={{
          marginTop: "-6px",
          color: "rgba(255,255,255,.42)",
          fontSize: "12px",
          paddingLeft: "4px",
        }}
      >
        {input.length} {t.ai.characters}
      </div>

      <select
        className="tool-select"
        value={type}
        onChange={(event) =>
          setType(event.target.value)
        }
      >
        {generatorTypes.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <button
        className="primary-btn tool-action-btn"
        type="button"
        onClick={handleGenerate}
        disabled={
          isGenerating || !input.trim()
        }
      >
        {isGenerating
          ? `${t.ai.generating}${loadingDots}`
          : t.ai.generate}
      </button>

      <div className="tool-output">
        <p>
          {displayedOutput ||
            t.ai.emptyOutput}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <button
          className="ghost-btn tool-action-btn"
          type="button"
          onClick={() => handleCopy(output)}
          disabled={!output}
        >
          {copyLabel}
        </button>

        <button
          className="ghost-btn tool-action-btn"
          type="button"
          onClick={handleClearOutput}
          disabled={!output}
        >
          {t.ai.clear}
        </button>
      </div>

      <HistorySection
        history={history}
        handleCopy={handleCopy}
        handleReuseHistory={handleReuseHistory}
        handleDeleteHistory={handleDeleteHistory}
        handleClearHistory={handleClearHistory}
      />

      <BackupToolsSection
        backupFileInputRef={backupFileInputRef}
        backupStatus={backupStatus}
        handleExportBackup={handleExportBackup}
        handleOpenImportBackup={handleOpenImportBackup}
        handleImportBackup={handleImportBackup}
        handleClearBackupData={handleClearBackupData}
      />

      <div
        style={{
          marginTop: "30px",
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