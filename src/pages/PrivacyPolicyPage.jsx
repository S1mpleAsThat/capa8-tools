// src/pages/PrivacyPolicyPage.jsx

import { useEffect } from "react";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "CAPA 8 TOOLS | Privacy Policy";
  }, []);

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>LEGAL</p>
        <h2>Privacy Policy</h2>
      </div>

      <div className="tool-workspace">
        <div className="tool-output">
          <p>
            CAPA 8 TOOLS is a productivity and technical support application
            focused on AI-assisted workflows, technical checklists, templates
            and operational tools.
          </p>

          <h3>Local storage</h3>
          <p>
            The app may store preferences, language settings, checklist data,
            AI history, templates, favorites and recent activity locally on
            your device.
          </p>

          <h3>Authentication</h3>
          <p>
            If you sign in with Google, CAPA 8 TOOLS may use basic account
            information such as name, email and provider identifier to separate
            user data and personalize the experience.
          </p>

          <h3>AI providers</h3>
          <p>
            Text entered into AI tools may be processed by external AI providers
            such as Gemini or Groq. Do not submit sensitive, confidential,
            financial, medical or legal information.
          </p>

          <h3>Advertising</h3>
          <p>
            CAPA 8 TOOLS may display ads using Google AdSense. Google may use
            cookies or similar technologies to serve and measure ads.
          </p>

          <h3>Contact</h3>
          <p>
            For privacy questions, support or business inquiries:
            contacto@capa8solutions.sbs
          </p>
        </div>
      </div>
    </section>
  );
}