// src/components/LegalFooter.jsx

export default function LegalFooter() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 5,
        width: "100%",
        padding: "22px 22px 104px",
        display: "grid",
        gap: "12px",
        justifyItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <a
          href="/pro"
          style={{
            color: "rgba(255,215,120,.72)",
            fontSize: "12px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          CAPA 8 PRO
        </a>

        <a
          href="/privacy"
          style={{
            color: "rgba(255,255,255,.56)",
            fontSize: "12px",
            textDecoration: "none",
          }}
        >
          Privacy Policy
        </a>

        <a
          href="/terms"
          style={{
            color: "rgba(255,255,255,.56)",
            fontSize: "12px",
            textDecoration: "none",
          }}
        >
          Terms of Service
        </a>

        <a
          href="/account-deletion"
          style={{
            color: "rgba(255,255,255,.56)",
            fontSize: "12px",
            textDecoration: "none",
          }}
        >
          Eliminar cuenta
        </a>

        <a
          href="/contact"
          style={{
            color: "rgba(255,255,255,.56)",
            fontSize: "12px",
            textDecoration: "none",
          }}
        >
          Contact
        </a>
      </div>

      <p
        style={{
          color: "rgba(255,255,255,.32)",
          fontSize: "11px",
          lineHeight: 1.4,
        }}
      >
        CAPA 8 TOOLS · MVP
      </p>
    </footer>
  );
}