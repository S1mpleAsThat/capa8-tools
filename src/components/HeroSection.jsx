// src/components/HeroSection.jsx

import glowHorizontal from "../assets/effects/glow-horizontal.png";

import useLanguage from "../hooks/useLanguage";

import AppTopBar from "./AppTopBar";

const quickActions = [
  {
    id: "new-prompt",
    emoji: "✨",
    title: "New Prompt",
    subtitle: "AI Generator",
  },
  {
    id: "open-checklist",
    emoji: "🛠",
    title: "Checklist",
    subtitle: "Technical Flow",
  },
  {
    id: "quick-templates",
    emoji: "📄",
    title: "Templates",
    subtitle: "Quick Replies",
  },
  {
    id: "change-language",
    emoji: "🌐",
    title: "Language",
    subtitle: "ES / EN",
  },
  {
    id: "export-backup",
    emoji: "💾",
    title: "Backup",
    subtitle: "Export Data",
  },
];

export default function HeroSection({
  onQuickAction,
}) {
  const { t } = useLanguage();

  function handleAction(actionId) {
    if (!onQuickAction) {
      return;
    }

    onQuickAction(actionId);
  }

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

        <div
          style={{
            marginTop: "26px",
            display: "grid",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#18ffad",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "1.8px",
                  marginBottom: "6px",
                }}
              >
                QUICK ACTIONS
              </p>

              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#ffffff",
                }}
              >
                Fast mobile actions
              </h3>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "6px",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() =>
                  handleAction(action.id)
                }
                style={{
                  minWidth: "156px",
                  width: "156px",
                  borderRadius: "24px",
                  padding: "16px 16px",
                  border:
                    "1px solid rgba(0,255,170,.12)",
                  background:
                    "linear-gradient(180deg, rgba(7,28,22,.82), rgba(0,0,0,.72))",
                  backdropFilter: "blur(18px)",
                  boxShadow:
                    "0 18px 42px rgba(0,0,0,.42), inset 0 0 22px rgba(0,255,170,.04), 0 0 24px rgba(0,255,170,.06)",
                  display: "grid",
                  gap: "14px",
                  textAlign: "left",
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(180deg, rgba(0,255,170,.14), rgba(0,255,170,.04))",
                    border:
                      "1px solid rgba(0,255,170,.14)",
                    boxShadow:
                      "0 0 22px rgba(0,255,170,.08)",
                    fontSize: "22px",
                  }}
                >
                  {action.emoji}
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "4px",
                  }}
                >
                  <p
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    {action.title}
                  </p>

                  <p
                    style={{
                      color:
                        "rgba(255,255,255,.52)",
                      fontSize: "11px",
                      lineHeight: 1.3,
                    }}
                  >
                    {action.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
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