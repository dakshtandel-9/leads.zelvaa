"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import LeadForm from "@/components/LeadForm";
import { getLeads, updateLead } from "@/services/leads.service";
import type { Lead, LeadPayload } from "@/lib/types";

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // No single-lead endpoint exists, so fetch the list and find by id.
        const data = await getLeads();
        const found = (Array.isArray(data) ? data : []).find(
          (l) => l.inquiry_id === id
        );
        if (!active) return;
        if (!found) {
          setError(`Lead #${id} not found.`);
        } else {
          setLead(found);
        }
      } catch (err) {
        if (active)
          setError(err instanceof Error ? err.message : "Failed to load lead.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(payload: LeadPayload) {
    setSubmitting(true);
    setError(null);
    try {
      await updateLead({ ...payload, inquiry_id: id });
      router.push("/leads");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopBar />
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="page-head">
          <h1>Edit Lead {Number.isFinite(id) ? `#${id}` : ""}</h1>
          <button className="btn btn-secondary" onClick={() => router.push("/leads")}>
            ← Back
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ padding: 24 }}>
          {loading ? (
            <div className="loading">Loading lead…</div>
          ) : lead ? (
            <LeadForm
              lead={lead}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/leads")}
            />
          ) : (
            !error && <div className="empty">Lead not found.</div>
          )}
        </div>
      </div>
    </>
  );
}
