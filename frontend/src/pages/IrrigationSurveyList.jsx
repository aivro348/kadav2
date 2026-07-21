import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Eye, Edit, Trash2, Download } from 'lucide-react';

export default function IrrigationSurveyList({ surveyType }) {
  const location = useLocation();
  const isSurveyor = location.pathname.startsWith('/surveyor');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  const username = sessionStorage.getItem('rws_username') || 'surveyor';
  const isAdmin = username === 'admin';
  const basePath = isAdmin ? '/admin' : '/surveyor';
  const apiUrl = import.meta.env.VITE_API_URL || '';
  
  const surveyTitle = surveyType === 'hnss' ? 'HNSS Surveys' : 'Palar River Surveys';

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(`${apiUrl}/php-backend/api/irrigation.php?type=${surveyType}&user=${username}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch surveys');
        }
        
        const data = await response.json();
        setSurveys(data);
        setFilteredSurveys(data);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setSurveys([]);
        setFilteredSurveys([]);
      }
    };

    fetchSurveys();
  }, [surveyType, username, apiUrl]);

  useEffect(() => {
    let filtered = surveys;
    if (searchTerm) {
      filtered = surveys.filter(s => {
        return s.village?.toLowerCase().includes(searchTerm.toLowerCase()) || 
               s.id?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    setFilteredSurveys(filtered);
  }, [surveys, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-slate-900">{surveyTitle}</h1>
          <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary-200">
            {surveys.length} Completed
          </span>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3 flex-wrap">
          {isAdmin && (
            <a 
              href={`${apiUrl}/php-backend/api/export_irrigation.php?type=${surveyType}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-colors shadow-sm"
            >
              <Download size={18} className="mr-2" />
              Download ZIP
            </a>
          )}
          {!isSurveyor && (
            <Link to={`${basePath}/new-${surveyType}`} className="btn-primary flex items-center w-fit">
              <PlusCircle size={18} className="mr-2" />
              New Survey
            </Link>
          )}
        </div>
      </div>

      <div className="card !p-0">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by Village or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Survey ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dimensions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    <Link to={`${basePath}/survey/${survey.id}?type=${surveyType}`}>#{survey.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{survey.village}</div>
                    <div className="text-sm text-slate-500">{survey.mandal}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {survey.total_length}m × {survey.total_width}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(survey.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link to={`${basePath}/survey/${survey.id}?type=${surveyType}`} className="text-slate-400 hover:text-primary-600 inline-flex" title="View">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredSurveys.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    No surveys found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
