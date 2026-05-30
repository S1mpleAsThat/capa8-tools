// src/pages/ContactPage.jsx

import { useEffect } from "react";

import useLanguage from "../hooks/useLanguage";

export default function ContactPage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  useEffect(() => {
    document.title = isEnglish
      ? "CAPA 8 TOOLS | Contact"
      : "CAPA 8 TOOLS | Contacto";
  }, [isEnglish]);

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>{isEnglish ? "CONTACT" : "CONTACTO"}</p>
        <h2>CAPA 8 TOOLS</h2>
      </div>

      <div className="tool-workspace">
        <div className="tool-output">
          <p>
            {isEnglish
              ? "For support, suggestions or business inquiries."
              : "Para soporte, sugerencias o consultas comerciales."}
          </p>

          <h3>Email</h3>
          <p>contacto@capa8solutions.sbs</p>

          <h3>{isEnglish ? "Website" : "Sitio web"}</h3>
          <p>https://capa8solutions.sbs</p>
        </div>
      </div>
    </section>
  );
}