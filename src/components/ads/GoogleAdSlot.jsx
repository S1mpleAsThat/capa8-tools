// src/components/ads/GoogleAdSlot.jsx

import { useEffect, useRef } from "react";

import {
  ADS_ENABLED,
  ADSENSE_CLIENT_ID,
  canRenderRealAds,
  shouldRenderPlaceholders,
} from "../../services/ads/adConfig";

export default function GoogleAdSlot({
  slot = "",
  minHeight = 72,
  maxHeight = 76,
  label = "Ad Placeholder",
  format = "auto",
}) {
  const adRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!canRenderRealAds()) {
      return;
    }

    if (!slot) {
      return;
    }

    if (!adRef.current) {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    try {
      const ads = window.adsbygoogle || [];

      ads.push({});

      window.adsbygoogle = ads;

      initializedRef.current = true;
    } catch (error) {
      console.error(
        "[Adsense] push failed",
        error,
      );
    }
  }, [slot]);

  if (!ADS_ENABLED) {
    return null;
  }

  if (
    shouldRenderPlaceholders() ||
    !slot ||
    !ADSENSE_CLIENT_ID
  ) {
    return (
      <div
        style={{
          width: "100%",
          height: `${maxHeight || minHeight}px`,
          maxHeight: `${maxHeight || minHeight}px`,
          overflow: "hidden",
          borderRadius: "18px",
          border:
            "1px solid rgba(0,255,170,.18)",
          background:
            "linear-gradient(180deg, rgba(5,22,18,.96), rgba(0,0,0,.88))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,.62)",
          fontSize: "12px",
          fontWeight: 900,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight || minHeight}px`,
        overflow: "hidden",
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          minHeight: `${minHeight}px`,
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}