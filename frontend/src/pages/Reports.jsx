import { Download } from 'lucide-react';
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
  
  const statusData = {
    labels: ['Successful', 'Seasonal', 'Dried'],
    datasets: [
      {
        label: 'Number of Borewells',
        data: [842, 215, 188],
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
    labels: ['Maddipadu', 'Chimakurthy', 'Podili', 'Kanigiri', 'Markapuram', 'Darsi'],
    datasets: [
      {
        label: 'Total Surveys',
        data: [320, 250, 190, 150, 210, 125],
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
        data: [65, 25, 10],
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
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-100 pb-2">Overall Status</h3>
          <div className="h-72 flex justify-center">
            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Village wise surveys */}
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-100 pb-2">Village-wise Surveys</h3>
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
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-600">
                <span>Livestock</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-600">
                <span>Domestic</span>
                <span className="font-medium">7%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '7%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
