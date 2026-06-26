import type { Configuration, PopupRequest } from "@azure/msal-browser";

// All values come from NEXT_PUBLIC_* env vars so they are available in the browser.
const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID ?? "";
const authority =
  process.env.NEXT_PUBLIC_AUTHORITY ??
  "https://login.microsoftonline.com/common";
const redirectUri =
  process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const API_SCOPE =
  process.env.NEXT_PUBLIC_AZURE_BACKEND_SCOPE ?? `${clientId}/.default`;

// True only when the placeholders have been replaced with real values.
export const isMsalConfigured =
  !!clientId &&
  !clientId.startsWith("PASTE_") &&
  !authority.includes("PASTE_");

// CIAM (ciamlogin.com) is a non-standard authority host, so MSAL requires it
// to be explicitly trusted via knownAuthorities.
function authorityHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority,
    knownAuthorities: [authorityHost(authority)],
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

// Scopes requested at login. The backend scope yields an access token the
// Leads API will accept as a bearer token. "openid"/"profile" give us the
// user's identity for display.
export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", API_SCOPE],
  // Jump straight to Google. Requires Google configured as a social identity
  // provider in your CIAM user flow. Remove if you want the default picker.
  extraQueryParameters: { domain_hint: "google.com" },
};

// Scopes used when silently acquiring a token for API calls.
export const tokenRequest = {
  scopes: [API_SCOPE],
};
