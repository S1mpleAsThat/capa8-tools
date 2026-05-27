// src/components/HeroSection.jsx

import glowHorizontal from "../assets/effects/glow-horizontal.png";

import useLanguage from "../hooks/useLanguage";

import AppTopBar from "./AppTopBar";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <AppTopBar onBack={() => {}} />

      <div className="hero-content">
        <p className="eyebrow">
          CAPA 8 TOOLS
        </p>

        <h1>
          {t.heroTitle}
        </h1>

        <p className="hero-text">
          {t.heroDescription}
        </p>

        <div className="hero-actions">
          <button className="primary-btn">
            {t.start}
          </button>

          <button className="ghost-btn">
            {t.seeTools}
          </button>
        </div>
      </div>

      <img
        className="fx-glow-horizontal"
        src={glowHorizontal}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}