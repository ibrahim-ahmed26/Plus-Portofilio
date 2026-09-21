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

const CLOUDINARY_CLOUD_NAME = "dajt9uo0p"; // 👈 same as clients — replace if different
const CLOUDINARY_UPLOAD_PRESET = "logosBrand"; // 👈 replace if you use a different preset for services

const empty = { name: "", icon: "", num: "", desc: "", tags: "", image: "" };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  async function loadServices() {
    const snap = await getDocs(collection(db, "services"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview instantly
    setImagePreview(URL.createObjectURL(file));

    // Upload to Cloudinary
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("folder", "services/images");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data },
      );

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      setForm((prev) => ({ ...prev, image: json.secure_url }));
      setImagePreview(json.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  }

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
    setImagePreview(null);
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
      image: service.image || "",
    });
    setImagePreview(service.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
    setImagePreview(null);
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

        /* ── Image upload row ── */
        .sv-image-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .sv-upload-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .sv-upload-text {
          font-size: 13px;
          color: #64748b;
        }
        .sv-upload-btn {
          background: #f1f5f9;
          color: #334155;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .sv-upload-btn-disabled {
          background: #f1f5f9;
          color: #94a3b8;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: not-allowed;
          white-space: nowrap;
        }
        .sv-uploading-badge {
          font-size: 12px;
          color: #e83e0b;
          font-weight: 600;
        }
        .sv-preview-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 10px;
        }
        .sv-remove-image {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e11d48;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* ── Thumbnails in table/cards ── */
        .sv-image-thumb {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          border: 1.5px solid #e2e8f0;
          background: #f8f7f4;
          flex-shrink: 0;
        }
        .sv-image-thumb-placeholder {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          border: 1.5px dashed #e2e8f0;
          background: #f8f7f4;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #94a3b8;
          text-align: center;
        }

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
        .sv-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          min-width: 940px;
          width: 100%;
        }

        /* ── Table head ── */
        .sv-thead {
          display: grid;
          grid-template-columns: 50px 40px 64px 150px 1fr 150px 150px;
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
          grid-template-columns: 50px 40px 64px 150px 1fr 150px 150px;
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

          {/* Image upload row */}
          <div className="sv-image-row">
            <label className="sv-upload-label">
              <span className="sv-upload-text">
                {uploading ? "Uploading image…" : "Upload Image (optional)"}
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={uploading}
              />
              <span
                className={
                  uploading ? "sv-upload-btn-disabled" : "sv-upload-btn"
                }
              >
                {imagePreview ? "Change Image" : "Choose File"}
              </span>
            </label>

            {/* Preview */}
            {imagePreview && !uploading && (
              <div className="sv-preview-wrap">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  width={80}
                  height={56}
                  style={{ objectFit: "cover", borderRadius: 6 }}
                  unoptimized={imagePreview.startsWith("blob:")}
                />
                <button
                  type="button"
                  className="sv-remove-image"
                  onClick={() => {
                    setImagePreview(null);
                    setForm((prev) => ({ ...prev, image: "" }));
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Upload progress indicator */}
            {uploading && (
              <span className="sv-uploading-badge">⏳ Uploading…</span>
            )}
          </div>

          <div className="sv-form-buttons">
            <button
              type="submit"
              className="sv-btn-primary"
              disabled={uploading}
            >
              {uploading
                ? "Uploading…"
                : editingId
                  ? "Update Service"
                  : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                className="sv-btn-cancel"
                onClick={cancelEdit}
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
                  <span>Image</span>
                  <span>Name</span>
                  <span>Description</span>
                  <span>Tags</span>
                  <span>Actions</span>
                </div>
                {services.map((service) => (
                  <div key={service.id} className="sv-trow">
                    <span className="sv-num">{service.num}</span>
                    <span className="sv-icon">{service.icon}</span>
                    <span>
                      {service.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={service.image}
                          alt={service.name}
                          className="sv-image-thumb"
                        />
                      ) : (
                        <div className="sv-image-thumb-placeholder">—</div>
                      )}
                    </span>
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
                    {service.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.image}
                        alt={service.name}
                        className="sv-image-thumb"
                      />
                    ) : null}
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
