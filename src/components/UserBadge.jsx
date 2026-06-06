// src/components/UserBadge.jsx

import {
  useEffect,
  useState,
} from "react";

import logoSymbolPremium from "../assets/branding/logo-symbol-premium.png";

import useAuth from "../hooks/useAuth";

import {
  removeUserItem,
} from "../services/storage/userStorage";

const USER_DATA_KEYS = [
  "ai-history",
  "technical-checklist",
  "template-favorites",
  "template-recents",
  "ai-prefill",
  "language",
];

function getProviderLabel(provider) {
  switch (provider) {
    case "google":
      return "GOOGLE";

    case "email":
      return "EMAIL";

    case "demo":
      return "DEMO";

    default:
      return "USER";
  }
}

export default function UserBadge() {
  const { user, logout, loading } = useAuth();

  const [avatarHasError, setAvatarHasError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");

  useEffect(() => {
    setAvatarHasError(false);
  }, [user?.id, user?.picture]);

  if (!user) {
    return null;
  }

  const providerLabel = getProviderLabel(user.provider);
  const initial = user.name?.[0] || "U";
  const hasCustomAvatar = Boolean(user.picture);
  const avatarSource = hasCustomAvatar ? user.picture : logoSymbolPremium;

  async function handleLogout() {
    await logout();
  }

  function handleOpenDeleteConfirm() {
    setDeleteStatus("");
    setShowDeleteConfirm(true);
  }

  function handleCancelDeleteAccount() {
    setShowDeleteConfirm(false);
  }

  // Google Play account deletion compliance
  async function handleConfirmDeleteAccount() {
    USER_DATA_KEYS.forEach((key) => {
      removeUserItem(user.id, key);
    });

    setDeleteStatus("Cuenta eliminada correctamente");
    setShowDeleteConfirm(false);

    await logout();

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        border: "1px solid rgba(0,255,170,.12)",
        background:
          "linear-gradient(180deg, rgba(10,18,16,.88), rgba(0,0,0,.78))",
        borderRadius: "18px",
        backdropFilter: "blur(12px)",
        maxWidth: "62vw",
        position: "relative",
      }}
    >
      {!avatarHasError ? (
        <img
          src={avatarSource}
          alt={user.name}
          onError={() => setAvatarHasError(true)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            objectFit: hasCustomAvatar ? "cover" : "contain",
            padding: hasCustomAvatar ? 0 : "4px",
            background: hasCustomAvatar ? "transparent" : "rgba(0,255,170,.08)",
            border: "1px solid rgba(0,255,170,.28)",
            boxSizing: "border-box",
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
          }}
        >
          {initial}
        </div>
      )}

      <div
        style={{
          minWidth: 0,
        }}
      >
        <p
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
        </p>

        <p
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,.62)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {user.email}
        </p>

        <p
          style={{
            fontSize: "9px",
            letterSpacing: ".8px",
            color: "#18ffad",
            textTransform: "uppercase",
            marginTop: "2px",
          }}
        >
          {providerLabel}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "8px",
        }}
      >
        <button
          className="ghost-btn"
          type="button"
          onClick={handleLogout}
          disabled={loading}
          style={{
            minHeight: "34px",
            padding: "0 12px",
            fontSize: "11px",
            whiteSpace: "nowrap",
          }}
        >
          Salir
        </button>

        <button
          className="ghost-btn"
          type="button"
          onClick={handleOpenDeleteConfirm}
          disabled={loading}
          style={{
            minHeight: "34px",
            padding: "0 12px",
            fontSize: "11px",
            whiteSpace: "nowrap",
          }}
        >
          Eliminar cuenta y datos
        </button>
      </div>

      {showDeleteConfirm ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            width: "min(320px, calc(100vw - 36px))",
            border: "1px solid rgba(255,120,120,.22)",
            background:
              "linear-gradient(180deg, rgba(24,8,8,.96), rgba(0,0,0,.92))",
            borderRadius: "18px",
            boxShadow:
              "0 24px 60px rgba(0,0,0,.48), inset 0 0 28px rgba(255,120,120,.035)",
            backdropFilter: "blur(16px)",
            padding: "16px",
            zIndex: 90,
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#ffffff",
              fontSize: "14px",
              lineHeight: 1.2,
              marginBottom: "8px",
            }}
          >
            Eliminar cuenta y datos
          </strong>

          <p
            style={{
              color: "rgba(255,255,255,.72)",
              fontSize: "12px",
              lineHeight: 1.45,
              marginBottom: "14px",
            }}
          >
            Esta acción eliminará todos los datos almacenados localmente para esta cuenta y cerrará la sesión. Esta acción no se puede deshacer. ¿Deseas continuar?
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <button
              className="ghost-btn"
              type="button"
              onClick={handleCancelDeleteAccount}
              style={{
                minHeight: "38px",
                fontSize: "11px",
              }}
            >
              Cancelar
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={handleConfirmDeleteAccount}
              style={{
                minHeight: "38px",
                fontSize: "11px",
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : null}

      {deleteStatus ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            width: "min(320px, calc(100vw - 36px))",
            border: "1px solid rgba(0,255,170,.18)",
            background: "rgba(0,255,170,.08)",
            borderRadius: "16px",
            padding: "12px 14px",
            zIndex: 90,
          }}
        >
          <p
            style={{
              color: "rgba(220,255,240,.9)",
              fontSize: "13px",
              lineHeight: 1.45,
            }}
          >
            {deleteStatus}
          </p>
        </div>
      ) : null}
    </div>
  );
}