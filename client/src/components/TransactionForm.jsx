import React, { useState } from "react";

const styles = `
  .tf-wrap {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    max-width: 460px;
    margin: 40px auto;
    background: #ffffff;
    border: 1px solid #eef1f7;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 18px 40px rgba(10, 37, 64, 0.08);
    color: #0a2540;
  }
  .tf-wrap *, .tf-wrap *::before, .tf-wrap *::after { box-sizing: border-box; }

  .tf-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
  .tf-mark {
    width: 36px; height: 36px; border-radius: 9px;
    background: #0a2540; color: #ffffff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800;
  }
  .tf-title { font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.3px; }
  .tf-sub { color: #4a5a78; font-size: 14px; margin: 4px 0 24px; }

  .tf-form { display: flex; flex-direction: column; gap: 18px; }

  .tf-type-toggle {
    display: flex;
    background: #f7f9fc;
    border-radius: 10px;
    padding: 4px;
    gap: 4px;
  }
  .tf-type-btn {
    flex: 1;
    padding: 9px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    color: #4a5a78;
    transition: background 0.18s ease, color 0.18s ease;
  }
  .tf-type-btn.active {
    background: #ffffff;
    color: #0a2540;
    box-shadow: 0 2px 6px rgba(10, 37, 64, 0.08);
  }

  .tf-field { display: flex; flex-direction: column; gap: 6px; }
  .tf-label {
    font-size: 13px;
    font-weight: 600;
    color: #0a2540;
    letter-spacing: 0.2px;
  }
  .tf-input,
  .tf-select {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #e1e6ef;
    border-radius: 10px;
    font-size: 15px;
    color: #0a2540;
    background: #ffffff;
    font-family: inherit;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    outline: none;
  }
  .tf-input:focus,
  .tf-select:focus {
    border-color: #0a2540;
    box-shadow: 0 0 0 3px rgba(10, 37, 64, 0.1);
  }
  .tf-input::placeholder { color: #9aa6bf; }

  .tf-amount-wrap { position: relative; }
  .tf-amount-prefix {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #7a89a8;
    font-weight: 600;
    pointer-events: none;
  }
  .tf-amount-input { padding-left: 28px; }

  .tf-row { display: flex; gap: 14px; }
  .tf-row .tf-field { flex: 1; }

  .tf-submit {
    margin-top: 8px;
    padding: 14px 20px;
    background: #0a2540;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(10, 37, 64, 0.25);
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  }
  .tf-submit:hover {
    background: #143a66;
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(10, 37, 64, 0.35);
  }
  .tf-submit:active { transform: translateY(0); }

  .tf-success {
    margin-top: 14px;
    padding: 12px 14px;
    background: #eaf7ee;
    color: #1f6b3a;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    .tf-wrap { margin: 20px 16px; padding: 24px; }
    .tf-row { flex-direction: column; gap: 18px; }
  }
`;

const CATEGORIES = ["Food", "Rent", "Salary", "Entertainment", "Bills", "Travel", "Other"];

const TransactionForm = ({ onSubmit }) => {
  const [type, setType] = useState("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Food");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tx = { type, name, amount: parseFloat(amount), date, category };
     
    if (onSubmit) onSubmit(tx);
    setSuccess(true);
    setName("");
    setAmount("");
    console.log(date);
 
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="tf-wrap">
      <style>{styles}</style>

      <div className="tf-header">
        <span className="tf-mark">P</span>
        <h2 className="tf-title">New Transaction</h2>
      </div>
      <p className="tf-sub">Log an expense or income to keep your books tidy.</p>

      <form className="tf-form" onSubmit={handleSubmit}>
        <div className="tf-type-toggle" role="tablist">
          <button
            type="button"
            className={`tf-type-btn ${type === "expense" ? "active" : ""}`}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={`tf-type-btn ${type === "income" ? "active" : ""}`}
            onClick={() => setType("income")}
          >
            Income
          </button>
        </div>

        <div className="tf-field">
          <label className="tf-label" htmlFor="tf-name">Transaction Name</label>
          <input
            id="tf-name"
            type="text"
            className="tf-input"
            placeholder="e.g. Groceries at Whole Foods"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="tf-row">
          <div className="tf-field">
            <label className="tf-label" htmlFor="tf-amount">Amount</label>
            <div className="tf-amount-wrap">
              <span className="tf-amount-prefix">$</span>
              <input
                id="tf-amount"
                type="number"
                step="0.01"
                min="0"
                className="tf-input tf-amount-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="tf-field">
            <label className="tf-label" htmlFor="tf-date">Date</label>
            <input
              id="tf-date"
              type="date"
              className="tf-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="tf-field">
          <label className="tf-label" htmlFor="tf-category">Category</label>
          <select
            id="tf-category"
            className="tf-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="tf-submit">Submit Transaction</button>

        {success && (
          <div className="tf-success">✓ Transaction saved successfully!</div>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;
