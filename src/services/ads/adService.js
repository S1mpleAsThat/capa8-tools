// src/services/ads/adService.js

import {
  ACTION_FREQUENCY,
  ACTION_SLOT,
  ADS_ENABLED,
  BANNER_SLOT,
} from "./adConfig";

const AD_ACTION_COUNT_KEY = "capa8-ads-action-count";
const INTERSTITIAL_EVENT = "capa8-interstitial-ad";

export { ACTION_SLOT, BANNER_SLOT };

function getStoredActionCount() {
  try {
    const value = Number(sessionStorage.getItem(AD_ACTION_COUNT_KEY));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function setStoredActionCount(count) {
  try {
    sessionStorage.setItem(AD_ACTION_COUNT_KEY, String(count));
  } catch {
    return;
  }
}

export function shouldShowAds() {
  return ADS_ENABLED;
}

export function requestInterstitialAd(reason = "action") {
  if (!ADS_ENABLED) {
    return false;
  }

  try {
    window.dispatchEvent(
      new CustomEvent(INTERSTITIAL_EVENT, {
        detail: {
          reason,
          createdAt: new Date().toISOString(),
        },
      }),
    );

    return true;
  } catch {
    return false;
  }
}

export function trackAdAction(reason = "action") {
  if (!ADS_ENABLED) {
    return false;
  }

  const nextCount = getStoredActionCount() + 1;
  setStoredActionCount(nextCount);

  if (ACTION_FREQUENCY > 0 && nextCount % ACTION_FREQUENCY === 0) {
    requestInterstitialAd(reason);
    return true;
  }

  return false;
}

export function subscribeInterstitialAd(callback) {
  function handler(event) {
    callback(event.detail || {});
  }

  window.addEventListener(INTERSTITIAL_EVENT, handler);

  return () => {
    window.removeEventListener(INTERSTITIAL_EVENT, handler);
  };
}