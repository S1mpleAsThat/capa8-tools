// src/services/ads/adConfig.js

export const ADS_ENABLED =
  import.meta.env.VITE_ADS_ENABLED === "true";

export const ADSENSE_CLIENT_ID =
  import.meta.env.VITE_ADSENSE_CLIENT_ID || "";

export const BANNER_SLOT =
  import.meta.env.VITE_ADSENSE_BANNER_SLOT || "";

export const ACTION_SLOT =
  import.meta.env.VITE_ADSENSE_ACTION_SLOT || "";

export const ACTION_FREQUENCY =
  Number(
    import.meta.env.VITE_ADS_ACTION_FREQUENCY || 3,
  );

export const IS_LOCALHOST =
  typeof window !== "undefined" &&
  (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );

export const IS_PRODUCTION_ADS =
  ADS_ENABLED &&
  Boolean(ADSENSE_CLIENT_ID) &&
  !IS_LOCALHOST;