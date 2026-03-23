"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const CLOUDINARY_CLOUD_NAME = "dajt9uo0p"; // 👈 replace
const CLOUDINARY_UPLOAD_PRESET = "logosBrand"; // 👈 replace

const empty = { name: "", logo: "" };

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  async function loadClients() {
    const snap = await getDocs(collection(db, "clients"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setClients(data);
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview instantly
    setLogoPreview(URL.createObjectURL(file));

    // Upload to Cloudinary
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("folder", "clients/logos");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data },
      );

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      setForm((prev) => ({ ...prev, logo: json.secure_url }));
      setLogoPreview(json.secure_url);
    } catch (err) {
      console.error("Logo upload failed:", err);
      alert("Logo upload failed. Please try again.");
      setLogoPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "clients", editingId), {
        name: form.name,
        logo: form.logo || "",
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "clients"), {
        name: form.name,
        logo: form.logo || "",
      });
    }
    setForm(empty);
    setLogoPreview(null);
    await loadClients();
  }

  async function handleDelete(client) {
    if (!confirm("Delete this client?")) return;
    await deleteDoc(doc(db, "clients", client.id));
    await loadClients();
  }

  function startEdit(c) {
    setEditingId(c.id);
    setForm({ name: c.name, logo: c.logo || "" });
    setLogoPreview(c.logo || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
    setLogoPreview(null);
  }

  return (
    <div>
      <h1 style={s.heading}>◈ Clients</h1>

      <form onSubmit={handleSubmit} style={s.form}>
        <h2 style={s.formTitle}>
          {editingId ? "✏️ Edit Client" : "➕ Add Client"}
        </h2>

        {/* Name + submit row */}
        <div style={s.row}>
          <input
            style={s.input}
            placeholder="Client name e.g. Pepsi"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <button type="submit" style={s.btnPrimary} disabled={uploading}>
            {uploading ? "Uploading…" : editingId ? "Update" : "Add Client"}
          </button>
          {editingId && (
            <button type="button" style={s.btnCancel} onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>

        {/* Logo upload row */}
        <div style={s.logoRow}>
          <label style={s.uploadLabel}>
            <span style={s.uploadText}>
              {uploading ? "Uploading logo…" : "Upload Logo (optional)"}
            </span>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleLogoChange}
              disabled={uploading}
            />
            <span style={uploading ? s.uploadBtnDisabled : s.uploadBtn}>
              {logoPreview ? "Change Logo" : "Choose File"}
            </span>
          </label>

          {/* Preview */}
          {logoPreview && !uploading && (
            <div style={s.previewWrap}>
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={80}
                height={40}
                style={s.previewImg}
                unoptimized={logoPreview.startsWith("blob:")}
              />
              <button
                type="button"
                style={s.removeLogo}
                onClick={() => {
                  setLogoPreview(null);
                  setForm((prev) => ({ ...prev, logo: "" }));
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Upload progress indicator */}
          {uploading && <span style={s.uploadingBadge}>⏳ Uploading…</span>}
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
              <div style={s.cardVisual}>
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={100}
                    height={44}
                    style={s.cardLogo}
                    unoptimized
                  />
                ) : (
                  <span style={s.cardName}>{c.name}</span>
                )}
              </div>
              {c.logo && <span style={s.cardSubName}>{c.name}</span>}
              <div style={s.cardActions}>
                <button style={s.btnEdit} onClick={() => startEdit(c)}>
                  Edit
                </button>
                <button style={s.btnDelete} onClick={() => handleDelete(c)}>
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
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1209",
    marginBottom: 4,
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
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  uploadLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },
  uploadText: {
    fontSize: 13,
    color: "#64748b",
  },
  uploadBtn: {
    background: "#f1f5f9",
    color: "#334155",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  uploadBtnDisabled: {
    background: "#f1f5f9",
    color: "#94a3b8",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "not-allowed",
    whiteSpace: "nowrap",
  },
  uploadingBadge: {
    fontSize: 12,
    color: "#e83e0b",
    fontWeight: 600,
  },
  previewWrap: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    padding: "6px 10px",
  },
  previewImg: {
    objectFit: "contain",
  },
  removeLogo: {
    position: "absolute",
    top: -8,
    right: -8,
    background: "#e11d48",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 20,
    height: 20,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
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
  count: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },
  countNum: { fontWeight: 800, color: "#e83e0b", fontSize: 16 },
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
    gap: 10,
    border: "1.5px solid #f1f5f9",
  },
  cardVisual: {
    minHeight: 48,
    display: "flex",
    alignItems: "center",
  },
  cardLogo: { objectFit: "contain", maxWidth: "100%" },
  cardName: { fontSize: 15, fontWeight: 700, color: "#1a1209" },
  cardSubName: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
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
