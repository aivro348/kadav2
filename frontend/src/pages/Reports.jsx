import { Download, Loader2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await api.get('/analytics.php');
        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics data</div>;
  }

  const statusData = {
    labels: ['Successful', 'Seasonal', 'Dried'],
    datasets: [
      {
        label: 'Number of Borewells',
        data: [data.status.successful, data.status.seasonal, data.status.dried],
        backgroundColor: [
          'rgba(48, 149, 86, 0.8)', // Success Green
          'rgba(234, 179, 8, 0.8)', // Yellow
          'rgba(239, 68, 68, 0.8)', // Red
        ],
        borderColor: [
          'rgb(48, 149, 86)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const villageData = {
    labels: data.villages.labels.length > 0 ? data.villages.labels : ['No Data'],
    datasets: [
      {
        label: 'Total Surveys',
        data: data.villages.data.length > 0 ? data.villages.data : [0],
        backgroundColor: 'rgba(35, 143, 198, 0.7)',
        borderColor: 'rgb(35, 143, 198)',
        borderWidth: 1,
      }
    ]
  };

  const waterQualityData = {
    labels: ['Safe', 'Moderate', 'High TDS/Unsafe'],
    datasets: [
      {
        data: [data.water_quality.safe, data.water_quality.moderate, data.water_quality.unsafe],
        backgroundColor: ['#309556', '#f59e0b', '#ef4444'],
      }
    ]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary flex items-center shadow-sm">
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
          <button className="btn-primary flex items-center shadow-sm">
            <Download size={16} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Breakdown */}
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-100 pb-2">Overall Status ({data.status.total} Total)</h3>
          <div className="h-72 flex justify-center">
            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Village wise surveys */}
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-100 pb-2">Village-wise Surveys (Top 6)</h3>
          <div className="h-72">
            <Bar data={villageData} options={barOptions} />
          </div>
        </div>

        {/* Water Quality */}
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-100 pb-2">Water Quality Distribution</h3>
          <div className="h-72 flex justify-center">
            <Doughnut data={waterQualityData} options={{ maintainAspectRatio: false, cutout: '60%' }} />
          </div>
        </div>

        {/* Usage Stats */}
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-100 pb-2">Borewell Utilization</h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-600">
                <span>Agriculture</span>
                <span className="font-medium">{data.utilization.agriculture}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${data.utilization.agriculture}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-600">
                <span>Livestock</span>
                <span className="font-medium">{data.utilization.livestock}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${data.utilization.livestock}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-600">
                <span>Domestic</span>
                <span className="font-medium">{data.utilization.domestic}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${data.utilization.domestic}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
