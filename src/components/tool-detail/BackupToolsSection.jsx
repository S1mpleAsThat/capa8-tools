// src/components/tool-detail/BackupToolsSection.jsx

import useLanguage from "../../hooks/useLanguage";

export default function BackupToolsSection({
  backupFileInputRef,
  backupStatus,
  handleExportBackup,
  handleOpenImportBackup,
  handleImportBackup,
  handleClearBackupData,
}) {
  const { t } = useLanguage();

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
        {t.backup.eyebrow}
      </p>

      <h3
        style={{
          marginBottom: "10px",
        }}
      >
        {t.backup.title}
      </h3>

      <p
        style={{
          color: "rgba(255,255,255,.68)",
          fontSize: "14px",
          lineHeight: 1.5,
          marginBottom: "16px",
        }}
      >
        {t.backup.description}
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
          {t.backup.export}
        </button>

        <button
          className="ghost-btn"
          type="button"
          onClick={handleOpenImportBackup}
        >
          {t.backup.import}
        </button>

        <button
          className="ghost-btn"
          type="button"
          onClick={handleClearBackupData}
        >
          {t.backup.clear}
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