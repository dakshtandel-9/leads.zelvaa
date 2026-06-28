"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/lib/types";
import {
  dash,
  fmtDate,
  priorityClass,
  statusClass,
  callStatusClass,
  personClass,
} from "@/lib/format";

export default function LeadTable({
  leads,
  onView,
  onEdit,
}: {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
}) {
  const [openMsgId, setOpenMsgId] = useState<number | null>(null);

  // Close the message popover when clicking anywhere outside of it.
  useEffect(() => {
    if (openMsgId === null) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".msg-cell")) setOpenMsgId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMsgId]);

  if (leads.length === 0) {
    return <div className="empty">No leads match your filters.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Inquiry Date</th>
            <th>Customer</th>
            <th>Business</th>
            <th>Phone</th>
            <th>Priority</th>
            <th>Call Status</th>
            <th>Call Message Detail</th>
            <th>Follow Up</th>
            <th>Retry Count</th>
            <th>Lead Person</th>
            <th>Invoice Status</th>
            <th>Proposal Status</th>
            <th>Proposal Pricing</th>
            <th>Lead Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.inquiry_id}>
              <td>{lead.inquiry_id}</td>
              <td>{fmtDate(lead.inquiry_date)}</td>
              <td>{dash(lead.customer_name)}</td>
              <td>{dash(lead.business_name)}</td>
              <td>{dash(lead.phone_number)}</td>
              <td>
                <span className={priorityClass(lead.lead_priority)}>
                  {dash(lead.lead_priority)}
                </span>
              </td>
              <td>
                <span className={callStatusClass(lead.call_status)}>
                  {dash(lead.call_status)}
                </span>
              </td>
              <td>
                {lead.call_message_detail ? (
                  <div
                    className={
                      openMsgId === lead.inquiry_id
                        ? "msg-cell open"
                        : "msg-cell"
                    }
                    data-tip={lead.call_message_detail}
                  >
                    <span className="msg-text">{lead.call_message_detail}</span>
                    <button
                      type="button"
                      className="msg-info"
                      aria-label="Show full message"
                      onClick={() =>
                        setOpenMsgId((cur) =>
                          cur === lead.inquiry_id ? null : lead.inquiry_id
                        )
                      }
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  "—"
                )}
              </td>
              <td>{fmtDate(lead.follow_up_date)}</td>
              <td>{dash(lead.retry_count)}</td>
              <td>
                {lead.lead_person ? (
                  <span className={personClass(lead.lead_person)}>
                    {lead.lead_person}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td>{dash(lead.invoice_status)}</td>
              <td>{dash(lead.proposal_status)}</td>
              <td>{dash(lead.praposal_pricing)}</td>
              <td>
                <span className={statusClass(lead.lead_status)}>
                  {dash(lead.lead_status)}
                </span>
              </td>
              <td>
                <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                  <button className="btn-ghost" onClick={() => onView(lead)}>
                    View
                  </button>
                  <button className="btn-ghost" onClick={() => onEdit(lead)}>
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
