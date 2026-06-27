"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import LeadFilters, { EMPTY_FILTERS, type Filters } from "@/components/LeadFilters";
import LeadTable from "@/components/LeadTable";
import LeadModal from "@/components/LeadModal";
import LeadView from "@/components/LeadView";
import Pagination from "@/components/Pagination";
import { getLeads } from "@/services/leads.service";
import type { Lead } from "@/lib/types";

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewing, setViewing] = useState<Lead | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load leads.";
      setError(msg);
      if (msg.toLowerCase().includes("authenticat")) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const sorted = [...leads].sort((a, b) => b.inquiry_id - a.inquiry_id);
    return sorted.filter((l) => {
      if (filters.priority && l.lead_priority !== filters.priority) return false;
      if (filters.callStatus && l.call_status !== filters.callStatus) return false;
      if (filters.leadStatus && l.lead_status !== filters.leadStatus) return false;
      if (filters.leadPerson && l.lead_person !== filters.leadPerson) return false;
      if (filters.followUpDate && (l.follow_up_date ?? "").slice(0, 10) !== filters.followUpDate)
        return false;
      if (q) {
        const hay = [
          l.customer_name,
          l.business_name,
          l.phone_number,
          l.email,
          l.lead_person,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filters]);

  // Reset to first page when the result set changes size/shape.
  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <>
      <TopBar />
      <div className="container">
        <div className="page-head">
          <h1>Leads</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={load} disabled={loading}>
              Refresh
            </button>
            <button className="btn" onClick={() => router.push("/leads/create")}>
              + Create Lead
            </button>
          </div>
        </div>

        <LeadFilters filters={filters} onChange={setFilters} />

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          {loading ? (
            <div className="loading">Loading leads…</div>
          ) : (
            <>
              <LeadTable
                leads={paged}
                onView={(l) => setViewing(l)}
                onEdit={(l) => router.push(`/leads/edit/${l.inquiry_id}`)}
              />
              <Pagination
                page={page}
                pageSize={pageSize}
                total={filtered.length}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </div>
      </div>

      {viewing && (
        <LeadModal
          title={`Lead #${viewing.inquiry_id}`}
          onClose={() => setViewing(null)}
        >
          <LeadView lead={viewing} />
          <div className="form-actions" style={{ marginTop: 16 }}>
            <button
              className="btn"
              onClick={() => router.push(`/leads/edit/${viewing.inquiry_id}`)}
            >
              Edit Lead
            </button>
          </div>
        </LeadModal>
      )}
    </>
  );
}
