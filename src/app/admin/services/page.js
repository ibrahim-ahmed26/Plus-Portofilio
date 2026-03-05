"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { s } from "../adminStyles";
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
      tags: form.tags.split(",").map((t) => t.trim()), // "a, b" → ["a","b"]
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

  function startEdit(s) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      icon: s.icon,
      num: s.num,
      desc: s.desc,
      tags: s.tags.join(", "), // ["a","b"] → "a, b"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* Header */}
      <h1 style={s.heading}>✦ Services</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={s.form}>
        <h2 style={s.formTitle}>
          {editingId ? "✏️ Edit Service" : "➕ Add Service"}
        </h2>

        <div style={s.row}>
          <input
            style={s.input}
            placeholder="Number e.g. 01"
            value={form.num}
            onChange={(e) => setForm({ ...form, num: e.target.value })}
            required
          />
          <input
            style={s.input}
            placeholder="Icon e.g. ✦"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            required
          />
        </div>

        <input
          style={s.input}
          placeholder="Service name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          style={s.textarea}
          placeholder="Description"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          required
        />

        <input
          style={s.input}
          placeholder="Tags — comma separated: Logo, Branding, Print"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <div style={s.formButtons}>
          <button type="submit" style={s.btnPrimary}>
            {editingId ? "Update Service" : "Add Service"}
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
      ) : services.length === 0 ? (
        <p style={s.empty}>No services yet. Add one above!</p>
      ) : (
        <div style={s.table}>
          {/* Table header */}
          <div style={s.tableHead}>
            <span style={{ flex: "0 0 40px" }}>#</span>
            <span style={{ flex: "0 0 30px" }}>Icon</span>
            <span style={{ flex: 2 }}>Name</span>
            <span style={{ flex: 3 }}>Description</span>
            <span style={{ flex: 2 }}>Tags</span>
            <span style={{ flex: "0 0 120px" }}>Actions</span>
          </div>

          {/* Table rows */}
          {services.map((service) => (
            <div key={service.id} style={s.tableRow}>
              <span
                style={{ flex: "0 0 40px", color: "#e83e0b", fontWeight: 700 }}
              >
                {service.num}
              </span>
              <span style={{ flex: "0 0 30px" }}>{service.icon}</span>
              <span style={{ flex: 2, fontWeight: 600, color: "#1a1209" }}>
                {service.name}
              </span>
              <span
                style={{
                  flex: 3,
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {service.desc}
              </span>
              <div
                style={{ flex: 2, display: "flex", flexWrap: "wrap", gap: 4 }}
              >
                {service.tags?.map((t) => (
                  <span key={t} style={s.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ flex: "0 0 120px", display: "flex", gap: 8 }}>
                <button style={s.btnEdit} onClick={() => startEdit(service)}>
                  Edit
                </button>
                <button
                  style={s.btnDelete}
                  onClick={() => handleDelete(service.id)}
                >
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
