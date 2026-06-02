// src/pages/AuthCallbackPage.jsx

import { useEffect } from "react";

const ANDROID_CALLBACK_URI =
  import.meta.env.VITE_GOOGLE_ANDROID_CALLBACK_URI ||
  "capa8tools://auth";

export default function AuthCallbackPage() {
  useEffect(() => {
    const search = window.location.search || "";
    const hash = window.location.hash || "";
    const targetUrl = `${ANDROID_CALLBACK_URI}${search}${hash}`;

    window.location.replace(targetUrl);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#020806",
        color: "#ffffff",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "20px",
            marginBottom: "10px",
          }}
        >
          Volviendo a CAPA 8 TOOLS...
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,.68)",
            fontSize: "14px",
          }}
        >
          Si la app no se abre automáticamente, vuelve manualmente a CAPA 8 TOOLS.
        </p>
      </div>
    </main>
  );
}