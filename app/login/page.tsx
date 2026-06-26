"use client";

import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest, isMsalConfigured } from "@/lib/authConfig";

export default function LoginPage() {
  const { instance } = useMsal();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    try {
      // Full-page redirect to the CIAM sign-in page. The result is handled by
      // handleRedirectPromise() in AuthProvider when the browser returns.
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("MSAL login error:", err);
      const e = err as { errorCode?: string; errorMessage?: string; message?: string };
      const parts = [e.errorCode, e.errorMessage ?? e.message].filter(Boolean);
      setError(parts.length ? parts.join(": ") : "Sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1>
          Zelvaa <span style={{ color: "var(--primary)" }}>Leads</span>
        </h1>
        <p className="sub">Sign in to continue.</p>

        {!isMsalConfigured && (
          <div className="alert alert-error">
            Azure login isn’t configured yet. Add your{" "}
            <code>NEXT_PUBLIC_AZURE_*</code> values to <code>.env.local</code>{" "}
            and restart the dev server.
          </div>
        )}

        {error && (
          <div
            className="alert alert-error"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {error}
          </div>
        )}

        <button
          className="btn"
          onClick={handleGoogleSignIn}
          disabled={loading || !isMsalConfigured}
          style={{ width: "100%", justifyContent: "center", gap: 10 }}
        >
          <GoogleIcon />
          {loading ? "Signing in…" : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.6 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
