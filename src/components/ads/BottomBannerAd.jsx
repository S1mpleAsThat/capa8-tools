// src/components/ads/BottomBannerAd.jsx

import { useEffect } from "react";

import {
  BANNER_SLOT,
  isNativeAndroidAds,
  shouldShowAds,
  showNativeBannerAd,
} from "../../services/ads/adService";

import GoogleAdSlot from "./GoogleAdSlot";

export default function BottomBannerAd() {
  useEffect(() => {
    if (!shouldShowAds()) {
      return;
    }

    if (isNativeAndroidAds()) {
      showNativeBannerAd();
    }
  }, []);

  if (!shouldShowAds()) {
    return null;
  }

  if (isNativeAndroidAds()) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "92px",
        overflow: "hidden",
        borderRadius: "22px",
        padding: "8px",
        border: "1px solid rgba(0,255,170,.14)",
        background:
          "linear-gradient(180deg, rgba(5,18,14,.92), rgba(0,0,0,.88))",
      }}
    >
      <GoogleAdSlot
        slot={BANNER_SLOT}
        format="horizontal"
        minHeight={72}
        maxHeight={76}
        label="Ad Placeholder"
      />
    </div>
  );
}