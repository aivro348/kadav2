import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Droplet, Clock, Info, Image as ImageIcon, Printer, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ViewSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isSurveyor = location.pathname.startsWith('/surveyor');

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this Borewell Survey? This will permanently remove it from the phpMyAdmin database.")) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/php-backend/api/surveys.php?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        navigate(isSurveyor ? '/surveyor/surveys' : '/admin/surveys');
      } else {
        alert(data.error || "Failed to delete survey.");
      }
    } catch (err) {
      alert("Error deleting survey: " + err.message);
    }
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const data = await api.get(`/surveys.php?id=${id}`);
        
        // Structure the data to match what the UI expects
        setSurvey({
          id: data.survey_id,
          village: data.village,
          mandal: data.mandal,
          status: data.status,
          date: data.created_date ? data.created_date.split(' ')[0] : 'Unknown',
          fullData: data,
          images: data.images ? data.images.map(img => img.startsWith('data:image') ? img : `${apiUrl}/php-backend/${img}`) : []
        });
      } catch (error) {
        console.error('Error fetching survey:', error);
        setSurvey(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id, apiUrl]);

  if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>;
  
  if (!survey) return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Survey Not Found</h2>
      <p className="text-slate-600 mb-6">The survey ID {id} does not exist.</p>
      <Link to=".." className="btn-primary">Return to List</Link>
    </div>
  );

  const fd = survey.fullData || {};

  const Section = ({ title, icon: Icon, children }) => (
    <div className="card mb-6">
      <div className="flex items-center mb-4 pb-2 border-b border-slate-100">
        <Icon className="text-primary-600 mr-2" size={20} />
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const DataRow = ({ label, value }) => (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-b border-slate-50 last:border-0">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-medium">{value}</dd>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center mb-2 text-sm text-slate-500">
            <Link to=".." className="hover:text-primary-600 flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to List
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Survey {survey.id}
            <span className={`ml-4 px-3 py-1 text-xs font-semibold rounded-full ${survey.status === 'Successful' ? 'bg-success-100 text-success-800' : survey.status === 'Dried' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {survey.status}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Recorded on {survey.date}</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary flex items-center shadow-sm">
            <Printer size={16} className="mr-2" /> Print
          </button>
          {!isSurveyor && (
            <>
              <button className="btn-primary flex items-center bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Edit size={16} className="mr-2" /> Edit
              </button>
              <button 
                onClick={handleDelete}
                className="btn-secondary flex items-center text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 shadow-sm"
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <Section title="Location Details" icon={MapPin}>
            <dl>
              <DataRow label="Mandal" value={survey.mandal} />
              <DataRow label="Panchayat" value={fd.panchayat || '-'} />
              <DataRow label="Village" value={survey.village} />
              <DataRow label="GPS Coordinates" value={`${fd.latitude || '-'}, ${fd.longitude || '-'}`} />
            </dl>
          </Section>

          <Section title="Borewell Specifics" icon={Info}>
            <dl>
              <DataRow label="Type" value={survey.type} />
              <DataRow label="Supply Nature" value={Array.isArray(fd.supply_nature) ? fd.supply_nature.join(', ') : fd.supply_nature || '-'} />
              <DataRow label="Borewell Depth" value={fd.borewell_depth ? `${fd.borewell_depth} ft` : '-'} />
              <DataRow label="Motor Capacity" value={fd.motor_capacity ? `${fd.motor_capacity} HP` : '-'} />
              <DataRow label="Motor Depth" value={fd.motor_depth ? `${fd.motor_depth} ft` : '-'} />
              <DataRow label="Delivery Pipe" value={fd.delivery_pipe ? `${fd.delivery_pipe} inch` : '-'} />
              <DataRow label="Water Level (Fixing)" value={fd.water_level_fixing ? `${fd.water_level_fixing} ft` : '-'} />
              <DataRow label="Water Struck Depth" value={fd.water_struck_depth ? `${fd.water_struck_depth} ft` : '-'} />
            </dl>
          </Section>
          
          <Section title="Utilization" icon={Droplet}>
            <dl>
              <DataRow label="Crop Category" value={fd.crop_category || '-'} />
              <DataRow label="Crop Names" value={fd.crop_names || '-'} />
              <DataRow label="Agri Land Area" value={fd.agri_land_area ? `${fd.agri_land_area} Acres` : '-'} />
              <DataRow label="Families Dependent" value={fd.dependent_families || '-'} />
              <DataRow label="Animals Dependent" value={fd.dependent_animals || '-'} />
            </dl>
          </Section>
        </div>

        {/* Right Column */}
        <div>
          <Section title="Water Quality" icon={Droplet}>
            <dl>
              <DataRow label="TDS" value={fd.tds ? `${fd.tds} mg/L` : '-'} />
              <DataRow label="pH Level" value={fd.ph || '-'} />
              <DataRow label="Hardness" value={fd.hardness ? `${fd.hardness} mg/L` : '-'} />
            </dl>
          </Section>

          <Section title="History" icon={Clock}>
            <dl>
              <DataRow label="Drilled Year" value={fd.drilled_year || '-'} />
              <DataRow label="Dried Year" value={fd.dried_year || '-'} />
              <DataRow label="Dried Months" value={fd.dried_months || '-'} />
            </dl>
          </Section>

          <Section title="Images" icon={ImageIcon}>
            {survey.images && survey.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mt-2">
                {survey.images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-slate-200 rounded-md overflow-hidden relative border border-slate-200">
                    <img src={img} alt="Survey Image" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-md border border-slate-200 mt-2">
                No images attached to this survey.
              </div>
            )}
            {survey.images && survey.images.length > 0 && (
              <p className="text-xs text-slate-500 mt-3 text-center">Click image to enlarge</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
