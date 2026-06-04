// src/components/LegalFooter.jsx

import useLanguage from "../hooks/useLanguage";

export default function LegalFooter() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  function navigate(path) {
    window.location.href = path;
  }

  return (
    <footer
      style={{
        width: "100%",
        marginTop: "32px",
        padding: "24px 16px 8px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "10px",
          fontSize: "13px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/privacy")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,.72)",
          }}
        >
          {isEnglish ? "Privacy Policy" : "Política de Privacidad"}
        </button>

        <span style={{ color: "rgba(255,255,255,.24)" }}>•</span>

        <button
          type="button"
          onClick={() => navigate("/terms")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,.72)",
          }}
        >
          {isEnglish ? "Terms of Service" : "Términos de Servicio"}
        </button>

        <span style={{ color: "rgba(255,255,255,.24)" }}>•</span>

        <button
          type="button"
          onClick={() => navigate("/contact")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,.72)",
          }}
        >
          {isEnglish ? "Contact" : "Contacto"}
        </button>
      </div>

      <p
        style={{
          color: "rgba(255,255,255,.42)",
          fontSize: "12px",
          margin: 0,
        }}
      >
        © CAPA 8 TOOLS
      </p>
    </footer>
  );
}