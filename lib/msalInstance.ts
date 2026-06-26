import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

// Single shared MSAL instance. Created lazily on the client only.
let instance: PublicClientApplication | null = null;
let initPromise: Promise<PublicClientApplication> | null = null;

export function getMsalInstance(): Promise<PublicClientApplication> {
  if (instance) return Promise.resolve(instance);
  if (!initPromise) {
    const pca = new PublicClientApplication(msalConfig);
    initPromise = pca
      .initialize()
      // Process the response when returning from a redirect login. If there's
      // no redirect in progress this resolves to null.
      .then(() => pca.handleRedirectPromise())
      .then((result) => {
        if (result?.account) {
          pca.setActiveAccount(result.account);
        } else {
          // Restore the active account on a normal page load.
          const accounts = pca.getAllAccounts();
          if (accounts.length > 0 && !pca.getActiveAccount()) {
            pca.setActiveAccount(accounts[0]);
          }
        }
        instance = pca;
        return pca;
      });
  }
  return initPromise;
}
