import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Eye, Trash2, MapPin, Ruler, Droplets, Camera, X } from 'lucide-react';

export default function WaterConservationSurveyList() {
  const location = useLocation();
  const isSurveyor = location.pathname.startsWith('/surveyor');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const username = sessionStorage.getItem('rws_username') || 'surveyor';
  const isAdmin = username === 'admin';
  const basePath = isAdmin ? '/admin' : '/surveyor';
  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchSurveys = async () => {
      let combined = [];

      // 1. Fetch from Local Storage first
      try {
        const localData = JSON.parse(localStorage.getItem('water_surveys') || '[]');
        if (Array.isArray(localData)) {
          combined = [...localData];
        }
      } catch (err) {
        console.error('Error reading localStorage surveys:', err);
      }

      // 2. Fetch from backend API
      try {
        const apiData = await api.get(`/surveys.php?type=water_conservation&user=${username}`);
          if (Array.isArray(apiData)) {
            // Filter only water conservation if backend returns mixed
            const waterApiSurveys = apiData.filter(s => s.survey_type === 'Water Conservation' || s.structure_type || s.structureType);
            combined = [...combined, ...waterApiSurveys];
          }
        }
      } catch (error) {
        console.error('Error fetching surveys from backend:', error);
      }

      // Format & deduplicate by ID
      const seen = new Set();
      const unique = [];
      for (const item of combined) {
        const id = item.surveyId || item.id || item.survey_id || `WCS-${Math.floor(100000 + Math.random() * 900000)}`;
        if (!seen.has(id)) {
          seen.add(id);
          unique.push({
            id: id,
            surveyor_id: item.surveyorId || item.created_by || username,
            village: item.village || '-',
            mandal: item.mandal || '-',
            panchayat: item.panchayat || '-',
            structureType: item.structureType || item.structure_type || 'Check Dam',
            structureSubtype: item.structureSubtype || item.structure_subtype || '-',
            dimensions: item.dimensions || {
              length: item.length || '-',
              breadth: item.breadth || '-',
              height: item.height || '-',
              depth: item.depth || '-'
            },
            capacity: item.capacity || `${item.storage_capacity || '-'} ${item.capacity_unit || 'm³'}`,
            fillings: item.fillings || item.fillings_per_year || '-',
            latitude: item.location?.lat || item.latitude || '-',
            longitude: item.location?.lng || item.longitude || '-',
            accuracy: item.location?.accuracy || item.accuracy || '-',
            date: item.serverDate || (item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date().toLocaleDateString()),
            images: item.images || (item.photos ? item.photos.map(p => p.url || p) : [])
          });
        }
      }

      // Filter by surveyor if not admin
      const finalSurveys = isAdmin ? unique : unique.filter(s => s.surveyor_id === username || username.startsWith('iitk'));
      setSurveys(finalSurveys);
      setFilteredSurveys(finalSurveys);
    };

    fetchSurveys();
  }, [username, isAdmin, apiUrl]);

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete survey #${id}?`)) {
      return;
    }

    // Remove from localStorage
    try {
      const localData = JSON.parse(localStorage.getItem('water_surveys') || '[]');
      const updatedLocal = localData.filter(s => (s.surveyId || s.id) !== id);
      localStorage.setItem('water_surveys', JSON.stringify(updatedLocal));
    } catch (err) {
      console.error(err);
    }

    setSurveys(prev => prev.filter(s => s.id !== id));
    if (selectedSurvey?.id === id) {
      setSelectedSurvey(null);
    }
  };

  useEffect(() => {
    let filtered = surveys;
    if (searchTerm) {
      filtered = surveys.filter(s => {
        return (
          s.village?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          s.mandal?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          s.structureType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    setFilteredSurveys(filtered);
  }, [surveys, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shadow-sm">
            <Droplets size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Water Conservation Surveys <span className="text-emerald-700 font-semibold text-lg">/ నీటి సంరక్షణ సర్వేలు</span>
            </h1>
            <p className="text-xs text-slate-500">Track check dams, ponds, trenches, and conservation structures / చెక్ డ్యామ్‌లు, కుంటలు, కందకాలు</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 ml-2">
            {surveys.length} Completed / పూర్తయినవి
          </span>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3 flex-wrap">
          <Link to={`${basePath}/new-water-conservation`} className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white flex items-center w-fit shadow-sm shadow-emerald-600/20">
            <PlusCircle size={18} className="mr-2" />
            New Water Survey / కొత్త సర్వే
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card !p-0">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by Village, Structure, or ID / శోధించండి..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Survey ID / సర్వే ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location / ప్రదేశం</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Structure / నిర్మాణం</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity / సామర్థ్యం</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date / తేదీ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions / చర్యలు</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                    <button onClick={() => setSelectedSurvey(survey)} className="hover:underline font-mono font-bold">
                      #{survey.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{survey.village}</div>
                    <div className="text-xs text-slate-500">{survey.mandal}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {survey.structureType} {survey.structureSubtype && survey.structureSubtype !== '-' ? `(${survey.structureSubtype})` : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700 font-mono">
                    {survey.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {survey.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      onClick={() => setSelectedSurvey(survey)} 
                      className="text-slate-400 hover:text-emerald-600 inline-flex transition-colors" 
                      title="View Survey / వివరాలు చూడండి"
                    >
                      <Eye size={18} />
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={(e) => handleDelete(survey.id, e)} 
                        className="text-slate-400 hover:text-red-600 inline-flex transition-colors" 
                        title="Delete Survey / తొలగించండి"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSurveys.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    No water conservation surveys found matching your criteria. / ఎలాంటి సర్వేలు కనుగొనబడలేదు.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Survey Detail Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Droplets className="text-emerald-600" size={20} />
                  Survey Details: #{selectedSurvey.id}
                </h2>
                <p className="text-xs text-slate-500">Surveyor: {selectedSurvey.surveyor_id} • {selectedSurvey.date}</p>
              </div>
              <button 
                onClick={() => setSelectedSurvey(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Location & Structure info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-600" /> Location & GPS
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-500">Village:</span> <span className="font-semibold text-slate-900">{selectedSurvey.village}</span></p>
                    <p><span className="text-slate-500">Panchayat:</span> <span className="font-semibold text-slate-900">{selectedSurvey.panchayat}</span></p>
                    <p><span className="text-slate-500">Mandal:</span> <span className="font-semibold text-slate-900">{selectedSurvey.mandal}</span></p>
                    <p className="pt-2 font-mono text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                      Lat: {selectedSurvey.latitude}, Lng: {selectedSurvey.longitude}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Ruler size={14} className="text-emerald-600" /> Structure & Dimensions
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-500">Type:</span> <span className="font-semibold text-slate-900">{selectedSurvey.structureType}</span></p>
                    {selectedSurvey.structureSubtype && selectedSurvey.structureSubtype !== '-' && (
                      <p><span className="text-slate-500">Subtype:</span> <span className="font-semibold text-slate-900">{selectedSurvey.structureSubtype}</span></p>
                    )}
                    <p><span className="text-slate-500">Dimensions:</span> <span className="font-mono text-slate-900">{selectedSurvey.dimensions?.length}m × {selectedSurvey.dimensions?.breadth}m × {selectedSurvey.dimensions?.height}m (Depth: {selectedSurvey.dimensions?.depth}m)</span></p>
                    <p><span className="text-slate-500">Capacity:</span> <span className="font-bold text-emerald-600">{selectedSurvey.capacity}</span></p>
                    <p><span className="text-slate-500">Fillings / Year:</span> <span className="font-semibold text-slate-900">{selectedSurvey.fillings} times</span></p>
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Camera size={14} className="text-emerald-600" /> Watermarked Photographs ({selectedSurvey.images?.length || 0})
                </h3>
                {selectedSurvey.images && selectedSurvey.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedSurvey.images.map((imgUrl, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                        <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No photographs uploaded for this survey.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end">
              <button 
                onClick={() => setSelectedSurvey(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
