"use client";

import { useState } from "react";
import {
  CALL_STATUS_OPTIONS,
  LEAD_PRIORITY_OPTIONS,
  LEAD_STATUS_OPTIONS,
  YES_NO_OPTIONS,
  type Lead,
  type LeadPayload,
} from "@/lib/types";

interface FormState {
  inquiry_date: string;
  customer_name: string;
  business_name: string;
  phone_number: string;
  email: string;
  lead_priority: string;
  call_status: string;
  lead_person: string;
  lead_status: string;
  call_message_detail: string;
  follow_up_date: string;
  retry_count: string;
  invoice_status: string;
  proposal_status: string;
  praposal_pricing: string;
}

function toDateInput(value: string | null | undefined): string {
  if (!value) return "";
  return value.length >= 10 ? value.slice(0, 10) : value;
}

function initialState(lead?: Lead): FormState {
  return {
    inquiry_date: toDateInput(lead?.inquiry_date) || todayISO(),
    customer_name: lead?.customer_name ?? "",
    business_name: lead?.business_name ?? "",
    phone_number: lead?.phone_number ?? "",
    email: lead?.email ?? "",
    lead_priority: lead?.lead_priority ?? "",
    call_status: lead?.call_status ?? "",
    lead_person: lead?.lead_person ?? "",
    lead_status: lead?.lead_status ?? "",
    call_message_detail: lead?.call_message_detail ?? "",
    follow_up_date: toDateInput(lead?.follow_up_date),
    retry_count: lead?.retry_count != null ? String(lead.retry_count) : "0",
    invoice_status: lead?.invoice_status ?? "No",
    proposal_status: lead?.proposal_status ?? "No",
    praposal_pricing:
      lead?.praposal_pricing != null ? String(lead.praposal_pricing) : "",
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LeadForm({
  lead,
  submitting,
  onSubmit,
  onCancel,
}: {
  lead?: Lead;
  submitting: boolean;
  onSubmit: (payload: LeadPayload) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(lead));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.inquiry_date) next.inquiry_date = "Inquiry date is required.";
    if (!form.phone_number.trim())
      next.phone_number = "Phone number is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: LeadPayload = {
      ...(lead ? { inquiry_id: lead.inquiry_id } : {}),
      inquiry_date: form.inquiry_date,
      phone_number: form.phone_number.trim(),
      email: form.email.trim() || null,
      customer_name: form.customer_name.trim() || null,
      business_name: form.business_name.trim() || null,
      lead_priority: form.lead_priority || null,
      call_status: form.call_status || null,
      call_message_detail: form.call_message_detail.trim() || null,
      follow_up_date: form.follow_up_date || null,
      retry_count: form.retry_count === "" ? 0 : Number(form.retry_count),
      lead_person: form.lead_person.trim() || null,
      invoice_status: form.invoice_status || null,
      proposal_status: form.proposal_status || null,
      praposal_pricing:
        form.praposal_pricing === "" ? null : Number(form.praposal_pricing),
      lead_status: form.lead_status || null,
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <div>
            <label>Inquiry Date *</label>
            <input
              type="date"
              value={form.inquiry_date}
              onChange={(e) => set("inquiry_date", e.target.value)}
            />
            {errors.inquiry_date && (
              <div className="field-error">{errors.inquiry_date}</div>
            )}
          </div>
          <div>
            <label>Phone Number *</label>
            <input
              value={form.phone_number}
              onChange={(e) => set("phone_number", e.target.value)}
              placeholder="7383878540"
            />
            {errors.phone_number && (
              <div className="field-error">{errors.phone_number}</div>
            )}
          </div>
          <div>
            <label>Customer Name</label>
            <input
              value={form.customer_name}
              onChange={(e) => set("customer_name", e.target.value)}
            />
          </div>
          <div>
            <label>Business Name</label>
            <input
              value={form.business_name}
              onChange={(e) => set("business_name", e.target.value)}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="test@example.com"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Lead Details</h3>
        <div className="form-grid">
          <div>
            <label>Lead Priority</label>
            <select
              value={form.lead_priority}
              onChange={(e) => set("lead_priority", e.target.value)}
            >
              <option value="">Select…</option>
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
              value={form.call_status}
              onChange={(e) => set("call_status", e.target.value)}
            >
              <option value="">Select…</option>
              {CALL_STATUS_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Lead Person</label>
            <input
              value={form.lead_person}
              onChange={(e) => set("lead_person", e.target.value)}
              placeholder="Aryan"
            />
          </div>
          <div>
            <label>Lead Status</label>
            <select
              value={form.lead_status}
              onChange={(e) => set("lead_status", e.target.value)}
            >
              <option value="">Select…</option>
              {LEAD_STATUS_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Notes</h3>
        <div>
          <label>Call / Message Detail</label>
          <textarea
            rows={3}
            value={form.call_message_detail}
            onChange={(e) => set("call_message_detail", e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Follow-up</h3>
        <div className="form-grid">
          <div>
            <label>Follow Up Date</label>
            <input
              type="date"
              value={form.follow_up_date}
              onChange={(e) => set("follow_up_date", e.target.value)}
            />
          </div>
          <div>
            <label>Retry Count</label>
            <input
              type="number"
              min={0}
              value={form.retry_count}
              onChange={(e) => set("retry_count", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Sales</h3>
        <div className="form-grid">
          <div>
            <label>Invoice Status</label>
            <select
              value={form.invoice_status}
              onChange={(e) => set("invoice_status", e.target.value)}
            >
              {YES_NO_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Proposal Status</label>
            <select
              value={form.proposal_status}
              onChange={(e) => set("proposal_status", e.target.value)}
            >
              {YES_NO_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Proposal Pricing</label>
            <input
              type="number"
              min={0}
              value={form.praposal_pricing}
              onChange={(e) => set("praposal_pricing", e.target.value)}
              placeholder="25000"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Saving…" : lead ? "Update Lead" : "Create Lead"}
        </button>
      </div>
    </form>
  );
}
