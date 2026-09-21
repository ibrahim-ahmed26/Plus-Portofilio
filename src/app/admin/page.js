"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function formatDuration(seconds) {
  if (!seconds || seconds < 1) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function dayKey(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalLeads: 0,
    avgDuration: 0,
    chartData: [],
    topSources: [],
  });

  useEffect(() => {
    async function load() {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const cutoff = Timestamp.fromDate(thirtyDaysAgo);

      const [visitsSnap, leadsSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, "landing_visits"),
            where("timestamp", ">=", cutoff),
          ),
        ),
        getDocs(
          query(
            collection(db, "landing_leads"),
            where("submittedAt", ">=", cutoff),
          ),
        ),
      ]);

      const visits = visitsSnap.docs.map((d) => d.data());
      const totalLeads = leadsSnap.size;
      const totalVisits = visits.length;

      // Average duration (only among visits that have it recorded)
      const durations = visits
        .map((v) => v.duration)
        .filter((d) => typeof d === "number" && d > 0);
      const avgDuration =
        durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0;

      // Build a 30-day bucket, filling in zero days
      const buckets = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        buckets[dayKey(d)] = 0;
      }
      visits.forEach((v) => {
        const ts = v.timestamp?.toDate
          ? v.timestamp.toDate()
          : new Date(v.timestamp);
        const key = dayKey(ts);
        if (key in buckets) buckets[key] += 1;
      });
      const chartData = Object.entries(buckets).map(([date, count]) => ({
        date: date.slice(5), // MM-DD
        visits: count,
      }));

      // Top referrer/source breakdown
      const sourceCounts = {};
      visits.forEach((v) => {
        const source =
          v.utm_source ||
          (v.referrer ? new URL(v.referrer).hostname : "Direct");
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });
      const topSources = Object.entries(sourceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([source, count]) => ({ source, count }));

      setStats({ totalVisits, totalLeads, avgDuration, chartData, topSources });
      setLoading(false);
    }

    load().catch((err) => {
      console.error("Dashboard load error:", err);
      setLoading(false);
    });
  }, []);

  const conversionRate =
    stats.totalVisits > 0
      ? ((stats.totalLeads / stats.totalVisits) * 100).toFixed(1)
      : "0.0";

  return (
    <>
      <style>{`
        .db-page { font-family: 'DM Sans', sans-serif; }
        .db-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 28px 0 32px;
        }
        .db-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .db-card-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #94a3b8;
        }
        .db-card-value {
          font-size: 30px;
          font-weight: 800;
          color: #1a1209;
        }
        .db-card-value.orange { color: #e83e0b; }
        .db-section {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          margin-bottom: 24px;
        }
        .db-section-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a1209;
          margin-bottom: 18px;
        }
        .db-sources {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .db-source-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: #f8f7f4;
          border-radius: 8px;
          font-size: 14px;
        }
        .db-source-name { font-weight: 600; color: #1a1209; }
        .db-source-count {
          background: #e83e0b;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 99px;
        }
        .db-empty { text-align: center; color: #94a3b8; padding: 40px 0; }

        @media (max-width: 900px) {
          .db-cards { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .db-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="db-page">
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1a1209",
            marginBottom: 8,
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 8 }}>
          Landing page performance — last 30 days.
        </p>

        {loading ? (
          <p className="db-empty">Loading analytics...</p>
        ) : (
          <>
            <div className="db-cards">
              <div className="db-card">
                <span className="db-card-label">Visitors</span>
                <span className="db-card-value">{stats.totalVisits}</span>
              </div>
              <div className="db-card">
                <span className="db-card-label">Leads</span>
                <span className="db-card-value orange">{stats.totalLeads}</span>
              </div>
              <div className="db-card">
                <span className="db-card-label">Conversion Rate</span>
                <span className="db-card-value">{conversionRate}%</span>
              </div>
              <div className="db-card">
                <span className="db-card-label">Avg. Time on Page</span>
                <span className="db-card-value">
                  {formatDuration(stats.avgDuration)}
                </span>
              </div>
            </div>

            <div className="db-section">
              <h2 className="db-section-title">Visits — Last 30 Days</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#e83e0b"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#e83e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#e83e0b"
                    strokeWidth={2}
                    fill="url(#visitsFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="db-section">
              <h2 className="db-section-title">Top Sources</h2>
              {stats.topSources.length === 0 ? (
                <p className="db-empty">No traffic data yet.</p>
              ) : (
                <div className="db-sources">
                  {stats.topSources.map((s) => (
                    <div key={s.source} className="db-source-row">
                      <span className="db-source-name">{s.source}</span>
                      <span className="db-source-count">{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
