import useFetch from "../../hooks/useFetch";
import "./Analytics.css";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Analytics() {

  const { data, loading } = useFetch("/analytics");

  if (loading) return <main className="page analytics-page">Loading...</main>;

  const monthly = data?.monthlySpendingChart || {};
  const categories = data?.categoryChart || {};
  const daily = data?.dailyTrendChart || {};
  const methods = data?.paymentMethodChart || {};

  // ----- Monthly Spending (Bar) -----
  let monthlyLabels = Object.keys(monthly).sort();
  let monthlyValues = monthlyLabels.map(k => monthly[k]);

  if (monthlyLabels.length === 0) {
    monthlyLabels = ["No data"];
    monthlyValues = [0];
  }

  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Spend",
        data: monthlyValues,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2
      }
    ]
  };

  // ----- Category Spending (Pie) -----
  let categoryLabels = Object.keys(categories);
  let categoryValues = categoryLabels.map(k => categories[k]);

  if (categoryLabels.length === 0) {
    categoryLabels = ["No data"];
    categoryValues = [0];
  }

  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Category Spend",
        data: categoryValues,
         backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40"
      ],
      borderColor: "#fff",
      borderWidth: 2
      }
    ]
  };

  // ----- Payment Method (Pie) -----
  let methodLabels = Object.keys(methods);
  let methodValues = methodLabels.map(k => methods[k]);

  if (methodLabels.length === 0) {
    methodLabels = ["No data"];
    methodValues = [0];
  }

  const methodData = {
    labels: methodLabels,
    datasets: [
      {
        label: "Payment Methods",
        data: methodValues,
        backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40"
      ],
      borderColor: "#fff",
      borderWidth: 2
      }
    ]
  };

  // ----- Daily Trend (Line) -----
  let dailyLabels = Object.keys(daily).sort();
  let dailyValues = dailyLabels.map(k => daily[k]);

  if (dailyLabels.length === 0) {
    dailyLabels = ["No data"];
    dailyValues = [0];
  }

  const dailyData = {
    labels: dailyLabels,
    datasets: [
      {
        label: "Daily Spend (Last 30 days)",
        data: dailyValues,
        borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      pointBackgroundColor: "rgba(255, 99, 132, 1)",
      pointBorderColor: "#fff",
      tension: 0.3
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" }
    }
  };

  const lineOptions = {
    ...commonOptions,
    scales: {
      y: { beginAtZero: true }
    }
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <main className="page analytics-page">

      <h1>Analytics</h1>

      {/* Row 1: Monthly + Category */}
      <section className="row">
        <div className="chart-card">
          <h2>Monthly Spending</h2>
          <Bar data={monthlyData} options={barOptions} />
        </div>

        <div className="chart-card">
          <h2>Category-wise Spending</h2>
          <Pie data={categoryData} options={commonOptions} />
        </div>
      </section>

      {/* Row 2: Payment Methods + Daily Trend */}
      <section className="row">
        <div className="chart-card">
          <h2>Payment Methods</h2>
          <Pie data={methodData} options={commonOptions} />
        </div>

        <div className="chart-card tall">
          <h2>Daily Spend Trend (Last 30 days)</h2>
          <Line data={dailyData} options={lineOptions} />
        </div>
      </section>

    </main>
  );
}
