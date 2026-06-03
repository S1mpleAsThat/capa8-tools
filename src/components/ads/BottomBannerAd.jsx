// src/components/ads/BottomBannerAd.jsx

import { useEffect, useState } from "react";

import {
  BANNER_SLOT,
  hideNativeBannerAd,
  isNativeAndroidAds,
  shouldShowAds,
  showNativeBannerAd,
} from "../../services/ads/adService";

import GoogleAdSlot from "./GoogleAdSlot";

function isTextInputElement(element) {
  if (!element) {
    return false;
  }

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

  useEffect(() => {
    if (!shouldShowAds()) {
      return undefined;
    }

    let keyboardVisible = false;

    function hideBannerForKeyboard() {
      keyboardVisible = true;
      setKeyboardOpen(true);

      if (isNativeAndroidAds()) {
        hideNativeBannerAd();
      }
    }

    function showBannerAfterKeyboard() {
      keyboardVisible = false;
      setKeyboardOpen(false);

      if (isNativeAndroidAds()) {
        showNativeBannerAd();
      }
    }

    function handleFocusIn(event) {
      if (isTextInputElement(event.target)) {
        hideBannerForKeyboard();
      }
    }

    function handleFocusOut() {
      window.setTimeout(() => {
        if (!isTextInputElement(document.activeElement)) {
          showBannerAfterKeyboard();
        }
      }, 180);
    }

    function handleViewportResize() {
      if (!window.visualViewport) {
        return;
      }

      const heightDifference =
        window.innerHeight - window.visualViewport.height;

      if (heightDifference > 140) {
        hideBannerForKeyboard();
        return;
      }

      if (keyboardVisible) {
        showBannerAfterKeyboard();
      }
    }

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
    }

    if (isNativeAndroidAds()) {
      showNativeBannerAd();
    }

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportResize,
        );
      }
    };
  }, []);

  if (!shouldShowAds() || keyboardOpen) {
    return null;
  }

  if (isNativeAndroidAds()) {
    return null;
  }

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