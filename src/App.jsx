// src/App.jsx

import {
  lazy,
  Suspense,
  useState,
} from "react";

import heroBg from "./assets/backgrounds/hero-bg.png";

import glowCorner from "./assets/effects/glow-corner.png";
import particlesOverlay from "./assets/effects/particles-overlay.png";
import scanlines from "./assets/effects/scanlines.png";

import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import useAuth from "./hooks/useAuth";

import AppTopBar from "./components/AppTopBar";
import HeroSection from "./components/HeroSection";
import ToolsSection from "./components/ToolsSection";

const ToolDetail = lazy(() => import("./components/ToolDetail"));
const WelcomePage = lazy(() => import("./pages/WelcomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

function LoadingScreen() {
  return (
    <main className="app">
      <img className="app-bg" src={heroBg} alt="" />
      <img className="fx-glow-corner" src={glowCorner} alt="" />
      <img className="fx-particles" src={particlesOverlay} alt="" />
      <img className="fx-scanlines" src={scanlines} alt="" />

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">CAPA 8 TOOLS</p>
          <h1>Cargando...</h1>
        </div>
      </section>
    </main>
  );
}

function AppContent() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [hasFinishedOnboarding, setHasFinishedOnboarding] =
    useState(false);

  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated && !hasFinishedOnboarding) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <WelcomePage
          onFinish={() => setHasFinishedOnboarding(true)}
        />
      </Suspense>
    );
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LoginPage />
      </Suspense>
    );
  }

  return (
    <main className="app">
      <img className="app-bg" src={heroBg} alt="" />
      <img className="fx-glow-corner" src={glowCorner} alt="" />
      <img className="fx-particles" src={particlesOverlay} alt="" />
      <img className="fx-scanlines" src={scanlines} alt="" />

      {selectedTool ? (
        <>
          <AppTopBar
            onBack={() => setSelectedTool(null)}
          />

          <Suspense fallback={<LoadingScreen />}>
            <ToolDetail
              tool={selectedTool}
              onBack={() => setSelectedTool(null)}
            />
          </Suspense>
        </>
      ) : (
        <>
          <HeroSection />
          <ToolsSection onSelectTool={setSelectedTool} />
        </>
      )}
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}