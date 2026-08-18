import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function SurveySelection() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('rws_username');
  const isAdmin = username === 'admin';

  const handleSelect = (type) => {
    sessionStorage.setItem('rws_active_module', type);
    if (isAdmin) {
      if (type === 'borewell') navigate('/admin/dashboard');
      else if (type === 'hnss') navigate('/admin/dashboard-hnss');
      else if (type === 'palar') navigate('/admin/dashboard-palar');
      else if (type === 'water-conservation') navigate('/admin/surveys-water-conservation');
    } else {
      if (type === 'borewell') navigate('/surveyor/surveys');
      else if (type === 'hnss') navigate('/surveyor/surveys-hnss');
      else if (type === 'palar') navigate('/surveyor/surveys-palar');
      else if (type === 'water-conservation') navigate('/surveyor/surveys-water-conservation');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rws_username');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 py-3.5 px-6 sm:px-10 flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group bg-white/95 hover:bg-white py-1 px-2.5 rounded-xl border border-slate-200/80 shadow-sm transition-all flex-shrink-0">
          <div className="relative flex-shrink-0">
            <img src="/netzero.jpg" alt="NetZero Logo" className="h-8 w-8 sm:h-9 sm:w-9 object-cover rounded-full shadow-sm border border-emerald-500/30 group-hover:scale-105 transition-transform" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tight">KADA</span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-700 bg-emerald-100/80 border border-emerald-300/60 px-1 sm:px-1.5 py-0.2 rounded-md">NETZERO</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-600 font-semibold tracking-wide hidden sm:block">Kuppam Area Development Authority</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
            Welcome, <span className="text-primary-700 font-bold">{username}</span>
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-md"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Select Survey Module</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the geographic survey category you wish to access. 
            Each module maintains its own dedicated database and reporting infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Water Conservation Card */}
          <button 
            onClick={() => handleSelect('water-conservation')}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left border border-slate-200"
          >
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
              <img src="/water_conservation_card.jpg" alt="Water Conservation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm">NetZero Initiative</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">Water Conservation</h3>
              <p className="text-sm text-slate-600">
                Capture high-accuracy GPS and watermarked photography of Check Dams, Trenches, and Ponds.
              </p>
            </div>
          </button>

          {/* Borewell Card */}
          <button 
            onClick={() => handleSelect('borewell')}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left border border-slate-200"
          >
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
              <img src="/borewell_card.jpg" alt="Borewell Rig" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-sm">Water Resources</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Borewell Survey</h3>
              <p className="text-sm text-slate-600">
                Track groundwater extraction points, water quality (TDS/pH), and borewell depth metrics across various mandals.
              </p>
            </div>
          </button>

          {/* HNSS Card */}
          <button 
            onClick={() => handleSelect('hnss')}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left border border-slate-200"
          >
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
              <img src="/hnss_card.jpg" alt="HNSS Canal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">Irrigation Network</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">HNSS Survey</h3>
              <p className="text-sm text-slate-600">
                Handri-Neeva Sujala Sravanthi canal network monitoring, capturing dimensions, structural points, and directional photography.
              </p>
            </div>
          </button>

          {/* Palar Card */}
          <button 
            onClick={() => handleSelect('palar')}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left border border-slate-200"
          >
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
              <img src="/palar_card.jpg" alt="Palar River" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-sm">River Basin</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Palar River Survey</h3>
              <p className="text-sm text-slate-600">
                Riverbed geographical mapping, tracking basin dimensions and polygon coordinate mapping for the Palar River system.
              </p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
