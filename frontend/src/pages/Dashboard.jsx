import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  CheckCircle, 
  CloudRain, 
  Droplets,
  PlusCircle,
  List,
  BarChart3
} from 'lucide-react';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/php-backend/api/surveys.php?user=admin`);
        if (response.ok) {
          const data = await response.json();
          setSurveys(data);
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const total = surveys.length;
  const successful = surveys.filter(s => s.status === 'Successful').length;
  const seasonal = surveys.filter(s => s.status === 'Seasonal / Summer Dry').length;
  const dried = surveys.filter(s => s.status === 'Dried').length;

  const stats = [
    { name: t('dashboard.total_surveys'), stat: total.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: t('dashboard.successful'), stat: successful.toString(), icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100' },
    { name: t('dashboard.seasonal'), stat: seasonal.toString(), icon: CloudRain, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: t('dashboard.dried'), stat: dried.toString(), icon: Droplets, color: 'text-red-500', bg: 'bg-red-100' },
  ];

  const recentSurveys = surveys.slice(0, 5).map(s => ({
    id: s.survey_id,
    village: s.village,
    status: s.status,
    date: s.created_date ? s.created_date.split(' ')[0] : 'Unknown'
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link to="/surveys/new" className="btn-primary flex items-center">
            <PlusCircle size={18} className="mr-2" />
            {t('nav.new_survey')}
          </Link>
          <Link to="/surveys" className="btn-secondary flex items-center">
            <List size={18} className="mr-2" />
            {t('nav.survey_list')}
          </Link>
          <Link to="/reports" className="btn-secondary flex items-center hidden sm:flex">
            <BarChart3 size={18} className="mr-2" />
            {t('nav.reports')}
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <h3 className="text-lg font-semibold text-slate-800">{t('dashboard.recent_surveys')}</h3>
          <Link to="/surveys" className="text-sm text-primary-600 hover:text-primary-700 font-medium">{t('dashboard.view_all')}</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('dashboard.survey_id')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('dashboard.village')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('dashboard.status')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('dashboard.survey_date')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t('dashboard.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    <Link to={`/surveys/${survey.id}`}>{survey.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{survey.village}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${survey.status === 'Successful' ? 'bg-success-100 text-success-800' : 
                        survey.status === 'Dried' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {survey.status === 'Successful' ? t('survey.status_successful') : 
                       survey.status === 'Dried' ? t('survey.status_dried') : 
                       t('survey.status_seasonal')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{survey.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/surveys/${survey.id}`} className="text-primary-600 hover:text-primary-900 mr-3">{t('dashboard.view')}</Link>
                    <Link to={`/surveys/${survey.id}/edit`} className="text-slate-600 hover:text-slate-900">{t('dashboard.edit')}</Link>
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
