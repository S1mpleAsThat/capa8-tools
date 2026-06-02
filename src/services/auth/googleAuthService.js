// src/services/auth/googleAuthService.js

import { Capacitor } from "@capacitor/core";

const GOOGLE_SCRIPT_ID = "capa8-google-gsi-script";
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

function wait(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isAndroidNative() {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
}

function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
}

function getGoogleRedirectUri() {
  return (
    import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
    "https://capa8-tools.vercel.app/auth/callback"
  );
}

function getGoogleAndroidCallbackUri() {
  return (
    import.meta.env.VITE_GOOGLE_ANDROID_CALLBACK_URI ||
    "capa8tools://auth"
  );
}

function getGoogleTokenApiUrl() {
  return (
    import.meta.env.VITE_GOOGLE_TOKEN_API_URL ||
    "https://capa8-tools.vercel.app/api/auth/google-token"
  );
}

function normalizeGoogleUser({
  id = "",
  name = "",
  email = "",
  picture = "",
  accessToken = "",
  idToken = "",
} = {}) {
  return {
    provider: "google",
    accessToken,
    idToken,
    user: {
      id,
      name: name || "Usuario Google",
      email,
      picture: picture || "",
    },
  };
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createRandomString(length = 64) {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);

  return Array.from(values)
    .map((value) => `0${value.toString(16)}`.slice(-2))
    .join("");
}

async function createCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return base64UrlEncode(digest);
}

function buildGoogleAuthUrl({
  clientId,
  redirectUri,
  state,
  codeChallenge,
}) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "select_account",
    access_type: "offline",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

function parseOAuthCallback(url) {
  const parsedUrl = new URL(url);
  const code = parsedUrl.searchParams.get("code");
  const state = parsedUrl.searchParams.get("state");
  const error = parsedUrl.searchParams.get("error");
  const errorDescription = parsedUrl.searchParams.get("error_description");

  return {
    code,
    state,
    error,
    errorDescription,
  };
}

export async function loadGoogleScript() {
  if (
    typeof window !== "undefined" &&
    window.google?.accounts?.oauth2
  ) {
    return true;
  }

  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

  if (existingScript) {
    for (let index = 0; index < 40; index += 1) {
      if (window.google?.accounts?.oauth2) {
        return true;
      }

      await wait(100);
    }

    throw new Error("Google Identity Services no respondió correctamente.");
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;

    script.onerror = () => {
      reject(new Error("No se pudo cargar Google Identity Services."));
    };

    document.body.appendChild(script);
  });

  for (let index = 0; index < 40; index += 1) {
    if (window.google?.accounts?.oauth2) {
      return true;
    }

    await wait(100);
  }

  throw new Error("Google Identity Services no está disponible.");
}

async function fetchGoogleUser(accessToken) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    let errorText = "Google no devolvió información válida del usuario.";

    try {
      errorText = await response.text();
    } catch {
      throw new Error(errorText);
    }

    throw new Error(errorText);
  }

  return response.json();
}

async function exchangeCodeForToken({
  code,
  clientId,
  redirectUri,
  codeVerifier,
}) {
  const response = await fetch(getGoogleTokenApiUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      clientId,
      redirectUri,
      codeVerifier,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[GOOGLE_ANDROID_TOKEN_API_ERROR]", data);

    throw new Error(
      data.message ||
        data.error_description ||
        data.error ||
        "Google no pudo intercambiar el código OAuth.",
    );
  }

  return data;
}

async function signInWithGoogleWeb() {
  const clientId = getGoogleClientId();

  if (!clientId) {
    throw new Error("Falta configurar VITE_GOOGLE_CLIENT_ID.");
  }

  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (tokenResponse) => {
          try {
            if (tokenResponse.error) {
              reject(
                new Error(
                  tokenResponse.error_description || tokenResponse.error,
                ),
              );

              return;
            }

            const accessToken = tokenResponse.access_token;

            if (!accessToken) {
              reject(new Error("Google no devolvió access_token."));
              return;
            }

            const profile = await fetchGoogleUser(accessToken);

            resolve(
              normalizeGoogleUser({
                id: profile.sub || "",
                name: profile.name || "Usuario Google",
                email: profile.email || "",
                picture: profile.picture || "",
                accessToken,
              }),
            );
          } catch (error) {
            reject(error);
          }
        },
      });

      tokenClient.requestAccessToken();
    } catch (error) {
      reject(error || new Error("No se pudo iniciar sesión con Google."));
    }
  });
}

async function signInWithGoogleAndroid() {
  const clientId = getGoogleClientId();
  const redirectUri = getGoogleRedirectUri();
  const androidCallbackUri = getGoogleAndroidCallbackUri();

  if (!clientId) {
    throw new Error("Falta configurar VITE_GOOGLE_CLIENT_ID.");
  }

  try {
    const [{ Browser }, { App }] = await Promise.all([
      import("@capacitor/browser"),
      import("@capacitor/app"),
    ]);

    const state = createRandomString(32);
    const codeVerifier = createRandomString(64);
    const codeChallenge = await createCodeChallenge(codeVerifier);

    const authUrl = buildGoogleAuthUrl({
      clientId,
      redirectUri,
      state,
      codeChallenge,
    });

    const callbackUrl = await new Promise((resolve, reject) => {
      let finished = false;
      let listenerHandle = null;
      let timeoutId = null;

      const cleanup = async () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (listenerHandle) {
          await listenerHandle.remove();
        }
      };

      timeoutId = setTimeout(async () => {
        if (finished) {
          return;
        }

        finished = true;
        await cleanup();

        reject(new Error("Tiempo de espera agotado en Google Login Android."));
      }, 120000);

      App.addListener("appUrlOpen", async (event) => {
        if (finished) {
          return;
        }

        const url = event?.url || "";

        if (!url.startsWith(androidCallbackUri)) {
          return;
        }

        finished = true;
        await cleanup();

        try {
          await Browser.close();
        } catch {
          // El cierre del navegador no debe bloquear el login.
        }

        resolve(url);
      }).then((handle) => {
        listenerHandle = handle;

        Browser.open({
          url: authUrl,
          presentationStyle: "fullscreen",
        }).catch(async (error) => {
          if (finished) {
            return;
          }

          finished = true;
          await cleanup();

          reject(error);
        });
      });
    });

    const callback = parseOAuthCallback(callbackUrl);

    if (callback.error) {
      throw new Error(
        callback.errorDescription ||
          callback.error ||
          "Google rechazó el inicio de sesión.",
      );
    }

    if (!callback.code) {
      throw new Error("Google no devolvió código OAuth.");
    }

    if (callback.state !== state) {
      throw new Error("Estado OAuth inválido.");
    }

    const tokenData = await exchangeCodeForToken({
      code: callback.code,
      clientId,
      redirectUri,
      codeVerifier,
    });

    const accessToken = tokenData.access_token || "";

    if (!accessToken) {
      throw new Error("Google no devolvió access_token.");
    }

    const profile = await fetchGoogleUser(accessToken);

    return normalizeGoogleUser({
      id: profile.sub || "",
      name: profile.name || "Usuario Google",
      email: profile.email || "",
      picture: profile.picture || "",
      accessToken,
      idToken: tokenData.id_token || "",
    });
  } catch (error) {
    console.error("[GOOGLE_ANDROID_BROWSER_ERROR]", error);
    throw error;
  }
}

export async function signInWithGoogle() {
  if (isAndroidNative()) {
    return signInWithGoogleAndroid();
  }

  return signInWithGoogleWeb();
}

export async function signOutFromGoogle() {
  return true;
}