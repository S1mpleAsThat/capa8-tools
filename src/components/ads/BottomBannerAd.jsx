// src/components/ads/BottomBannerAd.jsx

import { useEffect, useRef, useState } from "react";
import { Keyboard } from "@capacitor/keyboard";

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
  const restoreTimeoutRef = useRef(null);

  useEffect(() => {
    if (!shouldShowAds()) {
      return undefined;
    }

    function clearRestoreTimeout() {
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
        restoreTimeoutRef.current = null;
      }
    }

    async function hideBanner() {
      clearRestoreTimeout();
      setKeyboardOpen(true);

      if (isNativeAndroidAds()) {
        await hideNativeBannerAd();
      }
    }

    function restoreBanner(delay = 450) {
      clearRestoreTimeout();

      restoreTimeoutRef.current = setTimeout(async () => {
        setKeyboardOpen(false);

        if (isNativeAndroidAds()) {
          await showNativeBannerAd(true);
        }
      }, delay);
    }

    function isKeyboardProbablyOpen() {
      if (!window.visualViewport) {
        return false;
      }

      return window.innerHeight - window.visualViewport.height > 150;
    }

    function handleFocusIn(event) {
      if (!isNativeAndroidAds() && isTextInputElement(event.target)) {
        hideBanner();
      }
    }

    function handleFocusOut() {
      if (!isNativeAndroidAds()) {
        restoreBanner();
      }
    }

    function handleViewportResize() {
      if (isNativeAndroidAds()) {
        return;
      }

      if (isKeyboardProbablyOpen()) {
        hideBanner();
        return;
      }

      restoreBanner();
    }

    let keyboardShowListener = null;
    let keyboardHideListener = null;

    if (isNativeAndroidAds()) {
      showNativeBannerAd(true);

      Keyboard.addListener("keyboardWillShow", () => {
        hideBanner();
      }).then((listener) => {
        keyboardShowListener = listener;
      });

      Keyboard.addListener("keyboardDidHide", () => {
        restoreBanner(650);
      }).then((listener) => {
        keyboardHideListener = listener;
      });
    } else {
      document.addEventListener("focusin", handleFocusIn);
      document.addEventListener("focusout", handleFocusOut);
      window.addEventListener("resize", handleViewportResize);

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleViewportResize);
      }
    }

    return () => {
      clearRestoreTimeout();

      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      window.removeEventListener("resize", handleViewportResize);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
      }

      if (keyboardShowListener) {
        keyboardShowListener.remove();
      }

      if (keyboardHideListener) {
        keyboardHideListener.remove();
      }
    };
  }, []);

  if (!shouldShowAds()) {
    return null;
  }

  if (keyboardOpen) {
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