"use client";

import type { Lead } from "@/lib/types";
import { dash, fmtDate, priorityClass, statusClass } from "@/lib/format";

export default function LeadTable({
  leads,
  onView,
  onEdit,
}: {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
}) {
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
            <th>Email</th>
            <th>Priority</th>
            <th>Call Status</th>
            <th>Follow Up</th>
            <th>Lead Person</th>
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
              <td>{dash(lead.email)}</td>
              <td>
                <span className={priorityClass(lead.lead_priority)}>
                  {dash(lead.lead_priority)}
                </span>
              </td>
              <td>{dash(lead.call_status)}</td>
              <td>{fmtDate(lead.follow_up_date)}</td>
              <td>{dash(lead.lead_person)}</td>
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
