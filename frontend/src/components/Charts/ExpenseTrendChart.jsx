import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ExpenseTrendChart({ expenses }) {

  // Sort expenses by date
  const sorted = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Extract labels and values
  const labels = sorted.map(e => e.date.slice(5, 10));   // shows as MM-DD
  const values = sorted.map(e => e.amount);

  const data = {
    labels: labels.length > 0 ? labels : ["No data"], 
    datasets: [
      {
        label: "Daily Spend",
        data: values.length > 0 ? values : [0],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.3)",
        tension: 0.3,
        pointRadius: 3
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Line data={data} options={options} />;
}
