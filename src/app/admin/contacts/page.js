"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  async function loadContacts() {
    const q = query(collection(db, "contacts"), orderBy("submittedAt", "desc"));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setContacts(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this submission?")) return;
    await deleteDoc(doc(db, "contacts", id));
    await loadContacts();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadContacts();
  }, []);

  function formatDate(ts) {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <style>{`
        .contacts-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
        }
        .contacts-stat {
          background: #fff;
          border-radius: 12px;
          padding: 16px 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          border: 1.5px solid #f1f5f9;
        }
        .stat-num { font-size: 28px; font-weight: 900; color: #e83e0b; }
        .stat-label { font-size: 12px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; }

        .contact-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1.5px solid #f1f5f9;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .card-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        .card-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: rgba(232,62,11,0.1);
          color: #e83e0b;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 800; flex-shrink: 0;
        }
        .card-name { font-size: 15px; font-weight: 700; color: #1a1209; margin: 0; }
        .card-email { font-size: 13px; color: #64748b; margin: 0; 
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
        }
        .card-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .service-badge {
          background: rgba(232,62,11,0.08);
          color: #e83e0b;
          border-radius: 99px;
          padding: 3px 12px;
          font-size: 12px;
          font-weight: 600;
        }
        .card-date { font-size: 12px; color: #94a3b8; }
        .btn-expand {
          background: #f8f7f4; color: #475569; border: none;
          border-radius: 6px; padding: 5px 12px; font-size: 12px;
          font-weight: 600; cursor: pointer;
        }
        .btn-delete {
          background: #fff1f2; color: #e11d48; border: none;
          border-radius: 6px; padding: 5px 12px; font-size: 12px;
          font-weight: 600; cursor: pointer;
        }
        .card-body {
          padding: 16px 20px 20px;
          border-top: 1px solid #f1f5f9;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .detail-item { display: flex; flex-direction: column; gap: 4px; }
        .detail-label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
        .detail-value { font-size: 14px; color: #1a1209; font-weight: 500; }
        .message-text {
          font-size: 14px; color: #475569; line-height: 1.7;
          background: #f8f7f4; border-radius: 10px;
          padding: 12px 16px; margin: 8px 0 0 0;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .contacts-stats { flex-direction: column; }
          .card-header { flex-direction: column; align-items: flex-start; }
          .card-right { width: 100%; justify-content: flex-start; }
          .card-email { max-width: 100%; }
          .details-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .details-grid { grid-template-columns: 1fr; }
          .service-badge { font-size: 11px; }
          .card-date { display: none; } /* shown in expanded details instead */
        }
      `}</style>

      <div>
        <h1 style={s.heading}>✉ Contact Submissions</h1>

        {/* Stats */}
        {!loading && (
          <div className="contacts-stats">
            <div className="contacts-stat">
              <span className="stat-num">{contacts.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="contacts-stat">
              <span className="stat-num">
                {
                  contacts.filter((c) => {
                    if (!c.submittedAt) return false;
                    const date = c.submittedAt.toDate
                      ? c.submittedAt.toDate()
                      : new Date(c.submittedAt);
                    return new Date() - date < 7 * 24 * 60 * 60 * 1000;
                  }).length
                }
              </span>
              <span className="stat-label">This Week</span>
            </div>
            <div className="contacts-stat">
              <span className="stat-num">
                {
                  [...new Set(contacts.map((c) => c.service).filter(Boolean))]
                    .length
                }
              </span>
              <span className="stat-label">Services Requested</span>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <p style={s.empty}>Loading...</p>
        ) : contacts.length === 0 ? (
          <p style={s.empty}>No submissions yet.</p>
        ) : (
          <div>
            {contacts.map((c) => (
              <div key={c.id} className="contact-card">
                <div className="card-header">
                  <div className="card-left">
                    <div className="card-avatar">
                      {c.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="card-name">{c.name}</p>
                      <p className="card-email">{c.email}</p>
                    </div>
                  </div>

                  <div className="card-right">
                    {c.service && (
                      <span className="service-badge">{c.service}</span>
                    )}
                    <span className="card-date">
                      {formatDate(c.submittedAt)}
                    </span>
                    <button
                      className="btn-expand"
                      onClick={() =>
                        setExpanded(expanded === c.id ? null : c.id)
                      }
                    >
                      {expanded === c.id ? "▲ Less" : "▼ More"}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {expanded === c.id && (
                  <div className="card-body">
                    <div className="details-grid">
                      {c.company && (
                        <div className="detail-item">
                          <span className="detail-label">Company</span>
                          <span className="detail-value">{c.company}</span>
                        </div>
                      )}
                      {c.phone && (
                        <div className="detail-item">
                          <span className="detail-label">Phone</span>
                          <span className="detail-value">{c.phone}</span>
                        </div>
                      )}
                      {c.service && (
                        <div className="detail-item">
                          <span className="detail-label">Service</span>
                          <span className="detail-value">{c.service}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Submitted</span>
                        <span className="detail-value">
                          {formatDate(c.submittedAt)}
                        </span>
                      </div>
                    </div>
                    {c.message && (
                      <div>
                        <span className="detail-label">Message</span>
                        <p className="message-text">{c.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const s = {
  heading: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1a1209",
    marginBottom: 24,
  },
  empty: { textAlign: "center", color: "#94a3b8", padding: "40px 0" },
};
