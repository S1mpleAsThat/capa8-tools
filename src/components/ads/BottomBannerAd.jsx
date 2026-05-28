// src/components/ads/BottomBannerAd.jsx

import {
  ADS_BANNER_ID,
  ADS_ENABLED,
  shouldUseAdPlaceholders,
} from "../../services/ads/adConfig";

export default function BottomBannerAd() {
  if (!ADS_ENABLED && !shouldUseAdPlaceholders()) {
    return null;
  }

  return (
    <div
      aria-label="Advertisement"
      style={{
        width: "calc(100% - 32px)",
        maxWidth: "440px",
        minHeight: "46px",
        margin: "18px auto 26px",
        borderRadius: "18px",
        border: "1px solid rgba(0,255,170,.12)",
        background:
          "linear-gradient(180deg, rgba(5,18,15,.82), rgba(0,0,0,.78))",
        boxShadow:
          "0 18px 42px rgba(0,0,0,.34), inset 0 0 22px rgba(0,255,170,.035)",
        display: "grid",
        placeItems: "center",
        color: "rgba(255,255,255,.46)",
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "1px",
        textTransform: "uppercase",
        position: "relative",
        zIndex: 5,
      }}
    >
      {shouldUseAdPlaceholders()
        ? "Ad Placeholder"
        : `AdMob Banner ${ADS_BANNER_ID}`}
    </div>
  );
}