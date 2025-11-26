import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/budgets">Budgets</Link>
      <Link to="/subscriptions">Subscriptions</Link>
      <Link to="/investments">Investments</Link>
      <Link to="/networth">Net Worth</Link>
      <Link to="/reports">Reports</Link>
    </aside>
  );
}
