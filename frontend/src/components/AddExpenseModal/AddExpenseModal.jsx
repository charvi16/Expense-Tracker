import "./AddExpenseModal.css";
import { useState } from "react";
import API from "../../api/axios";

export default function AddExpenseModal({ close, onSaved }) {

  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    method: "",
    notes: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await API.post("/expenses", {
      amount: form.amount,
      category: form.category,
      date: form.date,
      method: form.method,
      notes: form.notes
    });

    // for Dashboard refresh key
    localStorage.setItem("refresh", Date.now());

    // tell parent to refetch list
    if (onSaved) onSaved();

    // reset + close
    setForm({
      amount: "",
      category: "",
      date: "",
      method: "",
      notes: ""
    });

    if (close) close();
  }

  return (
    <div className="add-overlay">

      <div className="add-modal">

        <button className="add-close" onClick={close}>
          ×
        </button>

        <form className="add-form" onSubmit={handleSubmit}>

          <label>
            Amount ₹
            <input
              type="number"
              required
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Food</option>
              <option>Transport</option>
              <option>Rent</option>
              <option>Bills</option>
              <option>Shopping</option>
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>

          <label>
            Method
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Cash</option>
            </select>
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </label>

          <button className="btn btn-primary">
            Save Expense
          </button>

        </form>

      </div>

    </div>
  );
}
