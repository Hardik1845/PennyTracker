import React, { useMemo, useState,useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
const NAVY = "#0a2540";
const GREEN = "#1f9d55";
const RED = "#d23b3b";
const AMBER = "#f5a524";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const styles = `
*{font-family: 'Inter', system-ui, sans-serif;}
  .bg-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:26px; }
  .bg-h1 { font-size:28px; font-weight:800; margin-left:0; text-align:center letter-spacing:-0.8px; color:${NAVY};  }
  .bg-sub { font-size:13.5px; color:#6b7a96; margin:6px 0 0; }
  .bg-cta { display:inline-flex; align-items:center; gap:8px; padding:11px 18px; background:${NAVY}; color:#fff; border:none; border-radius:11px; font-size:13.5px; font-weight:700; cursor:pointer; box-shadow:0 8px 20px rgba(10,37,64,0.22); transition:transform .15s, box-shadow .2s, background .2s; }
  .bg-cta:hover { transform:translateY(-1px); background:#143a66; box-shadow:0 12px 26px rgba(10,37,64,0.28); }

  .bg-toolbar { display:flex; flex-wrap:wrap; gap:10px; padding:14px; background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:14px; box-shadow:0 4px 14px rgba(10,37,64,0.04); margin-bottom:20px; }
  .bg-select { appearance:none; background:#f4f6fb url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7a96' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") no-repeat right 12px center; padding:9px 34px 9px 14px; border:1px solid #e6ebf3; border-radius:9px; font-size:13px; color:${NAVY}; font-weight:600; cursor:pointer; outline:none; transition:border-color .15s, background-color .15s; }
  .bg-select:hover { border-color:#c8d3e3; }
  .bg-select:focus { border-color:${NAVY}; }

  .bg-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:22px; }
  .bg-stat { background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:16px; padding:20px; box-shadow:0 4px 14px rgba(10,37,64,0.04); transition:transform .2s, box-shadow .25s; position:relative; overflow:hidden; }
  .bg-stat:hover { transform:translateY(-2px); box-shadow:0 14px 30px rgba(10,37,64,0.08); }
  .bg-stat-icon { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px; }
  .bg-stat-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#6b7a96; margin:0 0 6px; }
  .bg-stat-value { font-size:24px; font-weight:800; margin:0; letter-spacing:-0.6px; color:${NAVY}; }

  .bg-section-head { display:flex; align-items:center; justify-content:space-between; margin:8px 0 14px; }
  .bg-section-title { font-size:16px; font-weight:700; color:${NAVY}; margin:0; letter-spacing:-0.2px; }
  .bg-section-meta { font-size:12.5px; color:#6b7a96; }

  .bg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:24px; }

  .bg-card { background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:16px; padding:20px; box-shadow:0 4px 14px rgba(10,37,64,0.04); transition:transform .2s, box-shadow .25s; display:flex; flex-direction:column; gap:14px; }
  .bg-card:hover { transform:translateY(-3px); box-shadow:0 16px 34px rgba(10,37,64,0.09); }
  .bg-card-top { display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .bg-cat { display:flex; align-items:center; gap:11px; }
  .bg-cat-icon { width:40px; height:40px; border-radius:11px; background:#f1f4fa; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .bg-cat-name { font-size:15.5px; font-weight:700; color:${NAVY}; margin:0; letter-spacing:-0.2px; }
  .bg-cat-period { font-size:11.5px; color:#9aa8c2; margin:2px 0 0; font-weight:500; }

  .bg-badge { font-size:10.5px; font-weight:700; padding:5px 10px; border-radius:999px; text-transform:uppercase; letter-spacing:.6px; }
  .bg-badge.ok    { background:rgba(31,157,85,0.10); color:${GREEN}; }
  .bg-badge.warn  { background:rgba(245,165,36,0.14); color:#b87a00; }
  .bg-badge.over  { background:rgba(210,59,59,0.10); color:${RED}; }

  .bg-amounts { display:flex; justify-content:space-between; gap:8px; padding:10px 0 0; border-top:1px dashed #eef1f7; }
  .bg-amt { display:flex; flex-direction:column; gap:3px; }
  .bg-amt-label { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:#9aa8c2; }
  .bg-amt-value { font-size:14px; font-weight:700; color:${NAVY}; }
  .bg-amt-value.neg { color:${RED}; }

  .bg-progress-wrap { }
  .bg-progress-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:12px; color:#6b7a96; font-weight:600; }
  .bg-progress { height:10px; background:#eef1f7; border-radius:999px; overflow:hidden; position:relative; }
  .bg-progress-bar { height:100%; border-radius:999px; transition:width 1s cubic-bezier(.22,1,.36,1); background:linear-gradient(90deg, ${GREEN}, #2bbd6a); }
  .bg-progress-bar.warn { background:linear-gradient(90deg, ${AMBER}, #ffb84d); }
  .bg-progress-bar.over { background:linear-gradient(90deg, ${RED}, #ff6b6b); box-shadow:0 0 0 1px rgba(210,59,59,0.3) inset; }

  .bg-warn-row { display:flex; align-items:center; gap:6px; font-size:12px; color:${RED}; font-weight:700; }

  /* Insights */
  .bg-insights { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
  .bg-insight { display:flex; gap:12px; padding:16px; background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:14px; box-shadow:0 4px 14px rgba(10,37,64,0.04); transition:transform .2s; }
  .bg-insight:hover { transform:translateY(-2px); }
  .bg-insight-icon { width:36px; height:36px; min-width:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; }
  .bg-insight-icon.ok    { background:rgba(31,157,85,0.10); }
  .bg-insight-icon.warn  { background:rgba(245,165,36,0.14); }
  .bg-insight-icon.danger{ background:rgba(210,59,59,0.10); }
  .bg-insight-icon.info  { background:rgba(59,130,246,0.10); }
  .bg-insight-text { font-size:13.5px; color:#3a4a68; line-height:1.5; }

  /* Charts */
  .bg-charts { display:grid; grid-template-columns:1.2fr 1fr; gap:16px; margin-top:22px; }
  .bg-panel { background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:16px; padding:22px; box-shadow:0 4px 14px rgba(10,37,64,0.04); }
  .bg-panel-title { font-size:15px; font-weight:700; color:${NAVY}; margin:0 0 4px; letter-spacing:-0.2px; }
  .bg-panel-sub { font-size:12px; color:#9aa8c2; margin:0 0 16px; }

  /* Modal */
  .bg-overlay { position:fixed; inset:0; background:rgba(10,37,64,0.45); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px; animation:bg-fade .2s ease-out; }
  @keyframes bg-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes bg-pop  { from { opacity:0; transform:translateY(8px) scale(.98) } to { opacity:1; transform:translateY(0) scale(1) } }
  .bg-modal { background:#fff; border-radius:18px; padding:26px; width:100%; max-width:440px; box-shadow:0 30px 60px rgba(10,37,64,0.30); animation:bg-pop .25s cubic-bezier(.22,1,.36,1); }
  .bg-modal h3 { margin:0 0 6px; font-size:19px; color:${NAVY}; letter-spacing:-0.4px; }
  .bg-modal p  { margin:0 0 18px; font-size:13px; color:#6b7a96; }
  .bg-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
  .bg-field label { font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:#6b7a96; }
  .bg-input, .bg-modal .bg-select { width:100%; padding:11px 14px; border:1px solid #e6ebf3; border-radius:10px; font-size:13.5px; color:${NAVY}; font-weight:500; background-color:#f9fafd; outline:none; transition:border-color .15s, background-color .15s; }
  .bg-input:focus { border-color:${NAVY}; background:#fff; }
  .bg-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:8px; }
  .bg-btn { padding:10px 18px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; border:none; transition:transform .15s, background .2s; }
  .bg-btn.ghost   { background:#f1f4fa; color:${NAVY}; }
  .bg-btn.ghost:hover { background:#e6ebf3; }
  .bg-btn.primary { background:${NAVY}; color:#fff; box-shadow:0 6px 16px rgba(10,37,64,0.22); }
  .bg-btn.primary:hover { background:#143a66; transform:translateY(-1px); }

  @media (max-width: 1100px) {
    .bg-grid    { grid-template-columns:repeat(2,1fr); }
    .bg-stats   { grid-template-columns:repeat(2,1fr); }
    .bg-charts  { grid-template-columns:1fr; }
  }
  @media (max-width: 640px) {
    .bg-grid    { grid-template-columns:1fr; }
    .bg-insights{ grid-template-columns:1fr; }
  }
`;

const BASE_URL = "http://localhost:3000"

const fmt = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
// const categories = [
//     {id:1, category:"Food"},
//       {id:2, category:"Entertainment"},
//       {id:3, category:"Shopping"},

    
// ]

   


// const BUDGETS = [
//   { id: 1, category: "Food",          icon: "🍽️", budget: 5000,  spent: 4200, period: "Monthly" ,month_val:5,year_val:2026 },
//   { id: 2, category: "Travel",        icon: "✈️", budget: 4000,  spent: 1850, period: "Monthly",month_val:6 ,year_val:2026},
//   { id: 3, category: "Entertainment", icon: "🎬", budget: 2000,  spent: 3200, period: "Monthly" },
//   { id: 4, category: "Utilities",     icon: "💡", budget: 3000,  spent: 2100, period: "Monthly" },
//   { id: 5, category: "Shopping",      icon: "🛍️", budget: 4000,  spent: 4600, period: "Monthly" },
//   { id: 6, category: "Rent",          icon: "🏠", budget: 7000,  spent: 7000, period: "Monthly" },
// ];

const INSIGHTS = [
  { icon: "📈", tone: "warn",   text: "You spent 32% more on Food this month compared to last month." },
  { icon: "⚠️", tone: "danger", text: "Entertainment budget exceeded for 2 consecutive months." },
  { icon: "✅", tone: "ok",     text: "Utilities spending is stable compared to last month." },
  { icon: "💡", tone: "info",   text: "Reducing dining expenses by ₹2,000 could improve savings by 15%." },
];

const TREND = [
  { label: "Jun", utilization: 62 },
  { label: "Jul", utilization: 71 },
  { label: "Aug", utilization: 68 },
  { label: "Sep", utilization: 79 },
  { label: "Oct", utilization: 84 },
  { label: "Nov", utilization: 92 },
];



const statusFor = (pct) => {
  if (pct > 100) return { label: "Exceeded", cls: "over" };
  if (pct >= 70) return { label: "Near Limit", cls: "warn" };
  return { label: "On Track", cls: "ok" };
};

const Budgets = () => {
  const[BUDGETS,setBudgets] = useState([])
  const[categories,setCategories]= useState([])
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const[monthFilter,setMonthFilter] = useState(new Date().getMonth()+1);
  const[yearFilter,setYearFilter] = useState(new Date().getFullYear())

  useEffect(()=>{
   async function getUserBudgets(){
     const request = await axios.get(BASE_URL+"/api/budgets/dashboard");
    
    setBudgets(request.data.data);
    console.log(request.data.data);
   }
   getUserBudgets();
   
   
  },[])
  useEffect(()=>{
    async function getCategories(){
      const request = await axios.get(BASE_URL+"/categories");
      setCategories(request.data.data);

    }
    getCategories()
  })

  const totals = useMemo(() => {
    const total = BUDGETS.reduce((s, b) => s + Number(b.budget), 0);
    const spent = BUDGETS.reduce((s, b) => s + Number(b.spent), 0);
    const exceeded = BUDGETS.filter((b) => b.spent > b.budget).length;
    return { total, spent, remaining: total - spent, exceeded };
  });

  const filtered = useMemo(() => {
    return BUDGETS.filter((b) => {
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      const pct = (b.spent / b.budget) * 100;
      const s = statusFor(pct).cls;
      if (statusFilter === "ok"   && s !== "ok")   return false;
      if (statusFilter === "warn" && s !== "warn") return false;
      if (statusFilter === "over" && s !== "over") return false;
      if(monthFilter!=b.month_val) return false;
      if(yearFilter != b.year_val) return false;
      return true;
    });
  }, [statusFilter, categoryFilter,monthFilter,yearFilter]);

  const chartData = BUDGETS.map((b) => ({
    name: b.category,
    Budget: b.budget,
    Actual: b.spent,
  }));

  return (
    <div>
      <style>{styles}</style>

      <div className="bg-head">
        <div>
          <h1 className="bg-h1">Budgets</h1>
          <p className="bg-sub">Track category-wise spending limits and manage your financial goals.</p>
        </div>
        <button className="bg-cta" onClick={() => setShowModal(true)}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Create Budget
        </button>
      </div>

      <div className="bg-toolbar">
        <select className="bg-select"  value={monthFilter}  onChange={(event)=>{setMonthFilter(event.target.value)}}>
          <option value="1">January</option>
           <option value="2">February</option>
            <option value="3">March</option>
             <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="11">November</option>
          <option value="10">October</option>
          <option value="9">September</option>
        </select>
        <select className="bg-select"  value={yearFilter} onChange={(event)=>{setYearFilter(event.target.value)}}>
          <option>2026</option><option>2025</option>
        </select>
        <select className="bg-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((b) => <option key={b.id} value={b.category}>{b.category}</option>)}
        </select>
        <select className="bg-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="ok">On Track</option>
          <option value="warn">Near Limit</option>
          <option value="over">Exceeded</option>
        </select>
      </div>

      {/* Summary cards */}
      <section className="bg-stats">
        <div className="bg-stat">
          <div className="bg-stat-icon" style={{ background: "rgba(10,37,64,0.08)" }}>💰</div>
          <p className="bg-stat-label">Total Budget</p>
          <p className="bg-stat-value">{fmt(totals.total)}</p>
        </div>
        <div className="bg-stat">
          <div className="bg-stat-icon" style={{ background: "rgba(59,130,246,0.10)" }}>💳</div>
          <p className="bg-stat-label">Total Spent</p>
          <p className="bg-stat-value">{fmt(totals.spent)}</p>
        </div>
        <div className="bg-stat">
          <div className="bg-stat-icon" style={{ background: "rgba(31,157,85,0.10)" }}>🌱</div>
          <p className="bg-stat-label">Remaining Budget</p>
          <p className="bg-stat-value" style={{ color: GREEN }}>{fmt(totals.remaining)}</p>
        </div>
        <div className="bg-stat">
          <div className="bg-stat-icon" style={{ background: "rgba(210,59,59,0.10)" }}>⚠️</div>
          <p className="bg-stat-label">Categories Exceeded</p>
          <p className="bg-stat-value" style={{ color: RED }}>{totals.exceeded}</p>
        </div>
      </section>

      {/* Budget cards */}
      <div className="bg-section-head">
        <h2 className="bg-section-title">Category Budgets</h2>
        <span className="bg-section-meta">{filtered.length} of {BUDGETS.length} categories</span>
      </div>

      <section className="bg-grid">
        {filtered.map((b) => {
          const pct = (b.spent / b.budget) * 100;
          const remaining = b.budget - b.spent;
          const status = statusFor(pct);
          return (
            <article key={b.id} className="bg-card">
              <div className="bg-card-top">
                <div className="bg-cat">
                  <div className="bg-cat-icon">{b.icon}</div>
                  <div>
                    <p className="bg-cat-name">{b.category}</p>
                    <p className="bg-cat-period">{b.period} budget</p>
                  </div>
                </div>
                <span className={`bg-badge ${status.cls}`}>{status.label}</span>
              </div>

              <div className="bg-progress-wrap">
                <div className="bg-progress-meta">
                  <span>{Math.round(pct)}% used</span>
                  <span>{fmt(b.spent)} / {fmt(b.budget)}</span>
                </div>
                <div className="bg-progress">
                  <div
                    className={`bg-progress-bar ${status.cls === "over" ? "over" : status.cls === "warn" ? "warn" : ""}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-amounts">
                <div className="bg-amt">
                  <span className="bg-amt-label">Budget</span>
                  <span className="bg-amt-value">{fmt(b.budget)}</span>
                </div>
                <div className="bg-amt">
                  <span className="bg-amt-label">Spent</span>
                  <span className="bg-amt-value">{fmt(b.spent)}</span>
                </div>
                <div className="bg-amt">
                  <span className="bg-amt-label">{remaining < 0 ? "Over" : "Remaining"}</span>
                  <span className={`bg-amt-value ${remaining < 0 ? "neg" : ""}`}>
                    {remaining < 0 ? `-${fmt(Math.abs(remaining))}` : fmt(remaining)}
                  </span>
                </div>
              </div>

              {remaining < 0 && (
                <div className="bg-warn-row">⚠️ Exceeded by {fmt(Math.abs(remaining))}</div>
              )}
            </article>
          );
        })}
      </section>

      {/* Insights */}
      <div className="bg-section-head" style={{ marginTop: 8 }}>
        <h2 className="bg-section-title">Insights & Recommendations</h2>
        <span className="bg-section-meta">Powered by Penny AI</span>
      </div>
      <section className="bg-insights">
        {INSIGHTS.map((ins, i) => (
          <div key={i} className="bg-insight">
            <div className={`bg-insight-icon ${ins.tone}`}>{ins.icon}</div>
            <p className="bg-insight-text">{ins.text}</p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="bg-charts">
        <div className="bg-panel">
          <h3 className="bg-panel-title">Budget vs Actual Spending</h3>
          <p className="bg-panel-sub">Comparison across your categories this month.</p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
                <XAxis dataKey="name" stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 10, border: "1px solid #eef1f7", fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Budget" fill={NAVY} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Actual" fill={GREEN} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-panel">
          <h3 className="bg-panel-title">Monthly Utilization Trend</h3>
          <p className="bg-panel-sub">% of total budget consumed each month.</p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bgUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={NAVY} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
                <XAxis dataKey="label" stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7a89a8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: "1px solid #eef1f7", fontSize: 13 }} />
                <Area type="monotone" dataKey="utilization" stroke={NAVY} strokeWidth={2.5} fill="url(#bgUtil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      {/* Modal  */}

      {showModal && (
        <div className="bg-overlay" onClick={() => setShowModal(false)}>
          <div className="bg-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Budget</h3>
            <p>Set a spending limit for a category to stay on track.</p>

            <div className="bg-field">
              <label>Category</label>
              <select className="bg-select">
                {categories.map((c)=>{
                  <option key={c.id}>{c.category}</option>
                })}
                
                {/* <option>Food</option><option>Travel</option><option>Entertainment</option>
                <option>Utilities</option><option>Shopping</option><option>Rent</option> */}
              </select>
            </div>
            <div className="bg-field">
              <label>Monthly Limit</label>
              <input className="bg-input" type="number" placeholder="₹ 5000" />
            </div>
            <div className="bg-field">
              <label>Period</label>
              <select className="bg-select">
                <option>Monthly</option><option>Weekly</option><option>Yearly</option>
              </select>

            
            </div>
            <div className="bg-field">
  <label>Choose Month</label>

  <select className="bg-select" 
  
  >

    {MONTHS.map((month,index)=>(

      <option
        key={index}
        value={index+1}
      >
        {month}
      </option>

    ))}

  </select>
</div>

            <div className="bg-actions">
              <button className="bg-btn ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-btn primary" onClick={() => setShowModal(false)}>Save Budget</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
