// src/components/ads/BottomBannerAd.jsx

import { useEffect, useRef, useState } from "react";

import {
  BANNER_SLOT,
  hideNativeBannerAd,
  isNativeAndroidAds,
  shouldShowAds,
  showNativeBannerAd,
} from "../../services/ads/adService";

import GoogleAdSlot from "./GoogleAdSlot";

function isTextInputElement(element) {
  if (!element) return false;

  const tagName = element.tagName?.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    element.isContentEditable
  );
}

export default function BottomBannerAd() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const keyboardVisibleRef = useRef(false);
  const restoreTimeoutRef = useRef(null);

  useEffect(() => {
    if (!shouldShowAds()) return undefined;

    function clearRestoreTimeout() {
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
        restoreTimeoutRef.current = null;
      }
    }

    function hideBanner() {
      clearRestoreTimeout();

      keyboardVisibleRef.current = true;
      setKeyboardOpen(true);

      if (isNativeAndroidAds()) {
        hideNativeBannerAd();
      }
    }

    function restoreBanner() {
      clearRestoreTimeout();

      restoreTimeoutRef.current = setTimeout(() => {
        keyboardVisibleRef.current = false;
        setKeyboardOpen(false);

        if (isNativeAndroidAds()) {
          showNativeBannerAd(true);
        }
      }, 500);
    }

    function isKeyboardProbablyOpen() {
      if (!window.visualViewport) return false;

      return window.innerHeight - window.visualViewport.height > 150;
    }

    function handleFocusIn(event) {
      if (isTextInputElement(event.target)) {
        hideBanner();
      }
    }

    function handleFocusOut() {
      restoreBanner();
    }

    function handleViewportResize() {
      if (isKeyboardProbablyOpen()) {
        hideBanner();
        return;
      }

      if (keyboardVisibleRef.current) {
        restoreBanner();
      }
    }

    function handleUserInteraction() {
      if (!isKeyboardProbablyOpen()) {
        restoreBanner();
      }
    }

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("touchend", handleUserInteraction);
    document.addEventListener("pointerup", handleUserInteraction);
    window.addEventListener("resize", handleViewportResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
    }

    if (isNativeAndroidAds()) {
      showNativeBannerAd(true);
    }

    return () => {
      clearRestoreTimeout();

      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("touchend", handleUserInteraction);
      document.removeEventListener("pointerup", handleUserInteraction);
      window.removeEventListener("resize", handleViewportResize);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportResize,
        );
      }

      if (isNativeAndroidAds()) {
        hideNativeBannerAd();
      }
    };
  }, []);

  if (!shouldShowAds() || keyboardOpen) return null;

  if (isNativeAndroidAds()) return null;

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "92px",
        overflow: "hidden",
        borderRadius: "22px",
        padding: "8px",
        border: "1px solid rgba(0,255,170,.14)",
        background:
          "linear-gradient(180deg, rgba(5,18,14,.92), rgba(0,0,0,.88))",
      }}
    >
      <GoogleAdSlot
        slot={BANNER_SLOT}
        format="horizontal"
        minHeight={72}
        maxHeight={76}
        label="Ad Placeholder"
      />
    </div>
  );
}