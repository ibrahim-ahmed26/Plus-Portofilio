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

const empty = { name: "" };

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadClients() {
    const snap = await getDocs(collection(db, "clients"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setClients(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadClients();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "clients", editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "clients"), form);
    }
    setForm(empty);
    await loadClients();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this client?")) return;
    await deleteDoc(doc(db, "clients", id));
    await loadClients();
  }

  function startEdit(c) {
    setEditingId(c.id);
    setForm({ name: c.name });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <h1 style={s.heading}>◈ Clients</h1>
      <form onSubmit={handleSubmit} style={s.form}>
        <h2 style={s.formTitle}>
          {editingId ? "✏️ Edit Client" : "➕ Add Client"}
        </h2>

        <div style={s.row}>
          <input
            style={s.input}
            placeholder="Client name e.g. Pepsi"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            required
          />
          <button type="submit" style={s.btnPrimary}>
            {editingId ? "Update" : "Add Client"}
          </button>
          {editingId && (
            <button
              type="button"
              style={s.btnCancel}
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

      {/* Count */}
      {!loading && (
        <p style={s.count}>
          <span style={s.countNum}>{clients.length}</span> clients total
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <p style={s.empty}>Loading...</p>
      ) : clients.length === 0 ? (
        <p style={s.empty}>No clients yet. Add one above!</p>
      ) : (
        <div style={s.grid}>
          {clients.map((c) => (
            <div key={c.id} style={s.card}>
              <span style={s.cardName}>{c.name}</span>
              <div style={s.cardActions}>
                <button style={s.btnEdit} onClick={() => startEdit(c)}>
                  Edit
                </button>
                <button style={s.btnDelete} onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  heading: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1a1209",
    marginBottom: 28,
  },
  form: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1209",
    marginBottom: 12,
  },
  row: { display: "flex", gap: 12, alignItems: "center" },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  btnPrimary: {
    background: "#e83e0b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 22px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnCancel: {
    background: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  count: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 16,
  },
  countNum: {
    fontWeight: 800,
    color: "#e83e0b",
    fontSize: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 12,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    border: "1.5px solid #f1f5f9",
  },
  cardName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1209",
  },
  cardActions: { display: "flex", gap: 8 },
  btnEdit: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "none",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  btnDelete: {
    background: "#fff1f2",
    color: "#e11d48",
    border: "none",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  empty: { textAlign: "center", color: "#94a3b8", padding: "40px 0" },
};
