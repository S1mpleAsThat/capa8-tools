// src/services/ai/utils/timeout.js

export function withTimeout(
  promise,
  timeout = 12000,
) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "La solicitud de IA superó el tiempo máximo de espera.",
          ),
        );
      }, timeout);
    }),
  ]);
}