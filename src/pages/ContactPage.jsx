// src/pages/ContactPage.jsx

import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    document.title = "CAPA 8 TOOLS | Contact";
  }, []);

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>CONTACT</p>
        <h2>CAPA 8 TOOLS</h2>
      </div>

      <div className="tool-workspace">
        <div className="tool-output">
          <p>
            Para soporte, sugerencias o consultas comerciales.
          </p>

          <h3>Email</h3>
          <p>contacto@capa8solutions.sbs</p>

          <h3>Website</h3>
          <p>https://capa8solutions.sbs</p>
        </div>
      </div>
    </section>
  );
}