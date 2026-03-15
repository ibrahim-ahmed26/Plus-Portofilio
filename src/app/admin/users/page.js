"use client";
import { useEffect, useState } from "react";

const SUPER_ADMIN = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEmail("");
      setPassword("");
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(uid) {
    if (!confirm("Permanently delete this user?")) return;
    const res = await fetch(`/api/admin/users/${uid}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) return alert(data.error);
    await loadUsers();
  }

  async function handleToggle(uid, disabled) {
    const res = await fetch(`/api/admin/users/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: !disabled }),
    });
    const data = await res.json();
    if (data.error) return alert(data.error);
    await loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      <h1 style={s.heading}>👤 Admin Users</h1>

      {/* Add user form */}
      <form onSubmit={handleAdd} style={s.form}>
        <h2 style={s.formTitle}>➕ Add New Admin</h2>
        <div style={s.row}>
          <input
            style={s.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={s.input}
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" style={s.btnPrimary} disabled={submitting}>
            {submitting ? "Adding..." : "Add User"}
          </button>
        </div>
        {error && <p style={s.error}>{error}</p>}
      </form>

      {/* Users list */}
      {loading ? (
        <p style={s.empty}>Loading...</p>
      ) : users.length === 0 ? (
        <p style={s.empty}>No users found.</p>
      ) : (
        <div style={s.tableWrapper}>
          <div style={s.table}>
            <div style={s.tableHead}>
              <span style={{ flex: 3 }}>Email</span>
              <span style={{ flex: 2 }}>Created</span>
              <span style={{ flex: 2 }}>Last Login</span>
              <span style={{ flex: 1 }}>Status</span>
              <span style={{ flex: "0 0 160px" }}>Actions</span>
            </div>

            {users
              .filter((u) => u.email !== SUPER_ADMIN) // 👈 add this
              .map((u) => (
                <div key={u.uid} style={s.tableRow}>
                  <span style={{ flex: 3, fontWeight: 600, color: "#1a1209" }}>
                    {u.email}
                  </span>
                  <span style={{ flex: 2, color: "#64748b", fontSize: 13 }}>
                    {formatDate(u.createdAt)}
                  </span>
                  <span style={{ flex: 2, color: "#64748b", fontSize: 13 }}>
                    {formatDate(u.lastLogin)}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        ...s.badge,
                        background: u.disabled ? "#fff1f2" : "#dcfce7",
                        color: u.disabled ? "#e11d48" : "#166534",
                      }}
                    >
                      {u.disabled ? "Disabled" : "Active"}
                    </span>
                  </span>
                  <div style={{ flex: "0 0 160px", display: "flex", gap: 8 }}>
                    <button
                      style={u.disabled ? s.btnEnable : s.btnDisable}
                      onClick={() => handleToggle(u.uid, u.disabled)}
                    >
                      {u.disabled ? "Enable" : "Disable"}
                    </button>
                    <button
                      style={s.btnDelete}
                      onClick={() => handleDelete(u.uid)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
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
    marginBottom: 32,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1209",
    marginBottom: 4,
  },
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    minWidth: 180,
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
  error: {
    fontSize: 13,
    color: "#e11d48",
    background: "#fff1f2",
    borderRadius: 8,
    padding: "10px 14px",
    margin: 0,
  },
  tableWrapper: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: 16,
  },
  table: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    minWidth: 600,
  },
  tableHead: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 20px",
    background: "#f8f7f4",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#94a3b8",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    borderBottom: "1px solid #f8f7f4",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  badge: {
    borderRadius: 99,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
  },
  btnDisable: {
    background: "#fef9c3",
    color: "#854d0e",
    border: "none",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnEnable: {
    background: "#dcfce7",
    color: "#166534",
    border: "none",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
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
  },
  superBadge: {
    fontSize: 11,
    color: "#e83e0b",
    fontWeight: 700,
    padding: "5px 8px",
    whiteSpace: "nowrap",
  },
  empty: { textAlign: "center", color: "#94a3b8", padding: "40px 0" },
};
