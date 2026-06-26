"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import LeadForm from "@/components/LeadForm";
import { createLead } from "@/services/leads.service";
import type { LeadPayload } from "@/lib/types";

export default function CreateLeadPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: LeadPayload) {
    setSubmitting(true);
    setError(null);
    try {
      await createLead(payload);
      router.push("/leads");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopBar />
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="page-head">
          <h1>Create Lead</h1>
          <button className="btn btn-secondary" onClick={() => router.push("/leads")}>
            ← Back
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ padding: 24 }}>
          <LeadForm
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/leads")}
          />
        </div>
      </div>
    </>
  );
}
