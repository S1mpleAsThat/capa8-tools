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
        width: "100%",
        borderRadius: "22px",
        padding: "8px",
        border: "1px solid rgba(0,255,170,.14)",
        background:
          "linear-gradient(180deg, rgba(5,18,14,.92), rgba(0,0,0,.88))",
        boxShadow:
          "0 18px 46px rgba(0,0,0,.42), inset 0 0 22px rgba(0,255,170,.04)",
        backdropFilter: "blur(10px)",
      }}
    >
      <GoogleAdSlot
        slot={BANNER_SLOT}
        minHeight={72}
        label="Ad Placeholder"
      />
    </div>
  );
}