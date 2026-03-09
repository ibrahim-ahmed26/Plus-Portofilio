"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const empty = { name: "", icon: "", num: "", desc: "", tags: "" };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadServices() {
    const snap = await getDocs(collection(db, "services"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadServices();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()),
    };
    if (editingId) {
      await updateDoc(doc(db, "services", editingId), data);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "services"), data);
    }
    setForm(empty);
    await loadServices();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this service?")) return;
    await deleteDoc(doc(db, "services", id));
    await loadServices();
  }

  function startEdit(service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      icon: service.icon,
      num: service.num,
      desc: service.desc,
      tags: service.tags.join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        .sv-page { font-family: 'DM Sans', sans-serif; }

        /* ── Form ── */
        .sv-form {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sv-form-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1209;
          margin-bottom: 4px;
        }
        .sv-row {
          display: flex;
          gap: 12px;
        }
        .sv-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .sv-input:focus { border-color: #e83e0b; }
        .sv-textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          height: 80px;
          resize: vertical;
          transition: border-color 0.2s;
        }
        .sv-textarea:focus { border-color: #e83e0b; }
        .sv-form-buttons { display: flex; gap: 10px; }
        .sv-btn-primary {
          background: #e83e0b;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 22px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          flex: 1;
        }
        .sv-btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: none;
          border-radius: 8px;
          padding: 10px 18px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        /* ── Table wrapper ── */
        .sv-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .sv-table {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          min-width: 860px;
          width: 100%;
        }

        /* ── Table head ── */
        .sv-thead {
          display: grid;
          grid-template-columns: 50px 40px 160px 1fr 160px 150px;
          gap: 12px;
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

        /* ── Table row ── */
        .sv-trow {
          display: grid;
          grid-template-columns: 50px 40px 160px 1fr 160px 150px;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #f8f7f4;
          font-size: 14px;
          align-items: center;
        }
        .sv-trow:last-child { border-bottom: none; }
        .sv-trow:hover { background: #fafaf9; }

        .sv-num { color: #e83e0b; font-weight: 700; }
        .sv-icon { font-size: 18px; }
        .sv-name { font-weight: 700; color: #1a1209; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sv-desc { color: #64748b; font-size: 13px; line-height: 1.5; white-space: normal; }
        .sv-tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .sv-tag {
          background: #f1f5f9;
          color: #475569;
          border-radius: 99px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        .sv-actions { display: flex; gap: 8px; align-items: center; }
        .sv-btn-edit {
          background: #eff6ff;
          color: #2563eb;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .sv-btn-delete {
          background: #fff1f2;
          color: #e11d48;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .sv-empty {
          text-align: center;
          color: #94a3b8;
          padding: 40px 0;
        }

        /* ── Mobile cards ── */
        .sv-cards {
          display: none;
          flex-direction: column;
          gap: 12px;
        }
        .sv-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1.5px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sv-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sv-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sv-card-num {
          font-size: 13px;
          font-weight: 700;
          color: #e83e0b;
          font-style: italic;
        }
        .sv-card-icon { font-size: 20px; }
        .sv-card-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a1209;
        }
        .sv-card-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }
        .sv-card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .sv-card-actions { display: flex; gap: 8px; padding-top: 4px; }

        /* ── Responsive switch ── */
        @media (max-width: 768px) {
          .sv-table-wrapper { display: none; }   /* hide table */
          .sv-cards { display: flex; }            /* show cards */
          .sv-row { flex-direction: column; }
        }
      `}</style>

      <div className="sv-page">
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#1a1209",
            marginBottom: 28,
          }}
        >
          ✦ Services
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="sv-form">
          <h2 className="sv-form-title">
            {editingId ? "✏️ Edit Service" : "➕ Add Service"}
          </h2>

          <div className="sv-row">
            <input
              className="sv-input"
              placeholder="Number e.g. 01"
              value={form.num}
              onChange={(e) => setForm({ ...form, num: e.target.value })}
              required
            />
            <input
              className="sv-input"
              placeholder="Icon e.g. ✦"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              required
            />
          </div>

          <input
            className="sv-input"
            placeholder="Service name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            className="sv-textarea"
            placeholder="Description"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            required
          />

          <input
            className="sv-input"
            placeholder="Tags — comma separated: Logo, Branding, Print"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <div className="sv-form-buttons">
            <button type="submit" className="sv-btn-primary">
              {editingId ? "Update Service" : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                className="sv-btn-cancel"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <p className="sv-empty">Loading...</p>
        ) : services.length === 0 ? (
          <p className="sv-empty">No services yet. Add one above!</p>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="sv-table-wrapper">
              <div className="sv-table">
                <div className="sv-thead">
                  <span>#</span>
                  <span>Icon</span>
                  <span>Name</span>
                  <span>Description</span>
                  <span>Tags</span>
                  <span>Actions</span>
                </div>
                {services.map((service) => (
                  <div key={service.id} className="sv-trow">
                    <span className="sv-num">{service.num}</span>
                    <span className="sv-icon">{service.icon}</span>
                    <span className="sv-name">{service.name}</span>
                    <span className="sv-desc">{service.desc}</span>
                    <div className="sv-tags">
                      {service.tags?.map((t) => (
                        <span key={t} className="sv-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="sv-actions">
                      <button
                        className="sv-btn-edit"
                        onClick={() => startEdit(service)}
                      >
                        Edit
                      </button>
                      <button
                        className="sv-btn-delete"
                        onClick={() => handleDelete(service.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mobile cards ── */}
            <div className="sv-cards">
              {services.map((service) => (
                <div key={service.id} className="sv-card">
                  <div className="sv-card-top">
                    <div className="sv-card-meta">
                      <span className="sv-card-num">{service.num}</span>
                      <span className="sv-card-icon">{service.icon}</span>
                    </div>
                  </div>
                  <p className="sv-card-name">{service.name}</p>
                  <p className="sv-card-desc">{service.desc}</p>
                  <div className="sv-card-tags">
                    {service.tags?.map((t) => (
                      <span key={t} className="sv-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="sv-card-actions">
                    <button
                      className="sv-btn-edit"
                      onClick={() => startEdit(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="sv-btn-delete"
                      onClick={() => handleDelete(service.id)}
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
