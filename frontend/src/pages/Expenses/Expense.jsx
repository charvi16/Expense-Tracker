import "./Expense.css";
import useFetch from "../../hooks/useFetch";
import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import AddExpenseModal from '../../components/AddExpenseModal/AddExpenseModal';

export default function Expense() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  function handleSaved() {
    setRefreshKey(prev => prev + 1);
  }

  if (loading)
    return <main className="page expenses-page">Loading...</main>;

  return (
    <main className="page expenses-page">

      <h1>Your Expenses</h1>

      {data.length === 0 && (
        <p className="empty-exp">No expenses added yet</p>
      )}

      <div className="expenses-list">

          {/* HEADER */}
          <div className="exp-item exp-header">
            <span>Category</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Date</span>
          </div>

          {/* ROWS */}
          {data.map(x => (
            <div key={x._id} className="exp-item">
              <span>{x.category}</span>
              <span>₹{x.amount}</span>
              <span>{x.paymentMethod || "—"}</span>
              <span>{x.date?.slice(0,10)}</span>
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
