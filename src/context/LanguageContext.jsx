// src/context/LanguageContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";

import {
  getUserItem,
  setUserItem,
} from "../services/storage/userStorage";

const LanguageContext = createContext(null);

const PUBLIC_LANGUAGE_KEY = "capa8-public-language";

const translations = {
  es: {
    loading: "Cargando...",
    language: "Idioma",
    spanish: "Español",
    english: "English",

    loginGoogle: "Ingresar con Google",
    loginDemo: "Continuar como demo",
    connecting: "Conectando...",
    poweredBy: "Powered by CAPA 8",

    heroTitle:
      "Herramientas rápidas para técnicos y creadores.",
    heroDescription:
      "Una app móvil simple para generar textos, organizar soporte, crear checklists y ahorrar tiempo en tareas digitales.",
    start: "Empezar",
    seeTools: "Ver herramientas",

    toolsEyebrow: "UTILIDADES",
    toolsTitle: "Base inicial de la aplicación",

    userExportData: "Exportar mis datos",
    userAIHistory: "Historial IA",
    userLogout: "Cerrar sesión",
    userFooter: "CAPA 8 TOOLS MVP",

    tools: {
      ai: {
        title: "Generador IA",
        description:
          "Crea textos, prompts y respuestas rápidas para trabajo, estudio o soporte.",
      },
      checklist: {
        title: "Checklist técnico",
        description:
          "Organiza diagnósticos, pasos de revisión y tareas de soporte.",
      },
      templates: {
        title: "Plantillas rápidas",
        description:
          "Mensajes profesionales listos para copiar y adaptar.",
      },
    },
  },

  en: {
    loading: "Loading...",
    language: "Language",
    spanish: "Español",
    english: "English",

    loginGoogle: "Continue with Google",
    loginDemo: "Continue as demo",
    connecting: "Connecting...",
    poweredBy: "Powered by CAPA 8",

    heroTitle:
      "Fast tools for technicians and creators.",
    heroDescription:
      "A simple mobile app to generate text, organize support, create checklists and save time on digital tasks.",
    start: "Start",
    seeTools: "View tools",

    toolsEyebrow: "UTILITIES",
    toolsTitle: "Initial application base",

    userExportData: "Export my data",
    userAIHistory: "AI history",
    userLogout: "Sign out",
    userFooter: "CAPA 8 TOOLS MVP",

    tools: {
      ai: {
        title: "AI Generator",
        description:
          "Create text, prompts and quick responses for work, study or support.",
      },
      checklist: {
        title: "Technical checklist",
        description:
          "Organize diagnostics, review steps and support tasks.",
      },
      templates: {
        title: "Quick templates",
        description:
          "Professional messages ready to copy and adapt.",
      },
    },
  },
};

function getPublicLanguage() {
  try {
    const savedLanguage = localStorage.getItem(PUBLIC_LANGUAGE_KEY);

    return savedLanguage === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

function savePublicLanguage(language) {
  try {
    localStorage.setItem(PUBLIC_LANGUAGE_KEY, language);
  } catch {
    return;
  }
}

export function LanguageProvider({ children }) {
  const { user } = useAuth();

  const [language, setLanguageState] = useState(() =>
    getPublicLanguage(),
  );

  useEffect(() => {
    if (!user?.id) {
      setLanguageState(getPublicLanguage());
      return;
    }

    const publicLanguage = getPublicLanguage();

    const savedLanguage = getUserItem(
      user.id,
      "language",
      publicLanguage,
    );

    const normalizedLanguage =
      savedLanguage === "en" ? "en" : "es";

    setLanguageState(normalizedLanguage);
    savePublicLanguage(normalizedLanguage);
  }, [user?.id]);

  function setLanguage(nextLanguage) {
    const normalizedLanguage =
      nextLanguage === "en" ? "en" : "es";

    setLanguageState(normalizedLanguage);
    savePublicLanguage(normalizedLanguage);

    if (user?.id) {
      setUserItem(user.id, "language", normalizedLanguage);
    }
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguageContext debe usarse dentro de LanguageProvider.",
    );
  }

  return context;
}