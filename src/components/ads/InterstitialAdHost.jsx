// src/components/ads/InterstitialAdHost.jsx

import { useEffect, useState } from "react";

import {
  ADS_ENABLED,
  ADS_INTERSTITIAL_ID,
  shouldUseAdPlaceholders,
} from "../../services/ads/adConfig";

import { subscribeInterstitialAd } from "../../services/ads/adService";

export default function InterstitialAdHost() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return subscribeInterstitialAd(() => {
      if (!ADS_ENABLED && !shouldUseAdPlaceholders()) {
        return;
      }

      setVisible(true);
    });
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: "22px",
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          borderRadius: "26px",
          border: "1px solid rgba(0,255,170,.18)",
          background:
            "linear-gradient(180deg, rgba(8,28,23,.96), rgba(0,0,0,.94))",
          boxShadow:
            "0 24px 80px rgba(0,0,0,.62), 0 0 34px rgba(0,255,170,.08)",
          padding: "22px",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <p
          style={{
            color: "#18ffad",
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "1.4px",
            marginBottom: "10px",
          }}
        >
          CAPA 8 TOOLS
        </p>

        <h3
          style={{
            fontSize: "20px",
            lineHeight: 1.15,
            marginBottom: "12px",
          }}
        >
          {shouldUseAdPlaceholders()
            ? "Ad Placeholder"
            : "Sponsored"}
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,.64)",
            fontSize: "13px",
            lineHeight: 1.5,
            marginBottom: "18px",
          }}
        >
          {shouldUseAdPlaceholders()
            ? "Interstitial test preview for development mode."
            : `AdMob Interstitial ${ADS_INTERSTITIAL_ID}`}
        </p>

        <button
          className="ghost-btn"
          type="button"
          onClick={() => setVisible(false)}
          style={{
            width: "100%",
            minHeight: "44px",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}