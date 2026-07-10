import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import locationsData from '../data/locations.json';

export default function SurveyList() {
  const location = useLocation();
  const isSurveyor = location.pathname.startsWith('/surveyor');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [submittedSurveys, setSubmittedSurveys] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('rws_surveys');
    if (saved) {
      setSubmittedSurveys(JSON.parse(saved));
    }
  }, []);

  // Mock data for UI demonstration
  const surveys = [
    { id: 'SRV-1024', village: 'Maddipadu', mandal: 'Maddipadu', status: 'Successful', type: 'Agriculture', date: '2026-07-10' },
    { id: 'SRV-1023', village: 'Chimakurthy', mandal: 'Chimakurthy', status: 'Seasonal / Summer Dry', type: 'Agriculture', date: '2026-07-09' },
    { id: 'SRV-1022', village: 'Podili', mandal: 'Podili', status: 'Dried', type: 'Livestock', date: '2026-07-08' },
    { id: 'SRV-1021', village: 'Kanigiri', mandal: 'Kanigiri', status: 'Successful', type: 'Agriculture', date: '2026-07-08' },
    { id: 'SRV-1020', village: 'Markapuram', mandal: 'Markapuram', status: 'Successful', type: 'Agriculture', date: '2026-07-07' },
  ];

  const allSurveys = [...submittedSurveys, ...surveys];

  const filteredSurveys = allSurveys.filter(s => {
    const matchesSearch = s.village?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Survey List</h1>
        <Link to="new" className="mt-4 sm:mt-0 btn-primary flex items-center w-fit">
          <PlusCircle size={18} className="mr-2" />
          New Survey
        </Link>
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
          
          <div className="flex items-center w-full sm:w-auto space-x-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <select 
              className="input-field py-1.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Successful">Successful</option>
              <option value="Seasonal / Summer Dry">Seasonal</option>
              <option value="Dried">Dried</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Survey ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Village / Mandal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    <Link to={`${survey.id}`}>{survey.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{survey.village}</div>
                    <div className="text-sm text-slate-500">{survey.mandal}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${survey.status === 'Successful' ? 'bg-success-100 text-success-800' : 
                        survey.status === 'Dried' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {survey.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{survey.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{survey.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link to={`${survey.id}`} className="text-slate-400 hover:text-primary-600 inline-flex" title="View">
                      <Eye size={18} />
                    </Link>
                    {!isSurveyor && (
                      <>
                        <button className="text-slate-400 hover:text-blue-600 inline-flex" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-red-600 inline-flex" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSurveys.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    No surveys found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredSurveys.length}</span> of <span className="font-medium">{allSurveys.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-primary-50 text-primary-600 text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
