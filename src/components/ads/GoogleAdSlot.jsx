// src/components/ads/GoogleAdSlot.jsx

import { useEffect, useRef } from "react";

import {
  ADS_ENABLED,
  ADSENSE_CLIENT_ID,
  canRenderRealAds,
  shouldRenderPlaceholders,
} from "../../services/ads/adConfig";

const pushedAds = new WeakSet();

export default function GoogleAdSlot({
  slot = "",
  format = "auto",
  responsive = true,
  minHeight = 72,
  maxHeight = null,
  label = "Ad Placeholder",
}) {
  const adRef = useRef(null);

  useEffect(() => {
    if (!canRenderRealAds() || !slot || !adRef.current) {
      return;
    }

    if (pushedAds.has(adRef.current)) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedAds.add(adRef.current);
    } catch {
      return;
    }
  }, [slot]);

  if (!ADS_ENABLED) {
    return null;
  }

  const boxStyle = {
    width: "100%",
    minHeight: `${minHeight}px`,
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    overflow: maxHeight ? "hidden" : undefined,
  };

  if (shouldRenderPlaceholders() || !slot) {
    return (
      <div
        style={{
          ...boxStyle,
          borderRadius: "18px",
          border: "1px solid rgba(0,255,170,.18)",
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
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{
        display: "block",
        width: "100%",
        minHeight: `${minHeight}px`,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        overflow: maxHeight ? "hidden" : undefined,
      }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}