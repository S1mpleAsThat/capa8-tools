// src/components/HeroSection.jsx

import logoMain from "../assets/branding/logo-main.png";
import logoIcon from "../assets/branding/logo-icon.png";
import glowHorizontal from "../assets/effects/glow-horizontal.png";

export default function HeroSection() {
  return (
    <section className="hero">
      <nav className="navbar">
        <img className="nav-icon" src={logoIcon} alt="CAPA 8" />
        <img className="nav-logo" src={logoMain} alt="CAPA 8 TOOLS" />
      </nav>

      <div className="hero-content">
        <p className="eyebrow">CAPA 8 TOOLS</p>

        <h1>Herramientas rápidas para técnicos y creadores.</h1>

        <p className="hero-text">
          Una app móvil simple para generar textos, organizar soporte, crear
          checklists y ahorrar tiempo en tareas digitales.
        </p>

        <div className="hero-actions">
          <button className="primary-btn">Empezar</button>
          <button className="ghost-btn">Ver herramientas</button>
        </div>
      </div>

      <img className="fx-glow-horizontal" src={glowHorizontal} alt="" />
    </section>
  );
}