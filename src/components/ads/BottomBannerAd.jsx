// src/components/ads/BottomBannerAd.jsx

import {
  BANNER_SLOT,
  isNativeAndroidAds,
  shouldShowAds,
} from "../../services/ads/adService";

import GoogleAdSlot from "./GoogleAdSlot";

export default function BottomBannerAd() {
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
        borderRadius: "0",
        padding: "0",
        background: "#000000",
      }}
    >
      <GoogleAdSlot
        slot={BANNER_SLOT}
        format="horizontal"
        minHeight={60}
        maxHeight={60}
        label="Ad Placeholder"
      />
    </div>
  );
}