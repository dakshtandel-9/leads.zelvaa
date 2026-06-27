import { proxyToAzure } from "@/lib/proxyToAzure";

// Same-origin proxy so the browser never makes a cross-origin (CORS) call to
// Azure. The MSAL access token rides in the Authorization header and is
// forwarded server-to-server.

// GET /api/leads -> GET /Leads
export function GET(req: Request) {
  return proxyToAzure(req, "/Leads", "GET");
}

// POST /api/leads -> POST /CreateLead
export function POST(req: Request) {
  return proxyToAzure(req, "/CreateLead", "POST");
}

// PUT /api/leads -> POST /UpdateLead
// NOTE: The API doc says PUT, but the deployed Azure Function only accepts POST
// on /UpdateLead (PUT returns 404). We keep PUT as our own client-facing verb
// and translate it to POST upstream.
export function PUT(req: Request) {
  return proxyToAzure(req, "/UpdateLead", "POST");
}
