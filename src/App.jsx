// src/App.jsx

import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import heroBg from "./assets/backgrounds/hero-bg.png";
import glowCorner from "./assets/effects/glow-corner.png";
import particlesOverlay from "./assets/effects/particles-overlay.png";
import scanlines from "./assets/effects/scanlines.png";

import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import useAuth from "./hooks/useAuth";
import useLanguage from "./hooks/useLanguage";

import {
  getUserItem,
  removeUserItem,
  setUserItem,
} from "./services/storage/userStorage";

import { shouldHideAdsForPro } from "./services/subscription/subscriptionConfig";

import {
  hideNativeBannerAd,
  initializeNativeAdMob,
  isNativeAndroidAds,
  showNativeBannerAd,
} from "./services/ads/adService";

import AppTopBar from "./components/AppTopBar";
import HeroSection from "./components/HeroSection";
import ToolsSection from "./components/ToolsSection";

import BottomBannerAd from "./components/ads/BottomBannerAd";
import InterstitialAdHost from "./components/ads/InterstitialAdHost";

import LegalFooter from "./components/LegalFooter";

const ToolDetail = lazy(() => import("./components/ToolDetail"));
const WelcomePage = lazy(() => import("./pages/WelcomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const LanguageGatePage = lazy(() => import("./pages/LanguageGatePage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));

const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicyPage"),
);
const TermsOfServicePage = lazy(() =>
  import("./pages/TermsOfServicePage"),
);
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProPage = lazy(() => import("./pages/ProPage"));

const ACTIVE_TOOL_KEY = "active-tool";
const PUBLIC_LANGUAGE_KEY = "capa8-public-language";

function hasPublicLanguage() {
  try {
    const savedLanguage = localStorage.getItem(PUBLIC_LANGUAGE_KEY);
    return savedLanguage === "es" || savedLanguage === "en";
  } catch {
    return false;
  }
}

function getCurrentPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
}

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

function AppShell({ children, showAds = true }) {
  return (
    <main
      className="app"
      style={{
        paddingBottom:
          showAds && !isNativeAndroidAds()
            ? "110px"
            : undefined,
      }}
    >
      <img className="app-bg" src={heroBg} alt="" />
      <img className="fx-glow-corner" src={glowCorner} alt="" />
      <img className="fx-particles" src={particlesOverlay} alt="" />
      <img className="fx-scanlines" src={scanlines} alt="" />

      {children}

      {showAds ? (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <BottomBannerAd />
        </div>
      ) : null}
    </main>
  );
}

function PublicRoute() {
  const currentPath = getCurrentPath();

  if (currentPath === "/auth/callback") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthCallbackPage />
      </Suspense>
    );
  }

  if (currentPath === "/privacy") {
    return (
      <AppShell showAds={false}>
        <Suspense fallback={<LoadingScreen />}>
          <PrivacyPolicyPage />
        </Suspense>
      </AppShell>
    );
  }

  if (currentPath === "/terms") {
    return (
      <AppShell showAds={false}>
        <Suspense fallback={<LoadingScreen />}>
          <TermsOfServicePage />
        </Suspense>
      </AppShell>
    );
  }

  if (currentPath === "/contact") {
    return (
      <AppShell showAds={false}>
        <Suspense fallback={<LoadingScreen />}>
          <ContactPage />
        </Suspense>
      </AppShell>
    );
  }

  if (currentPath === "/pro") {
    return (
      <AppShell showAds={false}>
        <Suspense fallback={<LoadingScreen />}>
          <ProPage />
        </Suspense>
      </AppShell>
    );
  }

  return null;
}

function AppContent() {
  const [selectedToolId, setSelectedToolId] = useState(null);
  const [hasFinishedOnboarding, setHasFinishedOnboarding] =
    useState(false);
  const [hasSelectedPublicLanguage, setHasSelectedPublicLanguage] =
    useState(() => hasPublicLanguage());

  const { loading, isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  const publicRoute = PublicRoute();
  const showAds = isAuthenticated && !shouldHideAdsForPro();

  useEffect(() => {
    if (!isNativeAndroidAds()) {
      return;
    }

    if (!showAds) {
      hideNativeBannerAd();
      return;
    }

    initializeNativeAdMob().then((initialized) => {
      if (initialized) {
        showNativeBannerAd();
      }
    });
  }, [showAds]);

  const availableTools = useMemo(
    () => [
      {
        id: "ai-generator",
        title: t.tools.ai.title,
        description: t.tools.ai.description,
      },
      {
        id: "technical-checklist",
        title: t.tools.checklist.title,
        description: t.tools.checklist.description,
      },
      {
        id: "quick-templates",
        title: t.tools.templates.title,
        description: t.tools.templates.description,
      },
    ],
    [t],
  );

  const selectedTool = useMemo(() => {
    if (!selectedToolId) {
      return null;
    }

    return (
      availableTools.find((tool) => tool.id === selectedToolId) ||
      null
    );
  }, [availableTools, selectedToolId]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setSelectedToolId(null);
      return;
    }

    const savedToolId = getUserItem(user.id, ACTIVE_TOOL_KEY, "");
    const exists = availableTools.some(
      (tool) => tool.id === savedToolId,
    );

    setSelectedToolId(exists ? savedToolId : null);
  }, [isAuthenticated, user?.id, availableTools]);

  function handleSelectTool(tool) {
    setSelectedToolId(tool.id);

    if (user?.id) {
      setUserItem(user.id, ACTIVE_TOOL_KEY, tool.id);
    }
  }

  function handleBackHome() {
    setSelectedToolId(null);

    if (user?.id) {
      removeUserItem(user.id, ACTIVE_TOOL_KEY);
    }
  }

  function handleLanguageGateFinish() {
    setHasSelectedPublicLanguage(true);
  }

  if (publicRoute) {
    return publicRoute;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated && !hasSelectedPublicLanguage) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LanguageGatePage onFinish={handleLanguageGateFinish} />
      </Suspense>
    );
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
    <AppShell showAds={showAds}>
      {showAds ? <InterstitialAdHost /> : null}

      {selectedTool ? (
        <>
          <AppTopBar onBack={handleBackHome} />

          <Suspense fallback={<LoadingScreen />}>
            <ToolDetail
              tool={selectedTool}
              onBack={handleBackHome}
            />
          </Suspense>
        </>
      ) : (
        <>
          <HeroSection />
          <ToolsSection onSelectTool={handleSelectTool} />
          <LegalFooter />
        </>
      )}
    </AppShell>
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