"use client";

import { useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import type { PublicClientApplication } from "@azure/msal-browser";
import { getMsalInstance } from "@/lib/msalInstance";
import { isMsalConfigured } from "@/lib/authConfig";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instance, setInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    if (!isMsalConfigured) return;
    let active = true;
    getMsalInstance().then((pca) => {
      if (active) setInstance(pca);
    });
    return () => {
      active = false;
    };
  }, []);

  // Not configured: render without the provider so the login page can show
  // the setup notice.
  if (!isMsalConfigured) {
    return <>{children}</>;
  }

  // Configured but the MSAL instance hasn't finished initializing yet. We must
  // NOT render the app here, or useMsal() would return a stub and login would
  // silently no-op.
  if (!instance) {
    return <div className="loading">Initializing sign-in…</div>;
  }

  return <MsalProvider instance={instance}>{children}</MsalProvider>;
}
