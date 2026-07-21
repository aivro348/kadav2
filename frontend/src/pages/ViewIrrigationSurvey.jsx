import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Map, Ruler, Camera } from 'lucide-react';

export default function ViewIrrigationSurvey() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const surveyType = searchParams.get('type');
  
  const [surveyData, setSurveyData] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = sessionStorage.getItem('rws_username') || 'surveyor';
  const isAdmin = username === 'admin';
  const basePath = isAdmin ? '/admin' : '/surveyor';
  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`${apiUrl}/php-backend/api/irrigation.php?type=${surveyType}&user=${username}&id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setSurveyData(data.survey);
          setPoints(data.points || []);
        }
      } catch (error) {
        console.error('Error fetching survey details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, surveyType, username, apiUrl]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading survey details...</div>;
  if (!surveyData) return <div className="p-8 text-center text-red-500">Survey not found.</div>;

  const getImageUrl = (filename) => {
    if (!filename) return null;
    return `${apiUrl}/php-backend/uploads/${surveyType}/${filename}`;
  };

  const surveyTitle = surveyType === 'hnss' ? 'HNSS Survey' : 'Palar River Survey';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center space-x-4 mb-6">
        <Link to={`${basePath}/surveys-${surveyType}`} className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{surveyTitle} #{surveyData.id}</h1>
          <p className="text-slate-500">Surveyed by {surveyData.surveyor_id} on {new Date(surveyData.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Info */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center">
            <MapPin className="mr-2 text-primary-500" size={20} /> Location Details
          </h2>
          <div><p className="text-sm text-slate-500">Village</p><p className="font-medium text-slate-900">{surveyData.village || '-'}</p></div>
          <div><p className="text-sm text-slate-500">Mandal</p><p className="font-medium text-slate-900">{surveyData.mandal || '-'}</p></div>
          <div><p className="text-sm text-slate-500">Panchayat</p><p className="font-medium text-slate-900">{surveyData.panchayat || '-'}</p></div>
          <div>
            <p className="text-sm text-slate-500">Main GPS Coordinates</p>
            <p className="font-mono text-sm bg-slate-100 p-2 rounded mt-1 inline-block text-slate-800">
              {surveyData.gps_lat}, {surveyData.gps_lng} (Accuracy: {Math.round(surveyData.gps_accuracy)}m)
            </p>
          </div>
        </div>

        {/* Dimensions */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center">
            <Ruler className="mr-2 text-primary-500" size={20} /> Dimensions
          </h2>
          <div><p className="text-sm text-slate-500">Total Length</p><p className="text-xl font-bold text-emerald-600">{surveyData.total_length} m</p></div>
          <div><p className="text-sm text-slate-500">Total Width</p><p className="text-xl font-bold text-purple-600">{surveyData.total_width} m</p></div>
        </div>
      </div>

      {/* Polygon Points */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Polygon Points</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {points.map(pt => (
            <div key={pt.id} className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Point {pt.point_number}</span>
              <p className="font-medium text-slate-800">{pt.point_value || '-'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center">
          <Camera className="mr-2 text-primary-500" size={20} /> Directional Photographs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'North', file: surveyData.photo_north },
            { label: 'East', file: surveyData.photo_east },
            { label: 'South', file: surveyData.photo_south },
            { label: 'West', file: surveyData.photo_west },
          ].map(photo => (
            <div key={photo.label} className="flex flex-col items-center">
              <span className="text-sm font-medium text-slate-600 mb-2">{photo.label}</span>
              {photo.file ? (
                <a href={getImageUrl(photo.file)} target="_blank" rel="noopener noreferrer">
                  <img src={getImageUrl(photo.file)} alt={photo.label} className="w-full aspect-square object-cover rounded-lg border-2 border-slate-200 hover:border-primary-500 transition-colors" />
                </a>
              ) : (
                <div className="w-full aspect-square bg-slate-100 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 text-sm">No Photo</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
