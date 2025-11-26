import { Pie } from "react-chartjs-2";

export default function SubscriptionChart({ data }) {
  const labels = Object.keys(data) || {};
  const values = Object.values(data) || {};

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#ff6384", "#36a2eb", "#cc65fe",
          "#ffce56", "#4bc0c0", "#9966ff"
        ]
      }
    ]
  };

  return <Pie data={chartData} />;
}
