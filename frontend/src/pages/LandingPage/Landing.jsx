import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="page landing-page">

      <section className="hero">
        
        <div className="hero-left">
          <h1>
            Master Your <span>Money</span><br/>
            With AI Powered Insights.
          </h1>

          <p className="hero-sub">
            Track expenses, build budgets, manage credit cards, analyse investments
            and get AI-driven financial recommendations in one single dashboard.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Create Account
            </Link>

            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <h3>₹2.5Cr+</h3>
              <p>Tracked Spend</p>
            </div>

            <div className="stat">
              <h3>18%</h3>
              <p>Avg Savings Boost</p>
            </div>

            <div className="stat">
              <h3>24×7</h3>
              <p>AI Financial Advisor</p>
            </div>
          </div>

        </div>


        <div className="hero-right">
          
          <div className="card-block big">
            <span className="label">Current Month Spend</span>
            <h2>₹ 24,560</h2>
            <p className="muted">of ₹ 30,000 budget</p>
          </div>

          <div className="hero-small-cards">
            
            <div className="card-block small">
              <span className="label">Invested</span>
              <h3>₹ 1,20,000</h3>
            </div>

            <div className="card-block small">
              <span className="label">Credit Used</span>
              <h3>23%</h3>
            </div>

          </div>

        </div>

      </section>
    </main>
  );
}
