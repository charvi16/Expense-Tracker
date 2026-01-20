import "./AddExpenseModal.css";
import { useState } from "react";
import API from "../../api/axios";

export default function AddExpenseModal({ close, onSaved }) {

  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    method: "",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/expenses", {
        amount: form.amount,
        category: form.category,
        date: form.date,
        method: form.method,
        notes: form.notes
      });

      // for Dashboard refresh key
      localStorage.setItem("refresh", Date.now());

      // show success message
      setSuccessMessage("Expense saved successfully!");
      
      // tell parent to refetch list
      if (onSaved) onSaved();

      // reset + close after delay
      setTimeout(() => {
        setForm({
          amount: "",
          category: "",
          date: new Date().toISOString().split('T')[0],
          method: "",
          notes: ""
        });
        if (close) close();
      }, 800);
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-overlay">

      <div className="add-modal">

        <button className="add-close" onClick={close} type="button">
          ✕
        </button>

        <div className="modal-header">
          <div className="modal-icon">💰</div>
          <h2>Add New Expense</h2>
          <p>Track your spending</p>
        </div>

        {successMessage && (
          <div className="success-banner">
            <span>✓</span> {successMessage}
          </div>
        )}

        <form className="add-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="amount">
              Amount
              <span className="required">*</span>
            </label>
            <div className="input-with-currency">
              <span className="currency-symbol">₹</span>
              <input
                id="amount"
                type="number"
                required
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Category
                <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Food">🍔 Food</option>
                <option value="Transport">🚗 Transport</option>
                <option value="Rent">🏠 Rent</option>
                <option value="Bills">📄 Bills</option>
                <option value="Shopping">🛍️ Shopping</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="method">
                Payment Method
                <span className="required">*</span>
              </label>
              <select
                id="method"
                name="method"
                value={form.method}
                onChange={handleChange}
                required
              >
                <option value="">Select Method</option>
                <option value="UPI">💳 UPI</option>
                <option value="Credit Card">💰 Credit Card</option>
                <option value="Debit Card">🏦 Debit Card</option>
                <option value="Cash">💵 Cash</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Date
              <span className="required">*</span>
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Notes
              <span className="optional">(Optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any notes about this expense..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={close}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? "Saving..." : "✓ Save Expense"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
