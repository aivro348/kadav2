import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  PieChart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Droplet,
  Grid
} from 'lucide-react';

export default function SurveyorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const activeModule = sessionStorage.getItem('rws_active_module') || 'borewell';

  let navigation = [];
  if (activeModule === 'hnss') {
    navigation = [
      { name: 'HNSS Surveys', href: '/surveyor/surveys-hnss', icon: FileText },
      { name: 'New HNSS Survey', href: '/surveyor/new-hnss', icon: PlusCircle },
    ];
  } else if (activeModule === 'palar') {
    navigation = [
      { name: 'Palar Surveys', href: '/surveyor/surveys-palar', icon: FileText },
      { name: 'New Palar Survey', href: '/surveyor/new-palar', icon: PlusCircle },
    ];
  } else if (activeModule === 'water-conservation') {
    navigation = [
      { name: 'Water Conservation Surveys', href: '/surveyor/surveys-water-conservation', icon: FileText },
      { name: 'New Water Conservation Survey', href: '/surveyor/new-water-conservation', icon: PlusCircle },
    ];
  } else {
    navigation = [
      { name: 'Borewell Surveys', href: '/surveyor/surveys', icon: FileText },
      { name: 'New Borewell Survey', href: '/surveyor/new', icon: PlusCircle },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 border-b border-slate-100 px-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0">
              <img src="/netzero.jpg" alt="Logo" className="h-8 w-8 object-cover rounded-full shadow-sm border border-emerald-500/30" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-black text-xs text-slate-900 tracking-tight">KADA</span>
                <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300/60 px-1 py-0.2 rounded">NETZERO</span>
              </div>
              <span className="text-[8px] text-slate-500 font-semibold tracking-tight">Kuppam Authority</span>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-500 p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {activeModule.toUpperCase()} Module
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.href + item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}

          <div className="pt-4 border-t border-slate-100 mt-4">
            <NavLink
              to="/select-survey"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-100 hover:text-primary-700 transition-colors border border-dashed border-slate-300"
            >
              <Grid className="mr-3 h-5 w-5 text-primary-600 flex-shrink-0" />
              Switch Module
            </NavLink>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 space-y-2">
          <button 
            onClick={() => {
              sessionStorage.removeItem('rws_username');
              sessionStorage.removeItem('rws_active_module');
              navigate('/login');
            }}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t('nav.logout')}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden border-b border-slate-100">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <img src="/netzero.jpg" alt="Logo" className="h-8 w-8 object-cover rounded-full shadow-sm border border-emerald-500/30" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-black text-xs text-slate-900 tracking-tight">KADA</span>
                  <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300/60 px-1 py-0.2 rounded">NETZERO</span>
                </div>
                <span className="text-[8px] text-slate-500 font-semibold tracking-tight">Kuppam Authority</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -mr-2 text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
