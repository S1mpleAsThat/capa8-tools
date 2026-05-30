// src/pages/TermsOfServicePage.jsx

import { useEffect } from "react";

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = "CAPA 8 TOOLS | Terms of Service";
  }, []);

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>LEGAL</p>
        <h2>Terms of Service</h2>
      </div>

      <div className="tool-workspace">
        <div className="tool-output">
          <p>
            By using CAPA 8 TOOLS, you agree to use the application responsibly
            and in compliance with applicable laws.
          </p>

          <h3>Use of tools</h3>
          <p>
            CAPA 8 TOOLS provides productivity, technical support, templates,
            checklists and AI-assisted features. You are responsible for
            reviewing and validating all outputs before using them.
          </p>

          <h3>AI-generated content</h3>
          <p>
            AI-generated content may contain errors, incomplete information or
            outdated recommendations. It should not be treated as guaranteed
            professional, legal, medical, financial or security advice.
          </p>

          <h3>Prohibited use</h3>
          <p>
            You may not use CAPA 8 TOOLS for illegal activity, unauthorized
            access, malware, fraud, harassment, abuse or privacy violations.
          </p>

          <h3>Availability</h3>
          <p>
            CAPA 8 TOOLS depends on third-party services such as hosting,
            authentication, AI providers and advertising networks. Availability
            is not guaranteed.
          </p>

          <h3>Limitation of liability</h3>
          <p>
            CAPA 8 TOOLS is provided as-is. The developer is not responsible for
            losses, damages, technical failures or decisions made using the app.
          </p>
        </div>
      </div>
    </section>
  );
}