import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Map, PlusCircle, List, Download, Maximize, Ruler } from 'lucide-react';

export default function IrrigationDashboard({ surveyType }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = sessionStorage.getItem('rws_username') || 'surveyor';
  const isAdmin = username === 'admin';
  const basePath = isAdmin ? '/admin' : '/surveyor';
  
  const surveyTitle = surveyType === 'hnss' ? 'HNSS Dashboard' : 'Palar River Dashboard';

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await api.get(`/irrigation.php?type=${surveyType}&user=${username}`);
          if (Array.isArray(data)) {
            setSurveys(data);
          } else {
            console.error('API returned non-array data:', data);
            setSurveys([]);
          }
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [surveyType, username, apiUrl]);

  const total = surveys.length;
  const totalLength = surveys.reduce((sum, s) => sum + parseFloat(s.total_length || 0), 0).toFixed(2);
  const avgWidth = surveys.length > 0 ? (surveys.reduce((sum, s) => sum + parseFloat(s.total_width || 0), 0) / surveys.length).toFixed(2) : 0;

  const stats = [
    { name: 'Total Surveys', stat: total.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Total Surveyed Length (m)', stat: totalLength.toString() + 'm', icon: Ruler, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Average Width (m)', stat: avgWidth.toString() + 'm', icon: Maximize, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const recentSurveys = surveys.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{surveyTitle}</h1>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          {isAdmin && (
            <a 
              href={`${apiUrl}/php-backend/api/export_irrigation.php?type=${surveyType}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-colors shadow-sm"
            >
              <Download size={18} className="mr-2" />
              Download ZIP
            </a>
          )}
          {!isAdmin && (
            <Link to={`${basePath}/new-${surveyType}`} className="btn-primary flex items-center">
              <PlusCircle size={18} className="mr-2" />
              New Survey
            </Link>
          )}
          <Link to={`${basePath}/surveys-${surveyType}`} className="btn-secondary flex items-center">
            <List size={18} className="mr-2" />
            View List
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="card flex items-center p-5">
            <div className={`p-3 rounded-full ${item.bg} ${item.color} mr-4`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 truncate">{item.name}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{item.stat}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Surveys Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Recent Surveys</h3>
          <Link to={`${basePath}/surveys-${surveyType}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Survey ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dimensions</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    <Link to={`${basePath}/survey/${survey.id}?type=${surveyType}`}>#{survey.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{survey.village}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{survey.total_length}m × {survey.total_width}m</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`${basePath}/survey/${survey.id}?type=${surveyType}`} className="text-primary-600 hover:text-primary-900">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
