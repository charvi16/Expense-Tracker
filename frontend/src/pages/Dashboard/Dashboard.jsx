import { useState } from "react";
import "./Dashboard.css";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import ExpenseTrendChart from "../../components/Charts/ExpenseTrendChart";

export default function Dashboard() {
const [showExpenseModal, setShowExpenseModal] = useState(false);

  const navigate = useNavigate();

  // fetch dashboard data
  const refreshKey = localStorage.getItem("refresh");
const { data, loading } = useFetch("/dashboard?refresh="+refreshKey);



  if(loading) 
    return <main className="page dashboard">Loading...</main>;

  return (
    <main className="page dashboard">

      {/* TOP SECTION */}
      <section className="dash-header">
        
        <div>
          <h1>Dashboard</h1>
          <p>Your financial overview at a glance</p>
        </div>

        <button 
          className="add-btn"
          onClick={()=>{
  localStorage.setItem("openAddExpense","1");
  navigate("/expense");
}}
        >
          + Add Expense
        </button>

      </section>

      {/* Summary */}
      <section className="summary-grid">

        <div className="summary-card">
          <span>Total Balance</span>
          <h3>₹ {data?.totalBalance ?? "Not set yet"}</h3>
        </div>

        <div className="summary-card">
          <span>Monthly Budget</span>
          <h3>₹ {data?.monthlyBudget?? "Not set yet"}</h3>
        </div>

        <div className="summary-card">
          <span>This Month Spend</span>
          <h3>₹ {data?.monthSpend ?? "Not set yet"}</h3>
        </div>

      </section>


      {/* KPI BLOCKS */}
      <section className="kpi-grid">

        <div className="kpi-card">
          <h3>Top Spending Category</h3>
          <p><span>{data?.topCategory ?? "Not set yet"}</span></p>
        </div>

        <div className="kpi-card">
          <h3>Avg. Daily Spend</h3>
          <p>₹ {data?.avgDaily ?? "Not set yet"}</p>
        </div>

        <div className="kpi-card">
          <h3>Expected Month End</h3>
          <p>₹ {data?.monthEndExpected ?? "Not set yet"}</p>
        </div>

        <div className="kpi-card">
          <h3>Projected Savings</h3>
          <p className="green">₹ {data?.projectedSavings ?? "Not set yet"}</p>
        </div>

      </section>


      {/* BOTTOM */}
      <section className="dash-bottom">

        <div className="dash-card tall">
          <h2>Expense Trend</h2>

          <div className="chart-placeholder">
             <ExpenseTrendChart expenses={data?.expenses || []} />
          </div>
        </div>

        <div className="dash-card">
          <h2>AI Insights</h2>

          {/* {data.aiInsights.map((i,idx)=>(
            <p key={idx} className="ai-note">
              {i}
            </p>
          ))} */}

          {data?.aiInsights?.length > 0 
            ? data.aiInsights.map((i,idx)=>(
                <p key={idx} className="ai-note">{i}</p>
              ))
            : <p className="ai-note">No insights yet</p>
          }


        </div>

      </section>
    </main>
  );
}
