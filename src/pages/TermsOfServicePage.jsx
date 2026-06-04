// src/pages/TermsOfServicePage.jsx

import { useEffect } from "react";

import useLanguage from "../hooks/useLanguage";

export default function TermsOfServicePage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  useEffect(() => {
    document.title = isEnglish
      ? "CAPA 8 TOOLS | Terms of Service"
      : "CAPA 8 TOOLS | Términos de Servicio";
  }, [isEnglish]);

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>LEGAL</p>
        <h2>{isEnglish ? "Terms of Service" : "Términos de Servicio"}</h2>
      </div>

      <div className="tool-workspace">
        <div className="tool-output">
          {isEnglish ? (
            <>
              <p>By using CAPA 8 TOOLS, you agree to use the application responsibly and in compliance with applicable laws.</p>

              <h3>Use of tools</h3>
              <p>CAPA 8 TOOLS provides productivity, technical support, templates, checklists and AI-assisted features. You are responsible for reviewing and validating all outputs before using them.</p>

              <h3>AI-generated content</h3>
              <p>AI-generated content may contain errors, incomplete information or outdated recommendations. It should not be treated as guaranteed professional, legal, medical, financial or security advice.</p>

              <h3>Prohibited use</h3>
              <p>You may not use CAPA 8 TOOLS for illegal activity, unauthorized access, malware, fraud, harassment, abuse or privacy violations.</p>

              <h3>Availability</h3>
              <p>CAPA 8 TOOLS depends on third-party services such as hosting, authentication, AI providers and advertising networks. Availability is not guaranteed.</p>

              <h3>Limitation of liability</h3>
              <p>CAPA 8 TOOLS is provided as-is. The developer is not responsible for losses, damages, technical failures or decisions made using the app.</p>
            </>
          ) : (
            <>
              <p>Al usar CAPA 8 TOOLS, aceptas utilizar la aplicación de forma responsable y de acuerdo con las leyes aplicables.</p>

              <h3>Uso de herramientas</h3>
              <p>CAPA 8 TOOLS ofrece funciones de productividad, soporte técnico, plantillas, checklists y asistencia con IA. Eres responsable de revisar y validar los resultados antes de utilizarlos.</p>

              <h3>Contenido generado por IA</h3>
              <p>El contenido generado por IA puede contener errores, información incompleta o recomendaciones desactualizadas. No debe considerarse asesoría profesional, legal, médica, financiera o de seguridad garantizada.</p>

              <h3>Uso prohibido</h3>
              <p>No puedes usar CAPA 8 TOOLS para actividades ilegales, accesos no autorizados, malware, fraude, acoso, abuso o vulneraciones de privacidad.</p>

              <h3>Disponibilidad</h3>
              <p>CAPA 8 TOOLS depende de servicios externos como hosting, autenticación, proveedores de IA y redes publicitarias. La disponibilidad no está garantizada.</p>

              <h3>Limitación de responsabilidad</h3>
              <p>CAPA 8 TOOLS se entrega tal como está. El desarrollador no es responsable por pérdidas, daños, fallas técnicas o decisiones tomadas usando la aplicación.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}