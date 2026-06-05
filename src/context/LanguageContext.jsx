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

export const PUBLIC_LANGUAGE_KEY = "capa8-public-language";

const translations = {
  es: {
    loading: "Cargando...",
    language: "Idioma",
    saveLanguage: "Guardar idioma",
    languageSaved: "Idioma guardado",
    spanish: "Español",
    english: "English",

    chooseLanguage: "Selecciona tu idioma",
    chooseLanguageText:
      "Configura la experiencia inicial de CAPA 8 TOOLS antes de comenzar.",
    continue: "Continuar",
    skip: "Omitir",
    startOnboarding: "Comenzar",
    next: "Siguiente →",

    loginGoogle: "Ingresar con Google",
    loginDemo: "Continuar como demo",
    connecting: "Conectando...",
    poweredBy: "Powered by CAPA 8",

    auth: {
      loginEyebrow: "ACCESO",
      loginTitle: "Iniciar sesión",
      loginText:
        "Accede a tu cuenta CAPA 8 TOOLS utilizando Google o correo electrónico.",
      registerEyebrow: "REGISTRO",
      registerTitle: "Crear cuenta",
      registerText:
        "Crea tu cuenta para sincronizar datos, historial y configuraciones.",
      loginEmail: "Ingresar con correo",
      createAccount: "Crear cuenta",
      emailPlaceholder: "Correo electrónico",
      passwordPlaceholder: "Contraseña",
      namePlaceholder: "Nombre completo",
      needAccount: "Crear una cuenta nueva",
      alreadyHaveAccount: "Ya tengo una cuenta",
      confirmEmailMessage:
        "Tu cuenta fue creada. Revisa tu correo para confirmar tu dirección email.",
      accountCreated: "Cuenta creada correctamente.",
      loginError: "No se pudo iniciar sesión.",
      registerError: "No se pudo crear la cuenta.",
      googleError: "No se pudo iniciar sesión con Google.",
      or: "o",
    },

    heroTitle:
      "Herramientas rápidas para técnicos y creadores.",
    heroDescription:
      "Una app móvil simple para generar textos, organizar soporte, crear checklists y ahorrar tiempo en tareas digitales.",
    start: "Empezar",
    seeTools: "Ver herramientas",

    toolsEyebrow: "UTILIDADES",
    toolsTitle: "Base inicial de la aplicación",

    toolEyebrow: "HERRAMIENTA",
    back: "Volver",

    userExportData: "Exportar mis datos",
    userAIHistory: "Historial IA",
    userLogout: "Cerrar sesión",
    userFooter: "CAPA 8 TOOLS MVP",

    onboarding: [
      {
        eyebrow: "TOOLS",
        title: "HERRAMIENTAS RÁPIDAS",
        text:
          "Accede a utilidades simples para ahorrar tiempo en tareas técnicas y digitales.",
      },
      {
        eyebrow: "AI",
        title: "IA PARA PRODUCTIVIDAD",
        text:
          "Genera textos, respuestas y estructuras útiles desde una app rápida y preparada para escalar.",
      },
      {
        eyebrow: "SUPPORT",
        title: "SOPORTE Y PLANTILLAS",
        text:
          "Organiza checklists, plantillas rápidas y flujos de soporte desde un solo lugar.",
      },
    ],

    ai: {
      placeholder: "Escribe aquí tu idea o contexto...",
      characters: "caracteres",
      generating: "Generando",
      generate: "Generar",
      emptyOutput:
        "La IA generará una respuesta basada en tu contexto.",
      copy: "Copiar",
      copied: "Copiado",
      clear: "Limpiar",
      error: "Error",
      types: [
        "Prompt para ChatGPT",
        "Mensaje profesional",
        "Respuesta para WhatsApp",
        "Publicación redes sociales",
      ],
    },

    checklist: {
      placeholder: "Agregar nuevo paso técnico...",
      add: "Agregar",
      reset: "Reiniciar checklist",
      delete: "Eliminar",
      ai: {
        resultTitle: "Resultado IA",
        copy: "Copiar resultado",
        saveIncident: "Guardar incidente",
        saved: "Incidente guardado",
        incidentsTitle: "Historial operativo",
        reuse: "Reutilizar",
        remove: "Eliminar",
        empty: "No hay incidentes guardados.",
        nextStepLoading: "Analizando siguiente paso...",
        analyzeLoading: "Analizando checklist...",
        solutionLoading: "Generando solución...",
        reportLoading: "Creando reporte...",
      },
      defaultItems: [
        "Revisar conexión a internet",
        "Verificar energía y cables",
        "Reiniciar equipo o servicio",
        "Revisar mensajes de error",
        "Validar permisos de usuario",
        "Probar desde otro navegador o dispositivo",
        "Registrar diagnóstico final",
      ],
    },

    checklistAI: {
      eyebrow: "CHECKLIST IA",
      title: "Workflow inteligente",
      description:
        "Analiza el checklist actual, detecta bloqueos, genera soluciones y crea reportes profesionales asistidos por IA.",
      nextStep: "Sugerir siguiente paso",
      analyze: "Analizar checklist",
      solution: "Generar solución",
      report: "Convertir en reporte",
      generating: "Analizando con IA...",
      resultTitle: "RESULTADO IA",
      errorTitle: "ERROR IA",
      error:
        "No se pudo completar el análisis inteligente del checklist.",
    },

    templates: {
      search: "Buscar plantilla...",
      favoritesEyebrow: "FAVORITOS",
      favoritesTitle: "Plantillas favoritas",
      recentsEyebrow: "RECIENTES",
      recentsTitle: "Usadas recientemente",
      libraryEyebrow: "PLANTILLAS",
      libraryTitle: "Biblioteca rápida",
      copy: "Copiar",
      useInAI: "Usar en IA",
      activeFavorite: "Favorito activo",
      addFavorite: "Agregar favorito",
      items: [
        {
          id: "support-restart",
          category: "Soporte técnico",
          title: "Reinicio de servicio",
          text:
            "Hola. Hemos realizado un reinicio controlado del servicio para estabilizar el sistema. Por favor vuelve a probar y confirma si el problema continúa.",
        },
        {
          id: "support-evidence",
          category: "Soporte técnico",
          title: "Solicitud de evidencia",
          text:
            "Necesitamos una captura de pantalla del error y una breve descripción de los pasos realizados antes de que ocurriera el problema.",
        },
        {
          id: "support-maintenance",
          category: "Soporte técnico",
          title: "Mantenimiento programado",
          text:
            "El sistema tendrá una ventana de mantenimiento programada durante las próximas horas. Algunos servicios podrían presentar lentitud temporal.",
        },
        {
          id: "customer-followup",
          category: "Atención cliente",
          title: "Seguimiento cliente",
          text:
            "Hola. Queríamos confirmar si la solución entregada resolvió correctamente tu solicitud. Quedamos atentos a cualquier duda adicional.",
        },
        {
          id: "customer-response",
          category: "Atención cliente",
          title: "Respuesta cordial",
          text:
            "Gracias por contactarnos. Revisaremos tu caso lo antes posible para entregarte una solución clara y rápida.",
        },
        {
          id: "customer-confirmation",
          category: "Atención cliente",
          title: "Confirmación recepción",
          text:
            "Tu solicitud fue recibida correctamente y ya está siendo revisada por nuestro equipo.",
        },
        {
          id: "sales-intro",
          category: "Ventas",
          title: "Presentación servicio",
          text:
            "Ofrecemos soluciones digitales rápidas y optimizadas para automatizar procesos y mejorar productividad.",
        },
        {
          id: "sales-offer",
          category: "Ventas",
          title: "Oferta limitada",
          text:
            "Tenemos disponibilidad limitada para nuevos proyectos este mes. Podemos coordinar una reunión rápida para revisar tu necesidad.",
        },
        {
          id: "sales-close",
          category: "Ventas",
          title: "Cierre comercial",
          text:
            "Quedamos atentos para avanzar con la implementación y comenzar el proyecto lo antes posible.",
        },
        {
          id: "social-productivity",
          category: "Redes sociales",
          title: "Post productividad",
          text:
            "🚀 Automatizar tareas simples puede ahorrar horas de trabajo cada semana. La eficiencia también es una ventaja competitiva.",
        },
        {
          id: "social-tech",
          category: "Redes sociales",
          title: "Post tecnología",
          text:
            "⚡ Herramientas digitales bien diseñadas permiten trabajar más rápido, con menos errores y mejor organización.",
        },
        {
          id: "social-motivation",
          category: "Redes sociales",
          title: "Post motivacional",
          text:
            "💡 Construir sistemas simples pero útiles es una de las mejores formas de crear productos escalables.",
        },
      ],
    },

    history: {
      eyebrow: "HISTORIAL",
      title: "Generaciones recientes",
      clear: "Limpiar historial",
      copy: "Copiar",
      reuse: "Reutilizar",
      delete: "Eliminar",
    },

    backup: {
      eyebrow: "HERRAMIENTAS DE RESPALDO",
      title: "Respaldo local",
      description:
        "Exporta o restaura historial IA, favoritos, recientes y checklist técnico desde un archivo JSON local.",
      export: "Exportar datos",
      import: "Importar datos",
      clear: "Limpiar datos",
    },

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
    saveLanguage: "Save language",
    languageSaved: "Language saved",
    spanish: "Español",
    english: "English",

    chooseLanguage: "Choose your language",
    chooseLanguageText:
      "Set your initial CAPA 8 TOOLS experience before starting.",
    continue: "Continue",
    skip: "Skip",
    startOnboarding: "Start",
    next: "Next →",

    loginGoogle: "Continue with Google",
    loginDemo: "Continue as demo",
    connecting: "Connecting...",
    poweredBy: "Powered by CAPA 8",

    auth: {
      loginEyebrow: "LOGIN",
      loginTitle: "Sign in",
      loginText:
        "Access your CAPA 8 TOOLS account using Google or email.",
      registerEyebrow: "REGISTER",
      registerTitle: "Create account",
      registerText:
        "Create your account to synchronize data, history and settings.",
      loginEmail: "Sign in with email",
      createAccount: "Create account",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Password",
      namePlaceholder: "Full name",
      needAccount: "Create a new account",
      alreadyHaveAccount: "I already have an account",
      confirmEmailMessage:
        "Your account has been created. Check your email to confirm your address.",
      accountCreated: "Account created successfully.",
      loginError: "Unable to sign in.",
      registerError: "Unable to create account.",
      googleError: "Unable to sign in with Google.",
      or: "or",
    },

    heroTitle:
      "Fast tools for technicians and creators.",
    heroDescription:
      "A simple mobile app to generate text, organize support, create checklists and save time on digital tasks.",
    start: "Start",
    seeTools: "View tools",

    toolsEyebrow: "UTILITIES",
    toolsTitle: "Initial application base",

    toolEyebrow: "TOOL",
    back: "Back",

    userExportData: "Export my data",
    userAIHistory: "AI history",
    userLogout: "Sign out",
    userFooter: "CAPA 8 TOOLS MVP",

    onboarding: [
      {
        eyebrow: "TOOLS",
        title: "FAST TOOLS",
        text:
          "Access simple utilities to save time on technical and digital tasks.",
      },
      {
        eyebrow: "AI",
        title: "AI FOR PRODUCTIVITY",
        text:
          "Generate texts, responses and useful structures from a fast app ready to scale.",
      },
      {
        eyebrow: "SUPPORT",
        title: "SUPPORT AND TEMPLATES",
        text:
          "Organize checklists, quick templates and support workflows from one place.",
      },
    ],

    ai: {
      placeholder: "Write your idea or context here...",
      characters: "characters",
      generating: "Generating",
      generate: "Generate",
      emptyOutput:
        "AI will generate a response based on your context.",
      copy: "Copy",
      copied: "Copied",
      clear: "Clear",
      error: "Error",
      types: [
        "ChatGPT prompt",
        "Professional message",
        "WhatsApp reply",
        "Social media post",
      ],
    },

    checklist: {
      placeholder: "Add new technical step...",
      add: "Add",
      reset: "Reset checklist",
      delete: "Delete",
      ai: {
        resultTitle: "AI Result",
        copy: "Copy result",
        saveIncident: "Save incident",
        saved: "Incident saved",
        incidentsTitle: "Operational history",
        reuse: "Reuse",
        remove: "Delete",
        empty: "No incidents saved.",
        nextStepLoading: "Analyzing next step...",
        analyzeLoading: "Analyzing checklist...",
        solutionLoading: "Generating solution...",
        reportLoading: "Creating report...",
      },
      defaultItems: [
        "Check internet connection",
        "Verify power and cables",
        "Restart device or service",
        "Review error messages",
        "Validate user permissions",
        "Test from another browser or device",
        "Register final diagnosis",
      ],
    },

    checklistAI: {
      eyebrow: "AI CHECKLIST",
      title: "Smart workflow",
      description:
        "Analyze the current checklist, detect blockers, generate solutions and create AI-assisted professional reports.",
      nextStep: "Suggest next step",
      analyze: "Analyze checklist",
      solution: "Generate solution",
      report: "Convert to report",
      generating: "Analyzing with AI...",
      resultTitle: "AI RESULT",
      errorTitle: "AI ERROR",
      error:
        "The intelligent checklist analysis could not be completed.",
    },

    templates: {
      search: "Search template...",
      favoritesEyebrow: "FAVORITES",
      favoritesTitle: "Favorite templates",
      recentsEyebrow: "RECENT",
      recentsTitle: "Recently used",
      libraryEyebrow: "TEMPLATES",
      libraryTitle: "Quick library",
      copy: "Copy",
      useInAI: "Use in AI",
      activeFavorite: "Favorite active",
      addFavorite: "Add favorite",
      items: [
        {
          id: "support-restart",
          category: "Technical support",
          title: "Service restart",
          text:
            "Hello. We performed a controlled service restart to stabilize the system. Please try again and confirm whether the issue continues.",
        },
        {
          id: "support-evidence",
          category: "Technical support",
          title: "Evidence request",
          text:
            "We need a screenshot of the error and a brief description of the steps taken before the issue occurred.",
        },
        {
          id: "support-maintenance",
          category: "Technical support",
          title: "Scheduled maintenance",
          text:
            "The system will have a scheduled maintenance window during the next few hours. Some services may temporarily slow down.",
        },
        {
          id: "customer-followup",
          category: "Customer support",
          title: "Customer follow-up",
          text:
            "Hello. We wanted to confirm whether the provided solution correctly resolved your request. We remain available for any additional questions.",
        },
        {
          id: "customer-response",
          category: "Customer support",
          title: "Polite response",
          text:
            "Thank you for contacting us. We will review your case as soon as possible to provide a clear and fast solution.",
        },
        {
          id: "customer-confirmation",
          category: "Customer support",
          title: "Request received",
          text:
            "Your request was received correctly and is already being reviewed by our team.",
        },
        {
          id: "sales-intro",
          category: "Sales",
          title: "Service introduction",
          text:
            "We offer fast and optimized digital solutions to automate processes and improve productivity.",
        },
        {
          id: "sales-offer",
          category: "Sales",
          title: "Limited offer",
          text:
            "We have limited availability for new projects this month. We can schedule a quick meeting to review your needs.",
        },
        {
          id: "sales-close",
          category: "Sales",
          title: "Commercial closing",
          text:
            "We remain available to move forward with the implementation and start the project as soon as possible.",
        },
        {
          id: "social-productivity",
          category: "Social media",
          title: "Productivity post",
          text:
            "🚀 Automating simple tasks can save hours of work every week. Efficiency is also a competitive advantage.",
        },
        {
          id: "social-tech",
          category: "Social media",
          title: "Technology post",
          text:
            "⚡ Well-designed digital tools allow teams to work faster, with fewer errors and better organization.",
        },
        {
          id: "social-motivation",
          category: "Social media",
          title: "Motivational post",
          text:
            "💡 Building simple but useful systems is one of the best ways to create scalable products.",
        },
      ],
    },

    history: {
      eyebrow: "HISTORY",
      title: "Recent generations",
      clear: "Clear history",
      copy: "Copy",
      reuse: "Reuse",
      delete: "Delete",
    },

    backup: {
      eyebrow: "BACKUP TOOLS",
      title: "Local backup",
      description:
        "Export or restore AI history, favorites, recents and technical checklist from a local JSON file.",
      export: "Export data",
      import: "Import data",
      clear: "Clear data",
    },

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

function normalizeLanguage(language) {
  return language === "en" ? "en" : "es";
}

export function getPublicLanguage() {
  try {
    return normalizeLanguage(
      localStorage.getItem(PUBLIC_LANGUAGE_KEY),
    );
  } catch {
    return "es";
  }
}

export function hasSavedPublicLanguage() {
  try {
    const savedLanguage = localStorage.getItem(PUBLIC_LANGUAGE_KEY);
    return savedLanguage === "es" || savedLanguage === "en";
  } catch {
    return false;
  }
}

export function savePublicLanguage(language) {
  try {
    localStorage.setItem(
      PUBLIC_LANGUAGE_KEY,
      normalizeLanguage(language),
    );
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
    const publicLanguage = getPublicLanguage();

    if (!user?.id) {
      setLanguageState(publicLanguage);
      return;
    }

    const savedLanguage = getUserItem(
      user.id,
      "language",
      publicLanguage,
    );

    const normalizedLanguage = normalizeLanguage(savedLanguage);

    setLanguageState(normalizedLanguage);
    savePublicLanguage(normalizedLanguage);
  }, [user?.id]);

  function setLanguage(nextLanguage) {
    const normalizedLanguage = normalizeLanguage(nextLanguage);

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