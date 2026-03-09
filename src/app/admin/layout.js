"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const navItems = [
  { label: "Services", href: "/admin/services", icon: "✦" },
  { label: "Projects", href: "/admin/projects", icon: "▲" },
  { label: "Clients", href: "/admin/clients", icon: "◈" },
  { label: "Contacts", href: "/admin/contacts", icon: "✉" },
  { label: "Users", href: "/admin/users", icon: "👤" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });
    return () => unsub();
  }, [pathname, router]);

  async function handleSignOut() {
    await signOut(auth);
    router.push("/admin/login");
  }

  // Still checking auth state — show nothing to avoid flash
  if (user === undefined && !isLoginPage) return null;

  // Login page — render without sidebar
  if (isLoginPage) return <>{children}</>;

  // Not logged in — render nothing (redirect happens in useEffect)
  if (!user) return null;

  return (
    <>
      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #f8f7f4;
          font-family: 'DM Sans', sans-serif;
        }
        .admin-sidebar {
          width: 240px;
          background: #1a1209;
          display: flex;
          flex-direction: column;
          padding: 32px 0;
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          z-index: 100;
          transition: transform 0.3s ease;
        }
        .admin-main {
          margin-left: 240px;
          flex: 1;
          padding: 40px;
          min-height: 100vh;
          max-width: 100%;
        }
        .admin-topbar { display: none; }
        .admin-overlay { display: none; }

        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0; padding: 80px 20px 32px; }
          .admin-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 56px;
            background: #1a1209;
            padding: 0 20px;
            z-index: 99;
          }
          .admin-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99;
          }
        }
      `}</style>

      <div className="admin-shell">
        {/* Mobile topbar */}
        <div className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#e83e0b" }}>
              +
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(245,240,220,0.6)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(245,240,220,0.7)",
              fontSize: 20,
              padding: 4,
            }}
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <div className="admin-overlay" onClick={() => setMobileOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
          <div style={s.logo}>
            <span style={s.logoPlus}>+</span>
            <span style={s.logoText}>Admin</span>
          </div>

          <nav style={s.nav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  ...s.navItem,
                  ...(pathname === item.href ? s.navItemActive : {}),
                }}
              >
                <span style={s.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={s.sidebarFooter}>
            {/* Logged in user */}
            <p style={s.userEmail}>{user.email}</p>
            <button onClick={handleSignOut} style={s.signOutBtn}>
              Sign Out
            </button>
            <Link href="/" style={s.backLink}>
              ← Back to site
            </Link>
          </div>
        </aside>

        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}

const s = {
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 24px 32px",
    borderBottom: "1px solid rgba(245,240,220,0.08)",
    marginBottom: 24,
  },
  logoPlus: { fontSize: 28, fontWeight: 900, color: "#e83e0b", lineHeight: 1 },
  logoText: {
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
    color: "rgba(245,240,220,0.6)",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "0 12px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 14px",
    borderRadius: 8,
    color: "rgba(245,240,220,0.5)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  },
  navItemActive: { background: "rgba(232,62,11,0.12)", color: "#e83e0b" },
  navIcon: { fontSize: 14, width: 18, textAlign: "center" },
  sidebarFooter: {
    padding: "24px",
    borderTop: "1px solid rgba(245,240,220,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  userEmail: {
    fontSize: 11,
    color: "rgba(245,240,220,0.3)",
    letterSpacing: 0.5,
    wordBreak: "break-all",
  },
  signOutBtn: {
    background: "rgba(232,62,11,0.12)",
    color: "#e83e0b",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  },
  backLink: {
    fontSize: 12,
    color: "rgba(245,240,220,0.3)",
    textDecoration: "none",
    letterSpacing: 1,
  },
};
