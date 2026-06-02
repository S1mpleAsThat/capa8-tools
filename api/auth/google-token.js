export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({
      error: "method_not_allowed",
      message: "Only POST is allowed.",
    });
    return;
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientSecret) {
    response.status(500).json({
      error: "missing_google_client_secret",
      message: "GOOGLE_CLIENT_SECRET is not configured.",
    });
    return;
  }

  const {
    code,
    clientId,
    redirectUri,
    codeVerifier,
  } = request.body || {};

  if (!code || !clientId || !redirectUri || !codeVerifier) {
    response.status(400).json({
      error: "missing_required_fields",
      message: "code, clientId, redirectUri and codeVerifier are required.",
    });
    return;
  }

  try {
    const body = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    });

    const googleResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      response.status(googleResponse.status).json({
        error: data.error || "google_token_error",
        message:
          data.error_description ||
          "Google could not exchange the authorization code.",
        details: data,
      });
      return;
    }

    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({
      error: "server_error",
      message:
        error?.message ||
        "Unexpected error while exchanging Google authorization code.",
    });
  }
}