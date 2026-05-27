// src/main.jsx

import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./styles/global.css";

async function clearDevelopmentServiceWorkers() {
  if (
    import.meta.env.PROD ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  try {
    const registrations =
      await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      await registration.unregister();
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();

      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
      }
    }
  } catch {
    return;
  }
}

function registerProductionServiceWorker() {
  if (
    !import.meta.env.PROD ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch {
      return;
    }
  });
}

clearDevelopmentServiceWorkers().finally(() => {
  ReactDOM.createRoot(
    document.getElementById("root"),
  ).render(
    <App />,
  );

  registerProductionServiceWorker();
});