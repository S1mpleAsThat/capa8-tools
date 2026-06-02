// src/components/AppTopBar.jsx

import { useEffect, useRef, useState } from "react";

import logoMain from "../assets/branding/logo-main.png";
import glowHorizontal2 from "../assets/effects/glow-horizontal2.png";

import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";

import { getUserItem } from "../services/storage/userStorage";

const EXPORT_KEYS = {
  aiHistory: "ai-history",
  checklist: "technical-checklist",
  templateFavorites: "template-favorites",
  templateRecents: "template-recents",
  aiPrefill: "ai-prefill",
  language: "language",
};

function downloadJsonFile(fileName, data) {
  const fileContent = JSON.stringify(data, null, 2);
  const blob = new Blob([fileContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default function AppTopBar({ onBack }) {
  const { user, logout, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(language);
  const [languageStatus, setLanguageStatus] = useState("");

  const panelRef = useRef(null);

  useEffect(() => {
    setPendingLanguage(language);
  }, [language]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    }

    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isPanelOpen]);

  if (!user) {
    return null;
  }

  const providerLabel = user.provider === "google" ? "GOOGLE" : "DEMO";
  const initial = user.name?.[0] || "U";

  function handleTogglePanel() {
    setIsPanelOpen((currentValue) => !currentValue);
  }

  function handleSaveLanguage() {
    setLanguage(pendingLanguage);
    setLanguageStatus(t.languageSaved);

    setTimeout(() => {
      setLanguageStatus("");
    }, 1800);
  }

  function handleExportUserData() {
    const date = new Date().toISOString().slice(0, 10);

    const exportData = {
      app: "CAPA 8 TOOLS",
      type: "user-data",
      version: 1,
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
      data: {
        aiHistory: getUserItem(user.id, EXPORT_KEYS.aiHistory, []),
        checklist: getUserItem(user.id, EXPORT_KEYS.checklist, []),
        templateFavorites: getUserItem(user.id, EXPORT_KEYS.templateFavorites, []),
        templateRecents: getUserItem(user.id, EXPORT_KEYS.templateRecents, []),
        aiPrefill: getUserItem(user.id, EXPORT_KEYS.aiPrefill, ""),
        language: getUserItem(user.id, EXPORT_KEYS.language, "es"),
      },
    };

    downloadJsonFile(`capa8-user-data-${user.id}-${date}.json`, exportData);
    setIsPanelOpen(false);
  }

  function handleExportAIHistory() {
    const date = new Date().toISOString().slice(0, 10);

    const exportData = {
      app: "CAPA 8 TOOLS",
      type: "ai-history",
      version: 1,
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
      history: getUserItem(user.id, EXPORT_KEYS.aiHistory, []),
    };

    downloadJsonFile(`capa8-ai-history-${user.id}-${date}.json`, exportData);
    setIsPanelOpen(false);
  }

  async function handleLogout() {
    setIsPanelOpen(false);
    await logout();
  }

  return (
    <div
      ref={panelRef}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        padding: "calc(env(safe-area-inset-top, 0px) + 14px) 18px 8px",
        position: "relative",
        zIndex: 40,
        minHeight: "92px",
      }}
    >
      <img
        src={glowHorizontal2}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(env(safe-area-inset-top, 0px) + 2px)",
          width: "82vw",
          maxWidth: "620px",
          height: "auto",
          transform: "translateX(-50%)",
          opacity: 0.72,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <button
        type="button"
        onClick={onBack}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          margin: 0,
          marginLeft: "-30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(-26px)",
          flexShrink: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <img
          src={logoMain}
          alt="CAPA 8 TOOLS"
          decoding="async"
          style={{
            height: "130px",
            width: "auto",
            maxWidth: "235px",
            objectFit: "contain",
            filter:
              "brightness(1.45) contrast(1.12) drop-shadow(0 0 12px rgba(24,255,173,.28))",
          }}
        />
      </button>

      <button
        type="button"
        onClick={handleTogglePanel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 12px",
          border: "1px solid rgba(0,255,170,.12)",
          background:
            "linear-gradient(180deg, rgba(10,18,16,.88), rgba(0,0,0,.78))",
          borderRadius: "18px",
          transform: "translate(-38px, -24px)",
          backdropFilter: "blur(12px)",
          maxWidth: "62vw",
          cursor: "pointer",
          position: "relative",
          zIndex: 2,
        }}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            decoding="async"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(0,255,170,.28)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,255,170,.12)",
              color: "#18ffad",
              fontSize: "12px",
              fontWeight: 800,
              border: "1px solid rgba(0,255,170,.18)",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
        )}

        <div
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#ffffff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.name}
          </span>

          <span
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,.62)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.email}
          </span>

          <span
            style={{
              fontSize: "9px",
              letterSpacing: ".8px",
              color: "#18ffad",
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            {providerLabel}
          </span>
        </div>
      </button>

      {isPanelOpen ? (
        <div
          style={{
            position: "absolute",
            top: "calc(env(safe-area-inset-top, 0px) + 82px)",
            right: "18px",
            width: "min(320px, calc(100vw - 36px))",
            border: "1px solid rgba(0,255,170,.16)",
            background:
              "linear-gradient(180deg, rgba(7,18,15,.96), rgba(0,0,0,.92))",
            borderRadius: "22px",
            boxShadow:
              "0 24px 60px rgba(0,0,0,.48), inset 0 0 28px rgba(0,255,170,.035)",
            backdropFilter: "blur(16px)",
            padding: "18px",
            zIndex: 80,
          }}
        >
          <div style={{ display: "grid", gap: "4px", marginBottom: "16px" }}>
            <strong style={{ color: "#ffffff", fontSize: "14px", lineHeight: 1.2 }}>
              {user.name}
            </strong>

            <span
              style={{
                color: "rgba(255,255,255,.62)",
                fontSize: "12px",
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </span>

            <span
              style={{
                color: "#18ffad",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: ".9px",
              }}
            >
              {providerLabel}
            </span>
          </div>

          <label style={{ display: "grid", gap: "8px", marginBottom: "10px" }}>
            <span
              style={{
                color: "rgba(255,255,255,.68)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: ".8px",
                textTransform: "uppercase",
              }}
            >
              {t.language}
            </span>

            <select
              value={pendingLanguage}
              onChange={(event) => setPendingLanguage(event.target.value)}
              style={{
                minHeight: "42px",
                width: "100%",
                borderRadius: "14px",
                border: "1px solid rgba(0,255,170,.14)",
                background: "rgba(0,0,0,.42)",
                color: "#ffffff",
                padding: "0 12px",
                outline: "none",
              }}
            >
              <option value="es">{t.spanish}</option>
              <option value="en">{t.english}</option>
            </select>
          </label>

          <button
            className="ghost-btn"
            type="button"
            onClick={handleSaveLanguage}
            style={{
              minHeight: "40px",
              fontSize: "12px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            {t.saveLanguage}
          </button>

          {languageStatus ? (
            <p
              style={{
                color: "#18ffad",
                fontSize: "11px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {languageStatus}
            </p>
          ) : null}

          <div style={{ display: "grid", gap: "10px" }}>
            <button
              className="ghost-btn"
              type="button"
              onClick={handleExportUserData}
              style={{ minHeight: "42px", fontSize: "12px" }}
            >
              {t.userExportData}
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={handleExportAIHistory}
              style={{ minHeight: "42px", fontSize: "12px" }}
            >
              {t.userAIHistory}
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={handleLogout}
              disabled={loading}
              style={{ minHeight: "42px", fontSize: "12px" }}
            >
              {t.userLogout}
            </button>
          </div>

          <p
            style={{
              color: "rgba(255,255,255,.42)",
              fontSize: "10px",
              textAlign: "center",
              marginTop: "14px",
              letterSpacing: ".6px",
            }}
          >
            {t.userFooter}
          </p>
        </div>
      ) : null}
    </div>
  );
}