// src/services/ads/adService.js

import {
  ADS_ACTION_FREQUENCY,
  ADS_ENABLED,
} from "./adConfig";

const AD_ACTION_COUNT_KEY = "capa8-ads-action-count";
const INTERSTITIAL_EVENT = "capa8-show-interstitial-ad";

function getActionCount() {
  try {
    const value = Number(
      sessionStorage.getItem(AD_ACTION_COUNT_KEY),
    );

    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function setActionCount(count) {
  try {
    sessionStorage.setItem(
      AD_ACTION_COUNT_KEY,
      String(count),
    );
  } catch {
    return;
  }
}

export function requestInterstitialAd(reason = "action") {
  try {
    window.dispatchEvent(
      new CustomEvent(INTERSTITIAL_EVENT, {
        detail: {
          reason,
          createdAt: new Date().toISOString(),
        },
      }),
    );
  } catch {
    return;
  }
}

export function trackAdAction(reason = "action") {
  if (!ADS_ENABLED) {
    return false;
  }

  const nextCount = getActionCount() + 1;

  setActionCount(nextCount);

  if (
    ADS_ACTION_FREQUENCY > 0 &&
    nextCount % ADS_ACTION_FREQUENCY === 0
  ) {
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