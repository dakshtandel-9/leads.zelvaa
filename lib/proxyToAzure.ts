import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_LEADS_API_BASE_URL ??
  process.env.LEADS_API_BASE_URL ??
  "https://zelvaa-leads.azurewebsites.net/api";

/**
 * Forwards a request to the Azure Leads API from the Next.js server, passing
 * through the caller's Authorization header. Server-to-server, so CORS does
 * not apply — this lets the browser avoid cross-origin calls to Azure.
 */
export async function proxyToAzure(
  req: Request,
  upstreamPath: string,
  method: "GET" | "POST" | "PUT"
): Promise<NextResponse> {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json(
      { status: 0, message: "Missing Authorization header." },
      { status: 401 }
    );
  }

  let body: string | undefined;
  if (method !== "GET") {
    body = await req.text();
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BASE_URL}${upstreamPath}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body,
      cache: "no-store",
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 0,
        message: `Failed to reach upstream API: ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return NextResponse.json(data, { status: upstream.status });
}
