import React from "react";
import TransactionForm from "../components/TransactionForm";
const styles = `
  .et-root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1a2540;
    background: #ffffff;
    min-height: 100vh;
  }
  .et-root *, .et-root *::before, .et-root *::after { box-sizing: border-box; }

  /* Header */
  .et-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 6%;
    border-bottom: 1px solid #eef1f7;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .et-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 20px;
    color: #0a2540;
  }
  .et-logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #0a2540;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
  }
  .et-btn {
    cursor: pointer;
    border: none;
    font-weight: 600;
    border-radius: 8px;
    transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
    font-size: 15px;
  }
  .et-btn-outline {
    padding: 9px 18px;
    background: transparent;
    color: #0a2540;
    border: 1.5px solid #0a2540;
  }
  .et-btn-outline:hover {
    background: #0a2540;
    color: #ffffff;
    transform: translateY(-1px);
  }
  .et-btn-primary {
    padding: 14px 28px;
    background: #0a2540;
    color: #ffffff;
    box-shadow: 0 6px 18px rgba(10, 37, 64, 0.25);
  }
  .et-btn-primary:hover {
    background: #143a66;
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(10, 37, 64, 0.35);
  }

  /* Hero */
  .et-hero {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    padding: 80px 6%;
    background: linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%);
  }
  .et-hero-text { flex: 1 1 380px; }
  .et-hero h1 {
    font-size: 52px;
    line-height: 1.1;
    margin: 0 0 20px;
    color: #0a2540;
    letter-spacing: -1px;
  }
  .et-hero p {
    font-size: 18px;
    color: #4a5a78;
    line-height: 1.6;
    margin: 0 0 32px;
    max-width: 480px;
  }

  /* Mockup */
  .et-mockup-wrap { flex: 1 1 380px; display: flex; justify-content: center; }
  .et-mockup {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 25px 60px rgba(10, 37, 64, 0.18);
    padding: 26px;
    border: 1px solid #eef1f7;
  }
  .et-mockup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }
  .et-mockup-title { font-size: 13px; color: #7a89a8; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .et-mockup-dots { display: flex; gap: 5px; }
  .et-dot { width: 9px; height: 9px; border-radius: 50%; background: #e1e6ef; }
  .et-balance {
    background: #0a2540;
    color: #ffffff;
    padding: 22px;
    border-radius: 12px;
    margin-bottom: 18px;
  }
  .et-balance-label { font-size: 13px; opacity: 0.75; margin-bottom: 6px; }
  .et-balance-amount { font-size: 32px; font-weight: 700; letter-spacing: -0.5px; }
  .et-tx-list { display: flex; flex-direction: column; gap: 10px; }
  .et-tx {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: #f7f9fc;
    border-radius: 10px;
  }
  .et-tx-left { display: flex; align-items: center; gap: 12px; }
  .et-tx-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: #e8edf6; color: #0a2540;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px;
  }
  .et-tx-name { font-weight: 600; font-size: 14px; color: #0a2540; }
  .et-tx-cat { font-size: 12px; color: #7a89a8; }
  .et-tx-amount { font-weight: 700; color: #d23b3b; font-size: 14px; }
  .et-tx-amount.pos { color: #1f9d55; }

  /* Features */
  .et-features { padding: 80px 6%; text-align: center; }
  .et-features h2 {
    font-size: 36px;
    color: #0a2540;
    margin: 0 0 12px;
    letter-spacing: -0.5px;
  }
  .et-features-sub { color: #4a5a78; margin: 0 0 48px; font-size: 17px; }
  .et-feature-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
  }
  .et-feature-card {
    flex: 1 1 260px;
    max-width: 340px;
    background: #ffffff;
    border: 1px solid #eef1f7;
    border-radius: 14px;
    padding: 32px 26px;
    text-align: left;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .et-feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(10, 37, 64, 0.12);
    border-color: #0a2540;
  }
  .et-feature-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: #0a2540;
    color: #ffffff;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700;
    margin-bottom: 18px;
  }
  .et-feature-card h3 { margin: 0 0 8px; font-size: 19px; color: #0a2540; }
  .et-feature-card p { margin: 0; color: #4a5a78; font-size: 15px; line-height: 1.6; }

  /* Footer */
  .et-footer {
    background: #0a2540;
    color: #c9d3e6;
    padding: 40px 6%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  .et-footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
  .et-footer a {
    color: #c9d3e6;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;
  }
  .et-footer a:hover { color: #ffffff; }
  .et-copy { font-size: 14px; }

  @media (max-width: 640px) {
    .et-hero { padding: 56px 6%; }
    .et-hero h1 { font-size: 38px; }
    .et-features { padding: 56px 6%; }
    .et-features h2 { font-size: 28px; }
  }
`;

const PennyIndex = () => {
  return (
    <div className="et-root">
      <style>{styles}</style>

      {/* Header */}
      <header className="et-header">
        <div className="et-logo">
          <span className="et-logo-mark">P</span>
          <span>Penny</span>
        </div>
        <button className="et-btn et-btn-outline">Login</button>
      </header>

      {/* Hero */}
      <section className="et-hero">
        <div className="et-hero-text">
          <h1>Track Every Penny</h1>
          <p>
            Take control of your finances with a simple, beautiful expense tracker.
            Log spending in seconds, organize by category, and see exactly where your
            money goes each month.
          </p>
          <button className="et-btn et-btn-primary">Start Tracking</button>
        </div>

        {/* Visual Mockup */}
        <div className="et-mockup-wrap">
          <div className="et-mockup">
            <div className="et-mockup-header">
              <span className="et-mockup-title">Dashboard</span>
              <div className="et-mockup-dots">
                <span className="et-dot" />
                <span className="et-dot" />
                <span className="et-dot" />
              </div>
            </div>

            <div className="et-balance">
              <div className="et-balance-label">Total Balance</div>
              <div className="et-balance-amount">$4,820.50</div>
            </div>

            <div className="et-tx-list">
              <div className="et-tx">
                <div className="et-tx-left">
                  <div className="et-tx-icon">G</div>
                  <div>
                    <div className="et-tx-name">Groceries</div>
                    <div className="et-tx-cat">Food</div>
                  </div>
                </div>
                <div className="et-tx-amount">-$50.00</div>
              </div>
              <div className="et-tx">
                <div className="et-tx-left">
                  <div className="et-tx-icon">C</div>
                  <div>
                    <div className="et-tx-name">Coffee Shop</div>
                    <div className="et-tx-cat">Dining</div>
                  </div>
                </div>
                <div className="et-tx-amount">-$8.75</div>
              </div>
              <div className="et-tx">
                <div className="et-tx-left">
                  <div className="et-tx-icon">S</div>
                  <div>
                    <div className="et-tx-name">Salary</div>
                    <div className="et-tx-cat">Income</div>
                  </div>
                </div>
                <div className="et-tx-amount pos">+$2,400.00</div>
              </div>
              <div className="et-tx">
                <div className="et-tx-left">
                  <div className="et-tx-icon">U</div>
                  <div>
                    <div className="et-tx-name">Utilities</div>
                    <div className="et-tx-cat">Bills</div>
                  </div>
                </div>
                <div className="et-tx-amount">-$120.00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="et-features">
        <h2>How it works</h2>
        <p className="et-features-sub">Three simple steps to financial clarity.</p>
        <div className="et-feature-grid">
          <div className="et-feature-card">
            <div className="et-feature-icon">+</div>
            <h3>Add Expense</h3>
            <p>Quickly log any purchase in seconds with our streamlined entry form.</p>
          </div>
          <div className="et-feature-card">
            <div className="et-feature-icon">#</div>
            <h3>Categorize</h3>
            <p>Auto-organize spending into smart categories like food, travel, and bills.</p>
          </div>
          <div className="et-feature-card">
            <div className="et-feature-icon">≡</div>
            <h3>View Reports</h3>
            <p>Visualize trends with clear monthly reports and actionable insights.</p>
          </div>
        </div>
      </section>
      
  <TransactionForm/>

      {/* Footer */}
      <footer className="et-footer">
        <div className="et-copy">© 2026 Penny. All rights reserved.</div>
        <div className="et-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default PennyIndex;
