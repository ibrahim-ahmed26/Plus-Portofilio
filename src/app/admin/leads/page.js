"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

function formatDate(ts) {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | new | contacted

  async function loadLeads() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "landing_leads"),
        orderBy("submittedAt", "desc"),
      );
      const snap = await getDocs(q);
      setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to load leads:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLeads();
  }, []);

  async function toggleContacted(lead) {
    const nextStatus = lead.status === "contacted" ? "new" : "contacted";
    await updateDoc(doc(db, "landing_leads", lead.id), { status: nextStatus });
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l)),
    );
  }

  async function handleDelete(id) {
    if (!confirm("Delete this lead?")) return;
    await deleteDoc(doc(db, "landing_leads", id));
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  const visibleLeads = leads.filter((l) => {
    if (filter === "all") return true;
    if (filter === "contacted") return l.status === "contacted";
    return l.status !== "contacted"; // "new"
  });

  return (
    <>
      <style>{`
        .ld-page { font-family: 'DM Sans', sans-serif; }

        .ld-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .ld-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .ld-filter-btn {
          background: #f1f5f9;
          color: #475569;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .ld-filter-btn-active {
          background: #e83e0b;
          color: #fff;
          border: 1.5px solid #e83e0b;
          border-radius: 8px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        /* ── Table wrapper ── */
        .ld-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .ld-table {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          min-width: 820px;
          width: 100%;
        }

        .ld-thead {
          display: grid;
          grid-template-columns: 90px 1fr 1.2fr 1fr 130px 130px;
          gap: 16px;
          padding: 12px 20px;
          background: #f8f7f4;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #94a3b8;
          border-bottom: 1px solid #f1f5f9;
          white-space: nowrap;
        }

        .ld-trow {
          display: grid;
          grid-template-columns: 90px 1fr 1.2fr 1fr 130px 130px;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f8f7f4;
          font-size: 14px;
          align-items: center;
        }
        .ld-trow:last-child { border-bottom: none; }
        .ld-trow:hover { background: #fafaf9; }

        .ld-name { font-weight: 700; color: #1a1209; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ld-sub { color: #94a3b8; font-size: 12px; margin-top: 2px; }
        .ld-cell { color: #64748b; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ld-date { color: #94a3b8; font-size: 12px; white-space: nowrap; }

        .ld-badge-new {
          background: #fff7ed;
          color: #e83e0b;
          border-radius: 99px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          display: inline-block;
        }
        .ld-badge-contacted {
          background: #f0fdf4;
          color: #16a34a;
          border-radius: 99px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          display: inline-block;
        }

        .ld-actions { display: flex; gap: 8px; align-items: center; }
        .ld-btn-toggle {
          background: #eff6ff;
          color: #2563eb;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .ld-btn-delete {
          background: #fff1f2;
          color: #e11d48;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .ld-empty { text-align: center; color: #94a3b8; padding: 40px 0; }

        /* ── Mobile cards ── */
        .ld-cards { display: none; flex-direction: column; gap: 12px; }
        .ld-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1.5px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ld-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .ld-card-name { font-size: 16px; font-weight: 700; color: #1a1209; }
        .ld-card-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 13px;
          color: #64748b;
          padding: 8px 0;
          border-top: 1px solid #f8f7f4;
        }
        .ld-card-label { font-weight: 600; color: #1a1209; white-space: nowrap; }
        .ld-card-value { text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ld-card-actions { display: flex; gap: 8px; padding-top: 10px; }
        .ld-card-actions button { flex: 1; }

        @media (max-width: 900px) {
          .ld-table-wrapper { display: none; }
          .ld-cards { display: flex; }
        }
      `}</style>

      <div className="ld-page">
        <div className="ld-header">
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1209" }}>
            ✦ Leads
          </h1>
          <div className="ld-filters">
            <button
              className={
                filter === "all" ? "ld-filter-btn-active" : "ld-filter-btn"
              }
              onClick={() => setFilter("all")}
            >
              All ({leads.length})
            </button>
            <button
              className={
                filter === "new" ? "ld-filter-btn-active" : "ld-filter-btn"
              }
              onClick={() => setFilter("new")}
            >
              New ({leads.filter((l) => l.status !== "contacted").length})
            </button>
            <button
              className={
                filter === "contacted"
                  ? "ld-filter-btn-active"
                  : "ld-filter-btn"
              }
              onClick={() => setFilter("contacted")}
            >
              Contacted ({leads.filter((l) => l.status === "contacted").length})
            </button>
          </div>
        </div>

        {loading ? (
          <p className="ld-empty">Loading...</p>
        ) : visibleLeads.length === 0 ? (
          <p className="ld-empty">No leads here yet.</p>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="ld-table-wrapper">
              <div className="ld-table">
                <div className="ld-thead">
                  <span>Status</span>
                  <span>Name</span>
                  <span>Contact</span>
                  <span>Service / Budget</span>
                  <span>Submitted</span>
                  <span>Actions</span>
                </div>
                {visibleLeads.map((lead) => (
                  <div key={lead.id} className="ld-trow">
                    <span
                      className={
                        lead.status === "contacted"
                          ? "ld-badge-contacted"
                          : "ld-badge-new"
                      }
                    >
                      {lead.status === "contacted" ? "Contacted" : "New"}
                    </span>
                    <div>
                      <div className="ld-name">{lead.name}</div>
                      {lead.company && (
                        <div className="ld-sub">{lead.company}</div>
                      )}
                    </div>
                    <div>
                      <div className="ld-cell">{lead.email}</div>
                      <div className="ld-sub">{lead.phone}</div>
                    </div>
                    <div>
                      <div className="ld-cell">{lead.service}</div>
                      <div className="ld-sub">{lead.budget}</div>
                    </div>
                    <span className="ld-date">
                      {formatDate(lead.submittedAt)}
                    </span>
                    <div className="ld-actions">
                      <button
                        className="ld-btn-toggle"
                        onClick={() => toggleContacted(lead)}
                      >
                        {lead.status === "contacted" ? "Mark New" : "Mark Done"}
                      </button>
                      <button
                        className="ld-btn-delete"
                        onClick={() => handleDelete(lead.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mobile cards ── */}
            <div className="ld-cards">
              {visibleLeads.map((lead) => (
                <div key={lead.id} className="ld-card">
                  <div className="ld-card-top">
                    <p className="ld-card-name">{lead.name}</p>
                    <span
                      className={
                        lead.status === "contacted"
                          ? "ld-badge-contacted"
                          : "ld-badge-new"
                      }
                    >
                      {lead.status === "contacted" ? "Contacted" : "New"}
                    </span>
                  </div>
                  <div className="ld-card-row">
                    <span className="ld-card-label">Phone</span>
                    <span className="ld-card-value">{lead.phone}</span>
                  </div>
                  <div className="ld-card-row">
                    <span className="ld-card-label">Email</span>
                    <span className="ld-card-value">{lead.email}</span>
                  </div>
                  {lead.company && (
                    <div className="ld-card-row">
                      <span className="ld-card-label">Company</span>
                      <span className="ld-card-value">{lead.company}</span>
                    </div>
                  )}
                  <div className="ld-card-row">
                    <span className="ld-card-label">Service</span>
                    <span className="ld-card-value">{lead.service}</span>
                  </div>
                  <div className="ld-card-row">
                    <span className="ld-card-label">Budget</span>
                    <span className="ld-card-value">{lead.budget}</span>
                  </div>
                  <div className="ld-card-row">
                    <span className="ld-card-label">Submitted</span>
                    <span className="ld-card-value">
                      {formatDate(lead.submittedAt)}
                    </span>
                  </div>
                  <div className="ld-card-actions">
                    <button
                      className="ld-btn-toggle"
                      onClick={() => toggleContacted(lead)}
                    >
                      {lead.status === "contacted" ? "Mark New" : "Mark Done"}
                    </button>
                    <button
                      className="ld-btn-delete"
                      onClick={() => handleDelete(lead.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
