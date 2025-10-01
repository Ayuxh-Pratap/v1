'use client';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { useGetComplaintStatsQuery } from '@/lib/redux';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface EnhancedChartsProps {
  filters: {
    complaint_type?: string;
    borough?: string;
    status?: string;
    limit?: number;
  };
}

export default function EnhancedCharts({ filters }: EnhancedChartsProps) {
  const { data: stats, isLoading, error } = useGetComplaintStatsQuery(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5 animate-pulse">
            <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-neutral-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <div className="text-center text-neutral-400">
          Error loading chart data
        </div>
      </div>
    );
  }

  // Prepare data for different chart types
  const topComplaints = Object.entries(stats.byType)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const boroughData = Object.entries(stats.byBorough)
    .sort(([,a], [,b]) => b - a);

  const statusData = Object.entries(stats.byStatus);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#a3a3a3',
          font: {
            size: 12,
          },
        },
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#a3a3a3',
          font: {
            size: 11,
          },
        },
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
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Complaints by Type - Bar Chart */}
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints by Type</h3>
        <div className="h-64">
          <Bar
            data={{
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
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>

      {/* Complaints by Borough - Doughnut Chart */}
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints by Borough</h3>
        <div className="h-64">
          <Doughnut
            data={{
              labels: boroughData.map(([borough]) => borough),
              datasets: [
                {
                  label: 'Complaints by Borough',
                  data: boroughData.map(([, count]) => count),
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(56, 189, 248, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(56, 189, 248, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(244, 63, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={doughnutOptions}
          />
        </div>
      </div>

      {/* Complaints by Status - Doughnut Chart */}
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints by Status</h3>
        <div className="h-64">
          <Doughnut
            data={{
              labels: statusData.map(([status]) => status),
              datasets: [
                {
                  label: 'Complaints by Status',
                  data: statusData.map(([, count]) => count),
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(107, 114, 128, 0.8)',
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(244, 63, 94, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(107, 114, 128, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={doughnutOptions}
          />
        </div>
      </div>

      {/* Agency Performance - Bar Chart */}
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Top Agencies by Complaints</h3>
        <div className="h-64">
          <Bar
            data={{
              labels: Object.entries(stats.byAgency)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([agency]) => agency),
              datasets: [
                {
                  label: 'Number of Complaints',
                  data: Object.entries(stats.byAgency)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([, count]) => count),
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(56, 189, 248, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(56, 189, 248, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(244, 63, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(236, 72, 153, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
}
