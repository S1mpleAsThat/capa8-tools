// src/pages/AccountDeletionPage.jsx

import { useEffect } from "react";

export default function AccountDeletionPage() {
  useEffect(() => {
    document.title = "CAPA 8 TOOLS | Eliminar cuenta y datos";
  }, []);

  return (
    <section className="tools-section">
      <div className="section-header">
        <p>LEGAL</p>
        <h2>Eliminar cuenta y datos</h2>
      </div>

      <div className="tool-workspace">
        <div className="tool-output">
          <p>
            CAPA 8 TOOLS permite a los usuarios eliminar su cuenta y los datos almacenados localmente asociados a ella.
          </p>

          <h3>Cómo eliminar tu cuenta</h3>

          <ol>
            <li>Inicia sesión en CAPA 8 TOOLS.</li>
            <li>Abre el panel de usuario.</li>
            <li>Selecciona "Eliminar cuenta y datos".</li>
            <li>Confirma la eliminación.</li>
          </ol>

          <h3>Qué datos se eliminan</h3>

          <ul>
            <li>Historial IA</li>
            <li>Checklist técnico</li>
            <li>Favoritos</li>
            <li>Recientes</li>
            <li>Datos locales asociados al usuario</li>
          </ul>

          <h3>Qué ocurre después</h3>

          <ul>
            <li>Se cierra la sesión.</li>
            <li>Los datos almacenados localmente son eliminados.</li>
            <li>La acción no se puede deshacer.</li>
          </ul>

          <h3>Soporte</h3>

          <p>
            contacto@capa8solutions.sbs
          </p>
        </div>
      </div>
    </section>
  );
}