# Zelvaa Leads Module

A Next.js (App Router + TypeScript) frontend for the Zelvaa Leads API.

## Features

- **Login** — paste your JWT; stored server-side in an httpOnly cookie (never exposed to client JS).
- **Lead list** — table with search, priority/call-status/lead-status filters, and pagination.
- **View lead** — full-detail modal.
- **Create / Edit lead** — validated forms with all dropdowns from the API spec.
- **Server proxy** — the browser calls `/api/*`; the server attaches the token and forwards to Azure. Avoids CORS and token leakage.

## Setup

```bash
cp .env.local.example .env.local   # already created with prod URL
npm install
npm run dev
```

Open http://localhost:3000 → you'll be redirected to `/login`. Paste a valid JWT to continue.

### Environment variables (`.env.local`)

| Var | Description |
| --- | --- |
| `LEADS_API_BASE_URL` | Base URL of the Leads API (default: production Azure URL). Set to `http://localhost:7071/api` for the local Functions backend. |
| `SESSION_SECRET` | Reserved for future cookie signing. |

## Architecture

| Browser route | Proxy route | Upstream API |
| --- | --- | --- |
| `GET /api/leads` | `app/api/leads/route.ts` | `GET /Leads` |
| `POST /api/leads` | `app/api/leads/route.ts` | `POST /CreateLead` |
| `PUT /api/leads` | `app/api/leads/route.ts` | `PUT /UpdateLead` |

`middleware.ts` redirects unauthenticated users to `/login`.

## Structure

```
app/
├── login/page.tsx
├── leads/
│   ├── page.tsx              # list + filters + pagination + view modal
│   ├── create/page.tsx
│   └── edit/[id]/page.tsx
├── api/
│   ├── leads/route.ts        # GET/POST/PUT proxy
│   └── auth/{login,logout}/route.ts
components/   LeadTable, LeadForm, LeadFilters, LeadView, LeadModal, Pagination, TopBar
services/     leads.service.ts (client → /api/*)
lib/          types, session (cookie), apiClient (server → Azure), format
```

## Notes

- The Edit page fetches the full list and finds the lead by `inquiry_id`, since the API has no single-lead GET endpoint. If a `GET /Leads/{id}` endpoint is added later, swap it in `app/leads/edit/[id]/page.tsx`.
- The API field is spelled `praposal_pricing` (as in the spec); kept as-is to match the backend.
# leads.zelvaa
