// src/App.jsx

import { useState } from "react";

import heroBg from "./assets/backgrounds/hero-bg.png";

import glowCorner from "./assets/effects/glow-corner.png";
import particlesOverlay from "./assets/effects/particles-overlay.png";
import scanlines from "./assets/effects/scanlines.png";

import HeroSection from "./components/HeroSection";
import ToolDetail from "./components/ToolDetail";
import ToolsSection from "./components/ToolsSection";

export default function App() {
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <main className="app">
      <img className="app-bg" src={heroBg} alt="" />
      <img className="fx-glow-corner" src={glowCorner} alt="" />
      <img className="fx-particles" src={particlesOverlay} alt="" />
      <img className="fx-scanlines" src={scanlines} alt="" />

      {selectedTool ? (
        <ToolDetail
          tool={selectedTool}
          onBack={() => setSelectedTool(null)}
        />
      ) : (
        <>
          <HeroSection />
          <ToolsSection onSelectTool={setSelectedTool} />
        </>
      )}
    </main>
  );
}