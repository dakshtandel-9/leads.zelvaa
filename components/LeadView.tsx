"use client";

import type { Lead } from "@/lib/types";
import { dash, fmtDate, priorityClass, statusClass } from "@/lib/format";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="detail-row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

export default function LeadView({ lead }: { lead: Lead }) {
  return (
    <div>
      <Row k="Inquiry ID" v={lead.inquiry_id} />
      <Row k="Inquiry Date" v={fmtDate(lead.inquiry_date)} />
      <Row k="Customer Name" v={dash(lead.customer_name)} />
      <Row k="Business Name" v={dash(lead.business_name)} />
      <Row k="Phone Number" v={dash(lead.phone_number)} />
      <Row k="Email" v={dash(lead.email)} />
      <Row
        k="Lead Priority"
        v={
          <span className={priorityClass(lead.lead_priority)}>
            {dash(lead.lead_priority)}
          </span>
        }
      />
      <Row k="Call Status" v={dash(lead.call_status)} />
      <Row k="Call / Message Detail" v={dash(lead.call_message_detail)} />
      <Row k="Follow Up Date" v={fmtDate(lead.follow_up_date)} />
      <Row k="Retry Count" v={dash(lead.retry_count)} />
      <Row k="Lead Person" v={dash(lead.lead_person)} />
      <Row k="Invoice Status" v={dash(lead.invoice_status)} />
      <Row k="Proposal Status" v={dash(lead.proposal_status)} />
      <Row
        k="Proposal Pricing"
        v={
          lead.praposal_pricing != null
            ? lead.praposal_pricing.toLocaleString()
            : "—"
        }
      />
      <Row
        k="Lead Status"
        v={
          <span className={statusClass(lead.lead_status)}>
            {dash(lead.lead_status)}
          </span>
        }
      />
      <Row k="Created At" v={fmtDate(lead.created_at)} />
      <Row k="Updated At" v={fmtDate(lead.updated_at)} />
    </div>
  );
}
