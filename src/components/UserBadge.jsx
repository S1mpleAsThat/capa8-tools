// src/components/UserBadge.jsx

import { useEffect, useState } from "react";

import logoSymbolPremium from "../assets/branding/logo-symbol-premium.png";

import useAuth from "../hooks/useAuth";

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
    </div>
  );
}