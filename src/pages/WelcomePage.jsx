// src/pages/WelcomePage.jsx

import { useRef, useState } from "react";

import onboardingTools from "../assets/onboarding/onboarding-tools.png";
import onboardingAi from "../assets/onboarding/onboarding-ai.png";
import onboardingSupport from "../assets/onboarding/onboarding-support.png";

import glowCorner from "../assets/effects/glow-corner.png";
import particlesOverlay from "../assets/effects/particles-overlay.png";
import scanlines from "../assets/effects/scanlines.png";

import { useLanguageContext } from "../context/LanguageContext";

const slideImages = [
  onboardingTools,
  onboardingAi,
  onboardingSupport,
];

export default function WelcomePage({
  onFinish,
}) {
  const { t } =
    useLanguageContext();

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const slides = t.onboarding.map(
    (slide, index) => ({
      ...slide,
      image: slideImages[index],
    }),
  );

  const isLastSlide =
    currentSlide === slides.length - 1;

  function goToSlide(index) {
    setCurrentSlide(
      Math.max(
        0,
        Math.min(index, slides.length - 1),
      ),
    );
  }

  function handleNext() {
    if (isLastSlide) {
      onFinish();
      return;
    }

    goToSlide(currentSlide + 1);
  }

  function handlePrevious() {
    goToSlide(currentSlide - 1);
  }

  function handleSkip() {
    onFinish();
  }

  function handleTouchStart(event) {
    touchStartX.current =
      event.touches[0].clientX;

    touchEndX.current = null;
  }

  function handleTouchMove(event) {
    touchEndX.current =
      event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    if (distance > 45) {
      handleNext();
    }

    if (distance < -45) {
      handlePrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        color: "#ffffff",
        background:
          "linear-gradient(180deg, #020806 0%, #000000 100%)",
      }}
    >
      <img
        src={particlesOverlay}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.24,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <img
        src={scanlines}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.13,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <img
        src={glowCorner}
        alt=""
        style={{
          position: "absolute",
          top: "-90px",
          right: "-90px",
          width: "280px",
          opacity: 0.48,
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          padding: "26px 22px 0",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="ghost-btn"
          type="button"
          onClick={handleSkip}
          style={{
            minHeight: "34px",
            padding: "0 14px",
            fontSize: "11px",
          }}
        >
          {t.skip}
        </button>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 4,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            transform: `translateX(-${currentSlide * 100}%)`,
            transition:
              "transform 420ms cubic-bezier(.22,.8,.24,1)",
          }}
        >
          {slides.map((slide) => (
            <article
              key={slide.title}
              style={{
                minWidth: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "62vh",
                  minHeight: "390px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    filter:
                      "drop-shadow(0 0 36px rgba(24,255,173,.18))",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at center, transparent 42%, rgba(0,0,0,.22) 72%, rgba(0,0,0,.72) 100%)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "42%",
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.72) 52%, #000000 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "0 24px 28px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#18ffad",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    marginBottom: "10px",
                  }}
                >
                  {slide.eyebrow}
                </p>

                <h1
                  style={{
                    fontSize: "32px",
                    lineHeight: 1,
                    letterSpacing: "-1.1px",
                    marginBottom: "13px",
                  }}
                >
                  {slide.title}
                </h1>

                <p
                  style={{
                    maxWidth: "340px",
                    color: "rgba(255,255,255,.68)",
                    fontSize: "15px",
                    lineHeight: 1.52,
                    margin: "0 auto",
                  }}
                >
                  {slide.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 6,
          width: "100%",
          padding: "0 22px 26px",
          display: "grid",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                width:
                  index === currentSlide
                    ? "28px"
                    : "8px",
                height: "8px",
                borderRadius: "999px",
                border: 0,
                padding: 0,
                background:
                  index === currentSlide
                    ? "#18ffad"
                    : "rgba(255,255,255,.2)",
                boxShadow:
                  index === currentSlide
                    ? "0 0 18px rgba(24,255,173,.55)"
                    : "none",
                transition: "all .2s ease",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              currentSlide > 0
                ? "auto 1fr"
                : "1fr",
            gap: "12px",
          }}
        >
          {currentSlide > 0 ? (
            <button
              className="ghost-btn"
              type="button"
              onClick={handlePrevious}
              style={{
                minHeight: "50px",
                width: "54px",
                fontSize: "18px",
              }}
            >
              ←
            </button>
          ) : null}

          <button
            className={
              isLastSlide
                ? "primary-btn"
                : "ghost-btn"
            }
            type="button"
            onClick={handleNext}
            style={{
              width: "100%",
              minHeight: "50px",
              fontSize: "15px",
              fontWeight: 800,
            }}
          >
            {isLastSlide
              ? t.startOnboarding
              : t.next}
          </button>
        </div>
      </div>
    </section>
  );
}