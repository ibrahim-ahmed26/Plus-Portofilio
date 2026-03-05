"use client";
import { useState } from "react";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/services");
    } catch (err) {
      setError("Wrong email or password.");
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <span style={s.logoPlus}>+</span>
          <span style={s.logoText}>Admin</span>
        </div>

        <h1 style={s.heading}>Welcome back</h1>
        <p style={s.sub}>Sign in to manage your content</p>

        <form onSubmit={handleLogin} style={s.form}>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              style={s.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              style={s.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#1a1209",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
  },
  logoPlus: { fontSize: 28, fontWeight: 900, color: "#e83e0b" },
  logoText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#94a3b8",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heading: { fontSize: 24, fontWeight: 800, color: "#1a1209", marginBottom: 6 },
  sub: { fontSize: 14, color: "#94a3b8", marginBottom: 28 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#475569" },
  input: {
    padding: "11px 14px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  },
  error: {
    fontSize: 13,
    color: "#e11d48",
    background: "#fff1f2",
    borderRadius: 8,
    padding: "10px 14px",
    margin: 0,
  },
  btn: {
    background: "#e83e0b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 4,
  },
};
