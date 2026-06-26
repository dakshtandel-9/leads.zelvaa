import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { getMsalInstance } from "./msalInstance";
import { loginRequest, tokenRequest } from "./authConfig";

/**
 * Returns a valid access token for the Leads API.
 * Tries silent acquisition first; falls back to an interactive popup if the
 * user needs to re-consent or sign in again.
 */
export async function getAccessToken(): Promise<string> {
  const pca = await getMsalInstance();
  const account = pca.getActiveAccount() ?? pca.getAllAccounts()[0];

  if (!account) {
    throw new Error("Not signed in.");
  }

  try {
    const result = await pca.acquireTokenSilent({ ...tokenRequest, account });
    return result.accessToken;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      const result = await pca.acquireTokenPopup(loginRequest);
      return result.accessToken;
    }
    throw err;
  }
}
