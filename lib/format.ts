// Display helpers shared across components.

export function fmtDate(value: string | null | undefined): string {
  if (!value) return "—";
  // Accept "2026-06-25" or full ISO timestamps.
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function fmtDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  // Accept "2026-06-19 13:43:16.740000" or ISO timestamps.
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dash(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function priorityClass(p: string | null | undefined): string {
  switch ((p ?? "").toLowerCase()) {
    case "high":
      return "badge badge-high";
    case "medium":
      return "badge badge-medium";
    case "low":
      return "badge badge-low";
    default:
      return "badge badge-default";
  }
}

export function statusClass(s: string | null | undefined): string {
  const key = (s ?? "").replace(/\s+/g, "");
  const known = [
    "New",
    "FollowUp",
    "Converted",
    "Closed",
    "Lost",
    "NotInterested",
  ];
  return known.includes(key) ? `badge status-${key}` : "badge badge-default";
}

export function callStatusClass(s: string | null | undefined): string {
  const key = (s ?? "").replace(/\s+/g, "");
  const known = [
    "Answered",
    "Unanswered",
    "Busy",
    "NoResponse",
    "Interested",
    "NotInterested",
  ];
  return known.includes(key) ? `badge call-${key}` : "badge badge-default";
}

// Lead person names are dynamic, so derive a stable color from the name by
// hashing it into one of N preset palette slots. Same name -> same color.
const PERSON_PALETTE_SIZE = 8;

export function personClass(name: string | null | undefined): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "badge badge-default";
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash * 31 + trimmed.charCodeAt(i)) | 0;
  }
  const slot = Math.abs(hash) % PERSON_PALETTE_SIZE;
  return `badge person-${slot}`;
}
