// src/components/ads/InterstitialAdHost.jsx

import { useEffect, useState } from "react";

import {
  ACTION_SLOT,
  isNativeAndroidAds,
  shouldShowAds,
  subscribeInterstitialAd,
} from "../../services/ads/adService";

import GoogleAdSlot from "./GoogleAdSlot";

export default function InterstitialAdHost() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNativeAndroidAds()) {
      return undefined;
    }

    return subscribeInterstitialAd(() => {
      setVisible(true);
    });
  }, []);

  if (!shouldShowAds() || !visible || isNativeAndroidAds()) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "28px",
          padding: "18px",
          border: "1px solid rgba(0,255,170,.12)",
          background:
            "linear-gradient(180deg, rgba(5,18,14,.96), rgba(0,0,0,.94))",
          boxShadow: "0 24px 80px rgba(0,0,0,.55)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <p
            style={{
              color: "#18ffad",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            SPONSORED
          </p>

          <button
            type="button"
            onClick={() => setVisible(false)}
            style={{
              border: "none",
              background: "none",
              color: "rgba(255,255,255,.62)",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>

        <GoogleAdSlot
          slot={ACTION_SLOT}
          minHeight={250}
        />
      </div>
    </div>
  );
}