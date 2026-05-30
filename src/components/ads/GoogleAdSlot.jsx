// src/components/ads/GoogleAdSlot.jsx

import {
  ADS_ENABLED,
} from "../../services/ads/adConfig";

export default function GoogleAdSlot({
  minHeight = 72,
  maxHeight = 76,
  label = "Ad Placeholder",
}) {
  if (!ADS_ENABLED) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: `${maxHeight || minHeight}px`,
        maxHeight: `${maxHeight || minHeight}px`,
        overflow: "hidden",
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