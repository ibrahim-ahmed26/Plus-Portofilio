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
import { s } from "../adminStyles";

const empty = { client: "", category: "", title: "", bg: "#1a1209" };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    const snap = await getDocs(collection(db, "projects"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "projects", editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "projects"), form);
    }
    setForm(empty);
    await loadProjects();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    await deleteDoc(doc(db, "projects", id));
    await loadProjects();
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      client: p.client,
      category: p.category,
      title: p.title,
      bg: p.bg,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* Header */}
      <h1 style={s.heading}>▲ Projects</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={s.form}>
        <h2 style={s.formTitle}>
          {editingId ? "✏️ Edit Project" : "➕ Add Project"}
        </h2>

        <div style={s.row}>
          <input
            style={s.input}
            placeholder="Client e.g. Pepsi"
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            required
          />
          <input
            style={s.input}
            placeholder="Category e.g. Social Media · ATL"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
        </div>

        <input
          style={s.input}
          placeholder="Project title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        {/* Background color picker */}
        <div style={s.colorRow}>
          <label style={s.colorLabel}>Card Background Color</label>
          <div style={s.colorInputWrapper}>
            <input
              type="color"
              value={form.bg}
              onChange={(e) => setForm({ ...form, bg: e.target.value })}
              style={s.colorPicker}
            />
            <input
              style={{ ...s.input, width: 120 }}
              placeholder="#1a1209"
              value={form.bg}
              onChange={(e) => setForm({ ...form, bg: e.target.value })}
            />
            {/* Live preview */}
            <div
              style={{
                ...s.colorPreview,
                background: form.bg,
              }}
            >
              <span style={s.colorPreviewText}>{form.client || "Preview"}</span>
            </div>
          </div>
        </div>

        <div style={s.formButtons}>
          <button type="submit" style={s.btnPrimary}>
            {editingId ? "Update Project" : "Add Project"}
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

      {/* Table */}
      {loading ? (
        <p style={s.empty}>Loading...</p>
      ) : projects.length === 0 ? (
        <p style={s.empty}>No projects yet. Add one above!</p>
      ) : (
        <div style={s.table}>
          <div style={s.tableHead}>
            <span style={{ flex: "0 0 40px" }}>BG</span>
            <span style={{ flex: 2 }}>Client</span>
            <span style={{ flex: 2 }}>Title</span>
            <span style={{ flex: 3 }}>Category</span>
            <span style={{ flex: "0 0 120px" }}>Actions</span>
          </div>

          {projects.map((p) => (
            <div key={p.id} style={s.tableRow}>
              {/* Color swatch */}
              <div
                style={{
                  flex: "0 0 40px",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: p.bg,
                  border: "2px solid #e2e8f0",
                }}
              />
              <span style={{ flex: 2, fontWeight: 700, color: "#1a1209" }}>
                {p.client}
              </span>
              <span style={{ flex: 2, fontWeight: 600, color: "#1a1209" }}>
                {p.title}
              </span>
              <span style={{ flex: 3, color: "#64748b", fontSize: 13 }}>
                {p.category}
              </span>
              <div style={{ flex: "0 0 120px", display: "flex", gap: 8 }}>
                <button style={s.btnEdit} onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button style={s.btnDelete} onClick={() => handleDelete(p.id)}>
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
