// src/components/ads/GoogleAdSlot.jsx

import {
  useEffect,
  useRef,
} from "react";

import {
  ACTION_SLOT,
  ADSENSE_CLIENT_ID,
  IS_LOCALHOST,
  IS_PRODUCTION_ADS,
} from "../../services/ads/adConfig";

let pushedAds = new WeakSet();

export default function GoogleAdSlot({
  slot = ACTION_SLOT,
  format = "auto",
  responsive = true,
  minHeight = 90,
}) {
  const adRef = useRef(null);

  useEffect(() => {
    if (
      !IS_PRODUCTION_ADS ||
      !slot ||
      !adRef.current
    ) {
      return;
    }

    if (
      pushedAds.has(adRef.current)
    ) {
      return;
    }

    try {
      window.adsbygoogle =
        window.adsbygoogle || [];

      window.adsbygoogle.push({});

      pushedAds.add(adRef.current);
    } catch {
      return;
    }
  }, [slot]);

  if (!slot) {
    return null;
  }

  if (IS_LOCALHOST) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: `${minHeight}px`,
          borderRadius: "18px",
          border:
            "1px solid rgba(0,255,170,.12)",
          background:
            "linear-gradient(180deg, rgba(5,16,14,.94), rgba(0,0,0,.82))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,.54)",
          fontSize: "12px",
          letterSpacing: ".5px",
        }}
      >
        Ad Placeholder
      </div>
    );
  }

  if (!IS_PRODUCTION_ADS) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{
        display: "block",
        minHeight: `${minHeight}px`,
      }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={
        responsive ? "true" : "false"
      }
    />
  );
}