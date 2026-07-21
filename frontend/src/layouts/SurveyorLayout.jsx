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
  Droplet
} from 'lucide-react';

export default function SurveyorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.dashboard'), href: '/surveyor', icon: LayoutDashboard },
    { name: 'New Borewell Survey', href: '/surveyor/new', icon: PlusCircle },
    { name: 'New HNSS Survey', href: '/surveyor/new-hnss', icon: Droplet },
    { name: 'New Palar Survey', href: '/surveyor/new-palar', icon: Droplet },
    { name: t('nav.survey_list'), href: '/surveyor/surveys', icon: FileText },
  ];

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
        <div className="flex items-center justify-center h-16 border-b border-slate-100 px-4">
          <img src="/netzero.jpg" alt="Logo" className="h-8 w-8 object-cover rounded-full shadow-sm mr-3" />
          <span className="text-lg font-bold text-slate-800">{t('nav.app_title')}</span>
          <button 
            className="ml-auto lg:hidden text-slate-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.href + item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 space-y-2">
          <button 
            onClick={() => {
              sessionStorage.removeItem('rws_username');
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
        <header className="bg-white shadow-sm lg:hidden">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/netzero.jpg" alt="Logo" className="h-8 w-8 object-cover rounded-full shadow-sm mr-3" />
              <span className="text-lg font-bold text-slate-800">{t('nav.app_title')}</span>
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
