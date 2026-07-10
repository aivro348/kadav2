import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Droplet, Clock, Info, Image as ImageIcon, Printer, Edit, Trash2 } from 'lucide-react';

export default function ViewSurvey() {
  const { id } = useParams();
  const location = useLocation();
  const isSurveyor = location.pathname.startsWith('/surveyor');

  // Mock data
  const survey = {
    id: id || 'SRV-1024',
    location: {
      mandal: 'Maddipadu',
      panchayat: 'Maddipadu GP',
      village: 'Maddipadu',
      latitude: '15.654321',
      longitude: '79.123456'
    },
    statusDetails: {
      status: 'Successful',
      type: ['Agriculture / Horticulture', 'Livestock / Animals'],
      supplyNature: 'Continuous adequate supply during monsoons, reduces in summer.'
    },
    borewell: {
      depth: 250,
      motorCapacity: 5.0,
      motorDepth: 200
    },
    quality: {
      tds: 450,
      ph: 7.2,
      hardness: 200
    },
    history: {
      drilledYear: 2018,
      dried: 'No',
      driedMonths: '-'
    },
    utilization: {
      cropType: 'Paddy, Cotton',
      other: 'Domestic use',
      animals: 12
    },
    date: '2026-07-10 14:30',
    surveyor: 'Rajesh Kumar'
  };

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
            <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
              {survey.statusDetails.status}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Recorded on {survey.date} by {survey.surveyor}</p>
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
              <button className="btn-secondary flex items-center text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 shadow-sm">
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
              <DataRow label="Mandal" value={survey.location.mandal} />
              <DataRow label="Panchayat" value={survey.location.panchayat} />
              <DataRow label="Village" value={survey.location.village} />
              <DataRow label="GPS Coordinates" value={`${survey.location.latitude}, ${survey.location.longitude}`} />
            </dl>
          </Section>

          <Section title="Borewell Specifics" icon={Info}>
            <dl>
              <DataRow label="Type" value={survey.statusDetails.type.join(', ')} />
              <DataRow label="Supply Nature" value={survey.statusDetails.supplyNature} />
              <DataRow label="Borewell Depth" value={`${survey.borewell.depth} ft`} />
              <DataRow label="Motor Capacity" value={`${survey.borewell.motorCapacity} HP`} />
              <DataRow label="Motor Depth" value={`${survey.borewell.motorDepth} ft`} />
            </dl>
          </Section>
          
          <Section title="Utilization" icon={Droplet}>
            <dl>
              <DataRow label="Crop Type" value={survey.utilization.cropType} />
              <DataRow label="Other Usage" value={survey.utilization.other} />
              <DataRow label="Animals Dependent" value={survey.utilization.animals} />
            </dl>
          </Section>
        </div>

        {/* Right Column */}
        <div>
          <Section title="Water Quality" icon={Droplet}>
            <dl>
              <DataRow label="TDS" value={`${survey.quality.tds} mg/L`} />
              <DataRow label="pH Level" value={survey.quality.ph} />
              <DataRow label="Hardness" value={survey.quality.hardness} />
            </dl>
          </Section>

          <Section title="History" icon={Clock}>
            <dl>
              <DataRow label="Drilled Year" value={survey.history.drilledYear} />
              <DataRow label="Has it dried?" value={survey.history.dried} />
              <DataRow label="Dried Months" value={survey.history.driedMonths} />
            </dl>
          </Section>

          <Section title="Images" icon={ImageIcon}>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {/* Mock Images */}
              <div className="aspect-square bg-slate-200 rounded-md overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-slate-400 flex items-center justify-center text-white font-medium">Image 1</div>
              </div>
              <div className="aspect-square bg-slate-200 rounded-md overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-slate-400 flex items-center justify-center text-white font-medium">Image 2</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">Click image to enlarge</p>
          </Section>
        </div>
      </div>
    </div>
  );
}
