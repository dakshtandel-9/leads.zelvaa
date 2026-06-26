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
