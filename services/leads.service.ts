import type { ApiWriteResponse, Lead, LeadPayload } from "@/lib/types";
import { getAccessToken } from "@/lib/getAccessToken";

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ??
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

// Browser -> our own Next.js proxy (same origin, no CORS). The proxy forwards
// to Azure server-to-server. We still attach the MSAL token here; the proxy
// passes it through.
async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`/api/leads${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function getLeads(): Promise<Lead[]> {
  const res = await apiFetch("", { method: "GET" });
  return handle<Lead[]>(res);
}

export async function createLead(
  payload: LeadPayload
): Promise<ApiWriteResponse> {
  const res = await apiFetch("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handle<ApiWriteResponse>(res);
}

export async function updateLead(
  payload: LeadPayload
): Promise<ApiWriteResponse> {
  const res = await apiFetch("", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return handle<ApiWriteResponse>(res);
}
