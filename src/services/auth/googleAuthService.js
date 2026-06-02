// src/services/auth/googleAuthService.js

import {
  Capacitor,
} from "@capacitor/core";

const GOOGLE_SCRIPT_ID =
  "capa8-google-gsi-script";

const GOOGLE_SCRIPT_SRC =
  "https://accounts.google.com/gsi/client";

const GOOGLE_USERINFO_URL =
  "https://www.googleapis.com/oauth2/v3/userinfo";

function wait(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isAndroidNative() {
  return (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "android"
  );
}

function getGoogleClientId() {
  return (
    import.meta.env
      .VITE_GOOGLE_CLIENT_ID ||
    ""
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

      name:
        name ||
        "Usuario Google",

      email,

      picture:
        picture ||
        "",
    },
  };
}

export async function loadGoogleScript() {
  if (
    typeof window !== "undefined" &&
    window.google?.accounts?.oauth2
  ) {
    return true;
  }

  const existingScript =
    document.getElementById(
      GOOGLE_SCRIPT_ID,
    );

  if (existingScript) {
    for (
      let index = 0;
      index < 40;
      index += 1
    ) {
      if (
        window.google?.accounts
          ?.oauth2
      ) {
        return true;
      }

      // eslint-disable-next-line no-await-in-loop
      await wait(100);
    }

    throw new Error(
      "Google Identity Services no respondió correctamente.",
    );
  }

  await new Promise(
    (resolve, reject) => {
      const script =
        document.createElement(
          "script",
        );

      script.id =
        GOOGLE_SCRIPT_ID;

      script.src =
        GOOGLE_SCRIPT_SRC;

      script.async = true;
      script.defer = true;

      script.onload = resolve;

      script.onerror = () => {
        reject(
          new Error(
            "No se pudo cargar Google Identity Services.",
          ),
        );
      };

      document.body.appendChild(
        script,
      );
    },
  );

  for (
    let index = 0;
    index < 40;
    index += 1
  ) {
    if (
      window.google?.accounts
        ?.oauth2
    ) {
      return true;
    }

    // eslint-disable-next-line no-await-in-loop
    await wait(100);
  }

  throw new Error(
    "Google Identity Services no está disponible.",
  );
}

async function fetchGoogleUser(
  accessToken,
) {
  const response = await fetch(
    GOOGLE_USERINFO_URL,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    let errorText =
      "Google no devolvió información válida del usuario.";

    try {
      errorText =
        await response.text();
    } catch {
      throw new Error(errorText);
    }

    throw new Error(errorText);
  }

  return response.json();
}

async function signInWithGoogleWeb() {
  const clientId =
    getGoogleClientId();

  if (!clientId) {
    throw new Error(
      "Falta configurar VITE_GOOGLE_CLIENT_ID.",
    );
  }

  await loadGoogleScript();

  return new Promise(
    (resolve, reject) => {
      try {
        const tokenClient =
          window.google.accounts.oauth2.initTokenClient(
            {
              client_id:
                clientId,

              scope:
                "openid email profile",

              callback:
                async (
                  tokenResponse,
                ) => {
                  try {
                    if (
                      tokenResponse.error
                    ) {
                      reject(
                        new Error(
                          tokenResponse.error_description ||
                            tokenResponse.error,
                        ),
                      );

                      return;
                    }

                    const accessToken =
                      tokenResponse.access_token;

                    if (
                      !accessToken
                    ) {
                      reject(
                        new Error(
                          "Google no devolvió access_token.",
                        ),
                      );

                      return;
                    }

                    const profile =
                      await fetchGoogleUser(
                        accessToken,
                      );

                    resolve(
                      normalizeGoogleUser(
                        {
                          id:
                            profile.sub ||
                            "",

                          name:
                            profile.name ||
                            "Usuario Google",

                          email:
                            profile.email ||
                            "",

                          picture:
                            profile.picture ||
                            "",

                          accessToken,
                        },
                      ),
                    );
                  } catch (
                    error
                  ) {
                    reject(
                      error,
                    );
                  }
                },
            },
          );

        tokenClient.requestAccessToken();
      } catch (error) {
        reject(
          error ||
            new Error(
              "No se pudo iniciar sesión con Google.",
            ),
        );
      }
    },
  );
}

async function signInWithGoogleAndroid() {
  const clientId =
    getGoogleClientId();

  if (!clientId) {
    throw new Error(
      "Falta configurar VITE_GOOGLE_CLIENT_ID.",
    );
  }

  try {
    const {
      GoogleSignIn,
    } = await import(
      "@capawesome/capacitor-google-sign-in"
    );

    await GoogleSignIn.initialize({
      clientId,

      scopes: [
        "openid",
        "email",
        "profile",
      ],
    });

    const result =
      await GoogleSignIn.signIn();

    console.log(
      "[GOOGLE_ANDROID_RESULT]",
      result,
    );

    return normalizeGoogleUser({
      id:
        result.userId ||
        result.email ||
        "",

      name:
        result.displayName ||
        result.givenName ||
        "Usuario Google",

      email:
        result.email ||
        "",

      picture:
        result.imageUrl ||
        "",

      accessToken:
        result.accessToken ||
        "",

      idToken:
        result.idToken ||
        "",
    });
  } catch (error) {
    console.error(
      "[GOOGLE_ANDROID_ERROR]",
      error,
    );

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
  if (!isAndroidNative()) {
    return true;
  }

  try {
    const {
      GoogleSignIn,
    } = await import(
      "@capawesome/capacitor-google-sign-in"
    );

    await GoogleSignIn.signOut();

    return t1rue;
  } catch {
    return true;
  }
}