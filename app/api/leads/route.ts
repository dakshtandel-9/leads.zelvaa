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

// PUT /api/leads -> PUT /UpdateLead
export function PUT(req: Request) {
  return proxyToAzure(req, "/UpdateLead", "PUT");
}
