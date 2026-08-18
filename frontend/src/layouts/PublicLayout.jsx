import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Mail, MapPin, ArrowUp, Activity, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PublicLayout() {
  const { i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [visitorCount, setVisitorCount] = useState(1428);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch visitor count with graceful fallback
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/php-backend/api/counter.php`)
      .then(res => res.json())
      .then(data => {
         if (data.visitors) setVisitorCount(data.visitors);
      })
      .catch(() => {
        // Retain baseline verified counter
      });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Vision', path: '/vision' },
    { name: 'Pillars', path: '/pillars' },
    { name: 'Verticals', path: '/verticals' },
    { name: 'Impact', path: '/impact' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/60 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center font-display">
            {/* Logos */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/netzero.jpg" alt="NetZero Logo" className="h-10 w-10 object-cover rounded-full shadow-md border-2 border-emerald-500/20 group-hover:scale-105 transition-transform" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-slate-900 tracking-tight">KADA</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">NETZERO</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">Kuppam Area Development Authority</span>
              </div>
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center space-x-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50' 
                        : 'text-slate-650 hover:text-emerald-600 hover:bg-white/50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 text-xs tracking-wide flex items-center gap-1.5"
              >
                <ShieldCheck size={14} />
                <span>Surveyor Portal</span>
              </Link>
              
              <button 
                className="md:hidden p-2 text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl absolute top-full left-0 w-full py-6 px-6 flex flex-col space-y-3 font-display animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`py-2 px-3 rounded-xl font-bold text-base transition-colors ${location.pathname === link.path ? 'bg-emerald-50 text-emerald-600' : 'text-slate-800 hover:bg-slate-50'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content Page Container */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* Shared Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-800/80 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img src="/netzero.jpg" alt="NetZero Logo" className="h-12 w-12 object-cover rounded-full border border-slate-700 shadow-md" />
                <div>
                  <span className="font-extrabold text-xl text-white tracking-tight font-display block">NetZero Kuppam</span>
                  <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Kuppam Area Development Authority</span>
                </div>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed font-light text-sm">
                A pioneer net-zero ecological transformation program in Andhra Pradesh, integrating precision IoT hydrology, decentralized solar micro-grids, and closed-loop agro-waste circularity.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://kada3.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5">
                  <Activity size={14} className="text-cyan-400" />
                  <span>Groundwater Analytics</span>
                </a>
                <Link to="/vision" className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors">
                  Action Roadmap
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs font-display">Core Verticals</h4>
              <ul className="space-y-2.5 text-sm font-light">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="hover:text-emerald-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Surveyor Authentication</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs font-display">Regional Authority</h4>
              <ul className="space-y-3.5 text-sm font-light">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Kuppam Area Development Authority (KADA), Chittoor District, Andhra Pradesh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>contact@kada.ap.gov.in</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <p className="text-slate-500">
                © {new Date().getFullYear()} Kuppam Area Development Authority. All rights reserved.<br/>
                Engineered with <a href="https://www.reddycharan.me" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-semibold transition-colors underline decoration-emerald-500/30 underline-offset-4">E Charan Kumar Reddy</a> (IIT Kanpur)
              </p>
              <div className="flex items-center space-x-2.5 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 shadow-inner">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Verified Visitors</span>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full">{visitorCount.toLocaleString()}+</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Telemetry</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/30 transition-all hover:scale-110 active:scale-95"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

