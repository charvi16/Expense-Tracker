import "./Expense.css";
import useFetch from "../../hooks/useFetch";
import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import AddExpenseModal from '../../components/AddExpenseModal/AddExpenseModal';

export default function Expense() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState("date-desc");
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("openAddExpense") === "1") {
      localStorage.removeItem("openAddExpense");
      setShowModal(true);
    }
  }, []);

  const { user } = useContext(AuthContext);
  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" />;

  const { data, loading } = useFetch("/expenses?ref=" + refreshKey);

  // Sort expenses based on selected option
  useEffect(() => {
    if (data && data.length > 0) {
      let sorted = [...data];

      switch (sortBy) {
        case "date-desc":
          sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "date-asc":
          sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "amount-desc":
          sorted.sort((a, b) => b.amount - a.amount);
          break;
        case "amount-asc":
          sorted.sort((a, b) => a.amount - b.amount);
          break;
        case "category":
          sorted.sort((a, b) => a.category.localeCompare(b.category));
          break;
        default:
          break;
      }

      setSortedData(sorted);
    } else {
      setSortedData([]);
    }
  }, [data, sortBy]);

  function handleSaved() {
    setRefreshKey(prev => prev + 1);
  }

  if (loading)
    return <main className="page expenses-page">Loading...</main>;

  return (
    <main className="page expenses-page">

      <div className="expenses-header">
        <div>
          <h1>Your Expenses</h1>
          <p className="expense-count">Total: {data.length} expenses</p>
        </div>

        <button 
          className="btn-add-expense"
          onClick={() => setShowModal(true)}
        >
          + Add Expense
        </button>
      </div>

      {/* SORTING CONTROLS */}
      <div className="sorting-container">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">📅 Latest First</option>
          <option value="date-asc">📅 Oldest First</option>
          <option value="amount-desc">💰 Highest Amount</option>
          <option value="amount-asc">💰 Lowest Amount</option>
          <option value="category">📂 Category</option>
        </select>
      </div>

      {sortedData.length === 0 && (
        <p className="empty-exp">No expenses added yet. Start by clicking "Add Expense"!</p>
      )}

      <div className="expenses-list">

          {/* HEADER */}
          <div className="exp-item exp-header">
            <span className="col-category">Category</span>
            <span className="col-amount">Amount</span>
            <span className="col-method">Method</span>
            <span className="col-date">Date</span>
          </div>

          {/* ROWS */}
          {sortedData.map((x, index) => (
            <div key={x._id} className="exp-item" style={{ animationDelay: `${index * 0.05}s` }}>
              <span className="col-category">
                <span className="category-badge">{x.category}</span>
              </span>
              <span className="col-amount">
                <span className="amount-value">₹{x.amount}</span>
              </span>
              <span className="col-method">
                <span className="method-badge">{x.paymentMethod || "—"}</span>
              </span>
              <span className="col-date">
                <span className="date-value">{x.date?.slice(0,10)}</span>
              </span>
            </div>
          ))}

        </div>


      {showModal && (
        <AddExpenseModal
          close={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}

    </main>
  );
}
