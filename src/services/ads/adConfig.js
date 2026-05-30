// src/services/ads/adConfig.js

const env = import.meta.env || {};

export const IS_DEV = env.DEV === true;
export const IS_PRODUCTION = env.PROD === true;

export const ADS_ENABLED =
  env.VITE_ADS_ENABLED === "true" ||
  (IS_DEV && env.VITE_ADS_ENABLED !== "false");

export const ADSENSE_CLIENT_ID =
  env.VITE_ADSENSE_CLIENT_ID || "";

export const BANNER_SLOT =
  env.VITE_ADSENSE_BANNER_SLOT || "";

export const ACTION_SLOT =
  env.VITE_ADSENSE_ACTION_SLOT || "";

export const ACTION_FREQUENCY = Number(
  env.VITE_ADS_ACTION_FREQUENCY || 3,
);

export function isLocalhost() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

export function canRenderRealAds() {
  return (
    ADS_ENABLED &&
    IS_PRODUCTION &&
    !isLocalhost() &&
    ADSENSE_CLIENT_ID.startsWith("ca-pub-") &&
    Boolean(BANNER_SLOT || ACTION_SLOT)
  );
}

export function shouldRenderPlaceholders() {
  return ADS_ENABLED && !canRenderRealAds();
}