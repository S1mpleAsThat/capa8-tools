// src/services/ads/adConfig.js

const env = import.meta.env || {};

export const IS_DEV = env.DEV === true;
export const IS_PRODUCTION = env.PROD === true;

export const ADS_ENABLED =
  env.VITE_ADS_ENABLED === "true" ||
  (IS_DEV && env.VITE_ADS_ENABLED !== "false");

export const ADSENSE_CLIENT_ID = env.VITE_ADSENSE_CLIENT_ID || "";
export const BANNER_SLOT = env.VITE_ADSENSE_BANNER_SLOT || "";
export const ACTION_SLOT = env.VITE_ADSENSE_ACTION_SLOT || "";

export const ADMOB_APP_ID =
  env.VITE_ADMOB_APP_ID ||
  "ca-app-pub-5375465561858627~8793902856";

export const ADMOB_BANNER_ID =
  env.VITE_ADMOB_BANNER_ID ||
  "ca-app-pub-5375465561858627/2308385556";

export const ADMOB_INTERSTITIAL_ID =
  env.VITE_ADMOB_INTERSTITIAL_ID ||
  "ca-app-pub-5375465561858627/7735286291";

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