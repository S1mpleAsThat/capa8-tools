// src/components/tool-detail/BackupToolsSection.jsx

export default function BackupToolsSection({
  backupFileInputRef,
  backupStatus,
  handleExportBackup,
  handleOpenImportBackup,
  handleImportBackup,
  handleClearBackupData,
}) {
  return (
    <div
      className="tool-output"
      style={{
        marginTop: "20px",
      }}
    >
      <p
        style={{
          color: "#18ffad",
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "1px",
          marginBottom: "8px",
        }}
      >
        HERRAMIENTAS DE RESPALDO
      </p>

      <h3
        style={{
          marginBottom: "10px",
        }}
      >
        Respaldo local
      </h3>

      <p
        style={{
          color: "rgba(255,255,255,.68)",
          fontSize: "14px",
          lineHeight: 1.5,
          marginBottom: "16px",
        }}
      >
        Exporta o restaura historial IA, favoritos, recientes y checklist técnico desde un archivo JSON local.
      </p>

      <input
        ref={backupFileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportBackup}
        style={{
          display: "none",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "10px",
        }}
      >
        <button
          className="ghost-btn"
          type="button"
          onClick={handleExportBackup}
        >
          Exportar datos
        </button>

        <button
          className="ghost-btn"
          type="button"
          onClick={handleOpenImportBackup}
        >
          Importar datos
        </button>

        <button
          className="ghost-btn"
          type="button"
          onClick={handleClearBackupData}
        >
          Limpiar datos
        </button>
      </div>

      {backupStatus ? (
        <p
          style={{
            color: "rgba(255,255,255,.58)",
            fontSize: "12px",
            lineHeight: 1.4,
            marginTop: "12px",
          }}
        >
          {backupStatus}
        </p>
      ) : null}
    </div>
  );
}