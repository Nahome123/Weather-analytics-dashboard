import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

function WeatherChart({ weather, chartMode, tempUnit, convertTemp }) {
  if (!weather) return null;

  const datasets = [];

  if (chartMode === "both" || chartMode === "max") {
    datasets.push({
      label: `Max Temp °${tempUnit}`,
      data: weather.forecast.maxTemperatures.map(convertTemp),
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139, 92, 246, 0.16)",
      fill: true,
      borderWidth: 3,
      tension: 0.35,
      pointRadius: 4,
    });
  }

  if (chartMode === "both" || chartMode === "min") {
    datasets.push({
      label: `Min Temp °${tempUnit}`,
      data: weather.forecast.minTemperatures.map(convertTemp),
      borderColor: "#06b6d4",
      backgroundColor: "rgba(6, 182, 212, 0.14)",
      fill: true,
      borderWidth: 3,
      tension: 0.35,
      pointRadius: 4,
    });
  }

  const data = {
    labels: weather.forecast.dates.map((date) =>
      new Date(date).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    ),
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#dbeafe",
          font: { size: 13, weight: "600" },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.12)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.12)" },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default WeatherChart;