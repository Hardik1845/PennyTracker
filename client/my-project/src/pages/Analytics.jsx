import React from "react";
import {useState, useEffect} from "react";
import axios from "axios";
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

// ============================================================
// Penny — Analytics Page (Static UI)
// Vanilla CSS only. No hooks. No state. No business logic.
// Charts use static SAMPLE_* data (Recharts required).
// ============================================================
const BASE_URL = "http://localhost:3000"
const GREEN = "#1f9d55";
const RED = "#d23b3b";
const PIE_COLORS = ["#0a2540", "#1f9d55", "#d23b3b", "#f5a524", "#3b82f6", "#8b5cf6", "#06b6d4"];

// const SAMPLE_STATS = { income: 7200, expense: 2379.45, savings: 4820.55, avgExpense: 132.19 };

const SAMPLE_TREND = [
  { label: "Apr 01", income: 1200, expense: 200 },
  { label: "Apr 08", income: 0,    expense: 350 },
  { label: "Apr 15", income: 1200, expense: 280 },
  { label: "Apr 22", income: 600,  expense: 480 },
  { label: "Apr 28", income: 4200, expense: 320 },
];

// const SAMPLE_CATEGORY = [
//   { name: "Rent",          value: 1200 },
//   { name: "Groceries",     value: 420 },
//   { name: "Entertainment", value: 180 },
//   { name: "Transport",     value: 220 },
//   { name: "Utilities",     value: 240 },
//   { name: "Food",          value: 119.45 },
// ];

const SAMPLE_MONTHLY = [
  { label: "Jan 26", income: 6800, expense: 2100 },
  { label: "Feb 26", income: 7000, expense: 2450 },
  { label: "Mar 26", income: 6900, expense: 2200 },
  { label: "Apr 26", income: 7200, expense: 2379 },
];

const fmt = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "INR" }).format(n);

const styles = `
  .pn-page { font-family: 'Inter', system-ui, sans-serif; color:#0a2540; padding: 28px; background:#f6f8fc; min-height:100vh; }
  .pg-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:26px; flex-wrap:wrap; gap:12px; }
  .pg-h1 { font-size:28px; font-weight:800; margin:0; letter-spacing:-.8px; }
  .pg-sub { font-size:13.5px; color:#6b7a96; margin:6px 0 0; }

  .pn-stats { display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; margin-bottom:20px; }
  .pn-stat { background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:14px; padding:18px; box-shadow:0 4px 14px rgba(10,37,64,0.04); transition: transform .2s, box-shadow .25s; }
  .pn-stat:hover { transform: translateY(-2px); box-shadow:0 12px 28px rgba(10,37,64,0.08); }
  .pn-stat-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#6b7a96; margin:0 0 8px; }
  .pn-stat-value { font-size:22px; font-weight:800; margin:0; letter-spacing:-.5px; }

  .pn-grid { display:grid; grid-template-columns: 2fr 1fr; gap:18px; margin-bottom:18px; }
  .pn-panel { background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:16px; padding:22px; box-shadow:0 4px 14px rgba(10,37,64,0.04); }
  .pn-panel-title { font-size:15px; font-weight:700; margin:0 0 16px; letter-spacing:-.2px; }

  @media (max-width:980px) {
    .pn-stats { grid-template-columns: repeat(2, 1fr); }
    .pn-grid { grid-template-columns: 1fr; }
  }
`;

const AnalyticsPage = () => {

  const [SAMPLE_STATS , setSampleStats] = useState({})
  const[SAMPLE_CATEGORY,setSampleCategory] = useState([]);
  useEffect(()=>{
async function getSampleStats(){
  const response = await axios.get(BASE_URL+"/analytics/stats");
  
  setSampleStats(response.data.stats)
  
}
getSampleStats();
  },[])


useEffect(()=>{
async function getCategoryData(){
  const response = await axios.get(BASE_URL+"/analytics/stats/category");
  
   const formatted = response.data.categoryData.map(item => ({
      name: item.name,
      value: Number(item.value) // ✅ FIX HERE
    }));

    setSampleCategory(formatted);
}
getCategoryData();
},[])




















  return (
    <div className="pn-page">
      <style>{styles}</style>

      <div className="pg-head">
        <div>
          <h1 className="pg-h1">Analytics</h1>
          <p className="pg-sub">Spending trends, category breakdown and monthly insights.</p>
        </div>
      </div>

      <section className="pn-stats">
        <div className="pn-stat"><p className="pn-stat-label">Income</p><p className="pn-stat-value" style={{ color: GREEN }}>{fmt(SAMPLE_STATS.income)}</p></div>
        <div className="pn-stat"><p className="pn-stat-label">Expenses</p><p className="pn-stat-value" style={{ color: RED }}>{fmt(SAMPLE_STATS.expense)}</p></div>
        <div className="pn-stat"><p className="pn-stat-label">Net Savings</p><p className="pn-stat-value">{fmt(SAMPLE_STATS.savings)}</p></div>
        <div className="pn-stat"><p className="pn-stat-label">Avg. Expense</p><p className="pn-stat-value">{fmt(SAMPLE_STATS.avgExpense)}</p></div>
      </section>

      <section className="pn-grid">
        <div className="pn-panel">
          <h3 className="pn-panel-title">Spending Trend</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={SAMPLE_TREND} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={RED} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={RED} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GREEN} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
                <XAxis dataKey="label" stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eef1f7", fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="income"  stroke={GREEN} strokeWidth={2} fill="url(#gInc)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke={RED}   strokeWidth={2} fill="url(#gExp)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pn-panel">
          <h3 className="pn-panel-title">By Category</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SAMPLE_CATEGORY} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {SAMPLE_CATEGORY.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 10, border: "1px solid #eef1f7", fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="pn-panel">
        <h3 className="pn-panel-title">Monthly Income vs Expense</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={SAMPLE_MONTHLY} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
              <XAxis dataKey="label" stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 10, border: "1px solid #eef1f7", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income"  fill={GREEN} radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill={RED}   radius={[6, 6, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
