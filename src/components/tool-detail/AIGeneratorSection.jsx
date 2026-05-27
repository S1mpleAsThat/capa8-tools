// src/components/tool-detail/AIGeneratorSection.jsx

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
}) {
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
        placeholder="Escribe aquí tu idea o contexto..."
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
        {input.length} caracteres
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
          Limpiar
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
    </div>
  );
}