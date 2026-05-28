// src/services/ads/adConfig.js

const env = import.meta.env || {};

export const ADS_ENABLED =
  env.VITE_ADS_ENABLED === "true";

export const ADS_MODE =
  env.MODE === "production"
    ? "production"
    : "development";

export const ADS_BANNER_ID =
  env.VITE_ADS_BANNER_ID || "";

export const ADS_INTERSTITIAL_ID =
  env.VITE_ADS_INTERSTITIAL_ID || "";

export const ADS_ACTION_FREQUENCY = Number(
  env.VITE_ADS_ACTION_FREQUENCY || 3,
);

export function shouldUseAdPlaceholders() {
  return ADS_MODE !== "production" || !ADS_ENABLED;
}