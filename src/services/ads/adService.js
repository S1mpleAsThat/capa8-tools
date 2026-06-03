// src/services/ads/adService.js

import { Capacitor } from "@capacitor/core";

import {
  ACTION_FREQUENCY,
  ACTION_SLOT,
  ADS_ENABLED,
  ADMOB_BANNER_ID,
  ADMOB_INTERSTITIAL_ID,
  BANNER_SLOT,
} from "./adConfig";

const AD_ACTION_COUNT_KEY = "capa8-ads-action-count";
const INTERSTITIAL_EVENT = "capa8-interstitial-ad";

let admobInitialized = false;
let admobBannerVisible = false;
let admobInterstitialPreparing = false;

export { ACTION_SLOT, BANNER_SLOT };

export function isNativeAndroidAds() {
  return (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "android"
  );
}

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

async function getAdMobModule() {
  return import("@capacitor-community/admob");
}

export async function initializeNativeAdMob() {
  if (!ADS_ENABLED || !isNativeAndroidAds()) {
    return false;
  }

  if (admobInitialized) {
    return true;
  }

  try {
    const { AdMob } = await getAdMobModule();

    await AdMob.initialize({
      initializeForTesting: true,
      requestTrackingAuthorization: false,
    });

    admobInitialized = true;
    console.log("[ADMOB_INIT_OK]");

    return true;
  } catch (error) {
    console.error("[ADMOB_INIT_ERROR]", error);
    return false;
  }
}

export async function showNativeBannerAd() {
  if (!ADS_ENABLED || !isNativeAndroidAds()) {
    return false;
  }

  if (admobBannerVisible) {
    return true;
  }

  try {
    const {
      AdMob,
      BannerAdPosition,
      BannerAdSize,
    } = await getAdMobModule();

    const initialized = await initializeNativeAdMob();

    if (!initialized) {
      return false;
    }

    await AdMob.showBanner({
      adId: ADMOB_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
    });

    admobBannerVisible = true;
    console.log("[ADMOB_BANNER_OK]");

    return true;
  } catch (error) {
    console.error("[ADMOB_BANNER_ERROR]", error);
    return false;
  }
}

export async function hideNativeBannerAd() {
  if (!isNativeAndroidAds()) {
    return true;
  }

  try {
    const { AdMob } = await getAdMobModule();

    await AdMob.hideBanner();

    admobBannerVisible = false;
    return true;
  } catch (error) {
    console.error("[ADMOB_HIDE_BANNER_ERROR]", error);
    return false;
  }
}

export async function showNativeInterstitialAd(reason = "action") {
  if (
    !ADS_ENABLED ||
    !isNativeAndroidAds() ||
    admobInterstitialPreparing
  ) {
    return false;
  }

  try {
    const { AdMob } = await getAdMobModule();

    const initialized = await initializeNativeAdMob();

    if (!initialized) {
      return false;
    }

    admobInterstitialPreparing = true;

    await AdMob.prepareInterstitial({
      adId: ADMOB_INTERSTITIAL_ID,
      isTesting: true,
    });

    await AdMob.showInterstitial();

    admobInterstitialPreparing = false;
    console.log("[ADMOB_INTERSTITIAL_OK]", reason);

    return true;
  } catch (error) {
    admobInterstitialPreparing = false;

    console.error("[ADMOB_INTERSTITIAL_ERROR]", {
      reason,
      error,
    });

    return false;
  }
}

export function shouldShowAds() {
  return ADS_ENABLED;
}

export function requestInterstitialAd(reason = "action") {
  if (!ADS_ENABLED) {
    return false;
  }

  if (isNativeAndroidAds()) {
    showNativeInterstitialAd(reason);
    return true;
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

  console.log("[AD_ACTION_TRACKED]", {
    reason,
    count: nextCount,
    frequency: ACTION_FREQUENCY,
  });

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