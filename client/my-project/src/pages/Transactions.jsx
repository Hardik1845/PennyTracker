import React, { useEffect, useState } from "react";
import axios from "axios";

// ================= DATA =================
const CATEGORIES = ["Food", "Groceries", "Rent", "Utilities", "Transport", "Entertainment", "Salary", "Income", "Other"];

const fmt = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "INR" }).format(n);

// ================= CSS =================
const styles = `
  .pn-page { font-family: 'Inter', system-ui, sans-serif; color:#0a2540; padding: 28px; background:#f6f8fc; min-height: 100vh; }
  .pg-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:26px; flex-wrap:wrap; gap:12px; }
  .pg-h1 { font-size:28px; font-weight:800; margin:0; letter-spacing:-.8px; }
  .pg-sub { font-size:13.5px; color:#6b7a96; margin:6px 0 0; }

  .tx-grid { display:grid; grid-template-columns: 380px 1fr; gap:20px; align-items:start; }
  .pn-panel { background:#fff; border:1px solid rgba(10,37,64,0.06); border-radius:16px; padding:22px; box-shadow:0 4px 14px rgba(10,37,64,0.04); }
  .pn-panel-title { font-size:15px; font-weight:700; margin:0 0 16px; }

  .pn-form { display:flex; flex-direction:column; gap:14px; }
  .pn-toggle { display:flex; background:#f1f4fa; border-radius:11px; padding:4px; gap:4px; }
  .pn-toggle button { flex:1; padding:9px; border:none; background:transparent; border-radius:8px; font-weight:700; cursor:pointer; }
  .pn-toggle .active.expense { background:#fff; color:#d23b3b; }
  .pn-toggle .active.income  { background:#fff; color:#1f9d55; }

  .pn-field { display:flex; flex-direction:column; gap:6px; }
  .pn-label { font-size:11px; font-weight:700; color:#6b7a96; }
  .pn-input { padding:10px; border:1px solid #e8ecf3; border-radius:10px; }

  .pn-submit { padding:12px; border:none; border-radius:10px; background:#0a2540; color:#fff; font-weight:700; cursor:pointer; }

  .tx-list { display:flex; flex-direction:column; gap:6px; max-height:640px; overflow-y:auto; }
  .pn-tx { display:flex; align-items:center; gap:12px; padding:12px; border-radius:11px; }
  .pn-tx:hover { background:#f6f8fc; }

  .pn-tx-icon { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff; }
  .pn-tx-icon.expense { background:#d23b3b; }
  .pn-tx-icon.income  { background:#1f9d55; }

  .pn-tx-body { flex:1; }
  .pn-tx-name { font-weight:600; margin:0; }
  .pn-tx-meta { font-size:12px; color:#9aa8c2; }

  .pn-tx-amt.expense { color:#d23b3b; }
  .pn-tx-amt.income  { color:#1f9d55; }
`;

// ================= COMPONENT =================


const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  function decideType(category){
    if(category!="Income"){
        return "expense"
    }
    else{
        return "income"
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:3000/expenses");

        const formatted = data.data.map((expense) => ({
          id: expense.expense_id,
          name: expense.description,
          category: expense.category,
          date: expense.created_date.split("T")[0],
          amount: Number(expense.amount),
          type: decideType(expense.category)
        }));

        setTransactions(formatted);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  const   cdate = new Date();
  
  let cmonth = cdate.getMonth()+1;
  if(cmonth <10){
 cmonth = "0"+  `${cmonth}`
  }
   
  
  const cyear = cdate.getFullYear();
  const [transactionName,setName]  = useState("");
  const[transactionAmount,setAmount] = useState("");
  const [transactionDate,setDate] = useState(`${cyear}-${cmonth}-${cdate.getDate()}`);

   function submitTransaction(event){
    event.preventDefault();
     const transaction = {
      description:transactionName,
      amount:transactionAmount,
      date: transactionDate
     }
     console.log(transaction);
    
  }

  return (
    <div className="pn-page">
      <style>{styles}</style>

      <div className="pg-head">
        <h1 className="pg-h1">Transactions</h1>
      </div>

      <div className="tx-grid">

        {/* FORM */}
        <div className="pn-panel">
          <h3 className="pn-panel-title">Add Transaction</h3>

          <form className="pn-form">
            <input className="pn-input" placeholder="e.g Groceries"  onChange = {(event)=>{setName(event.target.value)}} value={transactionName} required />
            <input className="pn-input" type="number" placeholder="Amount"  onChange = {(event)=>{setAmount(event.target.value)}} value={transactionAmount} required />
            <input className="pn-input" type="date" onChange = {(event)=>{setDate(event.target.value)}} value={transactionDate} required />

            <select className="pn-input">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <button className="pn-submit" onSubmit={submitTransaction} >Add</button>
          </form>
        </div>

        {/* LIST */}
        <div className="pn-panel">
          <h3 className="pn-panel-title">
            All Transactions ({transactions.length})
          </h3>

          <div className="tx-list">
            {transactions.map((t) => (
              <div key={t.id} className="pn-tx">
                <div className={`pn-tx-icon ${t.type}`}>
                  {t.type === "income" ? "+" : "−"}
                </div>

                <div className="pn-tx-body">
                  <p className="pn-tx-name">{t.name}</p>
                  <p className="pn-tx-meta">
                    {t.category} · {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>

                <div className={`pn-tx-amt ${t.type}`}>
                  {fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TransactionsPage;