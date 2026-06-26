"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsAuthenticated } from "@azure/msal-react";
import { isMsalConfigured } from "@/lib/authConfig";

// Client-side gate. MSAL state lives in sessionStorage, so the redirect
// for unauthenticated users happens here rather than in middleware.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();

  const isLogin = pathname === "/login";

  useEffect(() => {
    if (!isMsalConfigured) return;
    if (!isAuthenticated && !isLogin) {
      router.replace("/login");
    }
    if (isAuthenticated && isLogin) {
      router.replace("/leads");
    }
  }, [isAuthenticated, isLogin, router]);

  // Avoid flashing protected content before the redirect kicks in.
  if (isMsalConfigured && !isAuthenticated && !isLogin) {
    return <div className="loading">Redirecting to sign in…</div>;
  }

  return <>{children}</>;
}
