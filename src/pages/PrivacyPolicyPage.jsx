// src/pages/PrivacyPolicyPage.jsx

import { useEffect } from "react";

import useLanguage from "../hooks/useLanguage";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  useEffect(() => {
    document.title = isEnglish
      ? "CAPA 8 TOOLS | Privacy Policy"
      : "CAPA 8 TOOLS | Política de Privacidad";
  }, [isEnglish]);

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>LEGAL</p>
        <h2>{isEnglish ? "Privacy Policy" : "Política de Privacidad"}</h2>
      </div>

      <div className="tool-workspace">
        <div className="tool-output">
          {isEnglish ? (
            <>
              <p>CAPA 8 TOOLS is a productivity and technical support application focused on AI-assisted workflows, technical checklists, templates and operational tools.</p>

              <h3>Local storage</h3>
              <p>The app may store preferences, language settings, checklist data, AI history, templates, favorites and recent activity locally on your device.</p>

              <h3>Authentication</h3>
              <p>If you sign in with Google, CAPA 8 TOOLS may use basic account information such as name, email and provider identifier to separate user data and personalize the experience.</p>

              <h3>AI providers</h3>
              <p>Text entered into AI tools may be processed by external AI providers such as Gemini or Groq. Do not submit sensitive, confidential, financial, medical or legal information.</p>

              <h3>Advertising</h3>
              <p>CAPA 8 TOOLS may display ads using Google AdSense. Google may use cookies or similar technologies to serve and measure ads.</p>

              <h3>Contact</h3>
              <p>For privacy questions, support or business inquiries: contacto@capa8solutions.sbs</p>
            </>
          ) : (
            <>
              <p>CAPA 8 TOOLS es una aplicación de productividad y soporte técnico enfocada en flujos asistidos por IA, checklists técnicos, plantillas y herramientas operativas.</p>

              <h3>Almacenamiento local</h3>
              <p>La app puede guardar preferencias, idioma, datos de checklist, historial de IA, plantillas, favoritos y actividad reciente de forma local en tu dispositivo.</p>

              <h3>Autenticación</h3>
              <p>Si ingresas con Google, CAPA 8 TOOLS puede usar información básica como nombre, correo e identificador del proveedor para separar datos de usuario y personalizar la experiencia.</p>

              <h3>Proveedores de IA</h3>
              <p>El texto ingresado en herramientas de IA puede ser procesado por proveedores externos como Gemini o Groq. No ingreses información sensible, confidencial, financiera, médica o legal.</p>

              <h3>Publicidad</h3>
              <p>CAPA 8 TOOLS puede mostrar anuncios mediante Google AdSense. Google puede usar cookies o tecnologías similares para publicar y medir anuncios.</p>

              <h3>Contacto</h3>
              <p>Para privacidad, soporte o consultas comerciales: contacto@capa8solutions.sbs</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}