"use client";

import {
  CALL_STATUS_OPTIONS,
  LEAD_PRIORITY_OPTIONS,
  LEAD_STATUS_OPTIONS,
} from "@/lib/types";

export interface Filters {
  search: string;
  priority: string;
  callStatus: string;
  leadStatus: string;
}

export const EMPTY_FILTERS: Filters = {
  search: "",
  priority: "",
  callStatus: "",
  leadStatus: "",
};

export default function LeadFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="card filters">
      <div>
        <label>Search</label>
        <input
          placeholder="Name, business, phone, email…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>
      <div>
        <label>Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => set("priority", e.target.value)}
        >
          <option value="">All</option>
          {LEAD_PRIORITY_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Call Status</label>
        <select
          value={filters.callStatus}
          onChange={(e) => set("callStatus", e.target.value)}
        >
          <option value="">All</option>
          {CALL_STATUS_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Lead Status</label>
        <select
          value={filters.leadStatus}
          onChange={(e) => set("leadStatus", e.target.value)}
        >
          <option value="">All</option>
          {LEAD_STATUS_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <button
          className="btn btn-secondary"
          onClick={() => onChange(EMPTY_FILTERS)}
          style={{ width: "100%" }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
