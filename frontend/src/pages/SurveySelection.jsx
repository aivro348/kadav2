import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function SurveySelection() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('rws_username');
  const isAdmin = username === 'admin';

  const handleSelect = (type) => {
    if (isAdmin) {
      if (type === 'borewell') navigate('/admin/dashboard');
      else if (type === 'hnss') navigate('/admin/dashboard-hnss');
      else if (type === 'palar') navigate('/admin/dashboard-palar');
    } else {
      if (type === 'borewell') navigate('/surveyor/surveys');
      else if (type === 'hnss') navigate('/surveyor/surveys-hnss');
      else if (type === 'palar') navigate('/surveyor/surveys-palar');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rws_username');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 py-4 px-6 sm:px-10 flex justify-between items-center z-10">
        <div className="flex items-center">
          <img src="/netzero.jpg" alt="Logo" className="h-10 w-10 object-cover rounded-full shadow-sm mr-3" />
          <h1 className="text-xl font-bold text-slate-800">RWS & S Department</h1>
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
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
