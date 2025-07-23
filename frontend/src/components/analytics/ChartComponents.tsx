import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { ChartData } from "@/types/analytics";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ViewerGrowthChartProps {
  data: ChartData;
  height?: string;
}

export const ViewerGrowthChart: React.FC<ViewerGrowthChartProps> = ({
  data,
  height = "h-64",
}) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: dataset.borderColor,
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div className={height}>
      <Line data={chartData} options={options} />
    </div>
  );
};

interface AIResponseActivityChartProps {
  data: ChartData;
  height?: string;
}

export const AIResponseActivityChart: React.FC<
  AIResponseActivityChartProps
> = ({ data, height = "h-64" }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      // Enhanced bar styling with rounded tops
      borderRadius: 0,
      borderSkipped: false,
      pointRadius: 0,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: dataset.borderColor,
      // Enhanced colors with better opacity - Blue and Green theme (matching ViewerGrowthChart)
      backgroundColor:
        index === 0 ? "rgba(59, 130, 246, 0.85)" : "rgba(16, 185, 129, 0.85)",
      borderColor:
        index === 0 ? "rgba(59, 130, 246, 1)" : "rgba(16, 185, 129, 1)",
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context: { label: string }[]) => `Hour: ${context[0].label}`,
          label: (context: {
            dataset: { label?: string };
            parsed: { y: number };
          }) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (label.includes("Rate")) {
              return `${label}: ${value}%`;
            }
            return `${label}: ${value} responses`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
            weight: 500,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
            weight: 500,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className={height}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

interface AnalyticsSummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

export const AnalyticsSummaryCard: React.FC<AnalyticsSummaryCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  color,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {trend && (
          <div
            className={`text-right ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <p className="text-sm font-semibold">
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </p>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
        )}
      </div>
    </div>
  );
};
