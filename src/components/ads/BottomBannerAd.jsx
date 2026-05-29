// src/components/ads/BottomBannerAd.jsx

import {
  BANNER_SLOT,
  shouldShowAds,
} from "../../services/ads/adService";

import GoogleAdSlot from "./GoogleAdSlot";

export default function BottomBannerAd() {
  if (!shouldShowAds()) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "10px",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: "560px",
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          backdropFilter: "blur(12px)",
          background:
            "linear-gradient(180deg, rgba(5,16,14,.88), rgba(0,0,0,.82))",
          border: "1px solid rgba(0,255,170,.10)",
          borderRadius: "22px",
          padding: "10px",
          boxShadow: "0 12px 40px rgba(0,0,0,.34)",
        }}
      >
        <GoogleAdSlot
          slot={BANNER_SLOT}
          minHeight={72}
        />
      </div>
    </div>
  );
}