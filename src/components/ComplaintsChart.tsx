'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetComplaintStatsQuery } from '@/services/nycDataApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ComplaintsChart() {
  const { data: stats, isLoading, error } = useGetComplaintStatsQuery();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints by Type</h3>
        <div className="text-center text-neutral-400">
          Error loading data
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Get top 10 complaint types
  const topComplaints = Object.entries(stats.complaintsByType)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const chartData = {
    labels: topComplaints.map(([type]) => type),
    datasets: [
      {
        label: 'Number of Complaints',
        data: topComplaints.map(([, count]) => count),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(56, 189, 248, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(244, 63, 94, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(23, 23, 23, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleColor: '#f5f5f5',
        bodyColor: '#a3a3a3',
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#a3a3a3',
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      y: {
        ticks: {
          color: '#a3a3a3',
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
      <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints by Type</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
