import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Droplet, Sun, Wind, 
  Target, Activity, Users, Leaf, ShieldCheck, Landmark, Recycle,
  ExternalLink, ChevronDown, CheckCircle2, Database, MapPin, Sparkles, Cpu, GraduationCap
} from 'lucide-react';

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const faqs = [
    {
      q: "How does KADA's IoT groundwater telemetry system operate in real-time?",
      a: "Specialized hydrostatic pressure and ultrasonic IoT telemetry sensors are installed deep within representative borewells. Every 60 minutes, these sensors transmit encrypted aquifer depth and yield metrics to our central PostgreSQL time-series database, feeding live analytics dashboards for predictive groundwater management."
    },
    {
      q: "How can agricultural farmers transition their borewell pump sets to clean solar energy?",
      a: "Under the KADA Renewable Grid initiative in collaboration with state solar subsidies, registered farmers can apply through their local Panchayat or the Surveyor Portal for grid-tied and stand-alone solar pump conversions, eliminating volatile grid outages and diesel dependencies."
    },
    {
      q: "What native species are prioritized for the 1,000,000+ sapling afforestation program?",
      a: "We scientifically select indigenous deep-rooting species such as Neem (Azadirachta indica), Pongamia (Millettia pinnata), and Jamun (Syzygium cumini). These trees maximize sub-surface moisture retention, resist local drought conditions, and establish permanent carbon sequestration sinks across Kuppam's watershed corridors."
    },
    {
      q: "How does the zero-waste circularity loop replenish local agricultural soils?",
      a: "Municipal and rural biowaste is segregated at the source and channeled into decentralized aerobic bio-composting units. The resulting nitrogen-rich organic humus is redistributed directly to regional farmers, replacing synthetic petrochemical fertilizers and enhancing soil organic carbon."
    }
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-850 selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            src="/hero-bg.png" 
            alt="Aerial view of Kuppam" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950/90"></div>
        </div>

        {/* Floating Ambient Light Accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/40">
              <Landmark size={13} className="text-emerald-400" /> KADA Sustainable Future Initiative
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.18] sm:leading-[1.12] font-display tracking-tight drop-shadow-2xl max-w-5xl"
          >
            Pioneering a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">NetZero</span><br />
            Future for Kuppam
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-200/90 font-light max-w-2xl mx-auto drop-shadow-md leading-relaxed px-2"
          >
            Empowering Kuppam with next-generation sustainable infrastructure to secure a resilient, zero-emission ecosystem.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs sm:max-w-none"
          >
            <Link to="/vision" className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-300 text-center flex items-center justify-center gap-2 group">
              <span>Explore Our Vision</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link to="/login" className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all backdrop-blur-md text-center flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Surveyor Portal</span>
            </Link>
          </motion.div>

          {/* Quick Stats Overlay */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl mx-auto border-t border-white/15 pt-6 sm:pt-8"
          >
            {[
              { label: 'Sustainability Target', value: '100%', sub: 'NetZero Mandate' },
              { label: 'Carbon Reduction', value: 'Net Zero', sub: 'Regional Goal' },
              { label: 'Hydrological Telemetry', value: '24/7 Smart', sub: 'Live Sensor Array' },
              { label: 'Afforestation Goal', value: '1M+ Trees', sub: 'Indigenous Species' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                className="bg-slate-900/50 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all text-center"
              >
                <div className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-display tracking-tight">{stat.value}</div>
                <div className="text-slate-200 text-[11px] sm:text-xs font-semibold mt-1">{stat.label}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stakeholders & Institutional Partners Banner */}
      <section className="py-5 sm:py-6 bg-slate-900 border-b border-slate-800 text-slate-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="text-[10px] sm:text-[11px] text-slate-500 tracking-widest font-extrabold">Institutional Alliance:</span>
            <div className="flex items-center gap-2 text-slate-300">
              <Landmark size={15} className="text-emerald-400" />
              <span className="text-[11px] sm:text-xs">Govt. of Andhra Pradesh</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span className="text-[11px] sm:text-xs">Kuppam Area Development Authority</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <GraduationCap size={15} className="text-emerald-400" />
              <span className="text-[11px] sm:text-xs">IIT Kanpur</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Constituency Sector Dashboards Hub */}
      <section id="sector-dashboards" className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-cyan-500/10 text-cyan-700 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-3">
              <Database size={13} className="text-cyan-600" /> Regional Data Infrastructure
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">Constituency Sector Dashboards</h2>
            <p className="text-slate-500 text-xs sm:text-base mt-2 font-light leading-relaxed">
              Dedicated real-time analytics portals across Kuppam's four core sustainability sectors. The Groundwater Telemetry system is actively deployed, with additional sector dashboards currently in pipeline development.
            </p>
          </div>

          {/* 4 Sector Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {/* 1. Water Dashboard - Live (BENTO BOX) */}
            {/* 1. Water Dashboard - Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <Link to="/dashboards/water" className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all duration-300 h-full group block">
              <div>
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                    <Droplet size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live & Operational
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1">Sector 01</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1">Water</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Smart Water & Groundwater Telemetry</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Real-time sub-surface aquifer depth sensors, 440+ telemetry borewells, automated yield tracking, and GIS recharge analytics.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Live Infrastructure:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                      <span>Aquifer Depth Sensors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                      <span>Telemetry Borewells</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                      <span>Automated Yield Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                      <span>GIS Recharge Analytics</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-blue-500 shadow-md group-hover:scale-[1.02] transition-transform">
                <Activity size={16} className="animate-pulse" />
                <span>Launch Demo Dashboard</span>
              </div>
              </Link>
            </motion.div>

            {/* 2. Energy Dashboard - Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-full"
            >
              <Link to="/dashboards/energy" className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-amber-400 hover:shadow-xl transition-all duration-300 h-full group block">
              <div>
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shadow-sm">
                    <Sun size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                    Phase 2 Pipeline • Q3-Q4 2026
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-600 uppercase tracking-wider block mb-1">Sector 02</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1">Energy</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Renewable Energy & Solar Pumps</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Centralized telemetry dashboard for tracking agricultural solar pump conversions, micro-grid generation efficiency, and battery storage reserve status.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Planned Architecture:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                      <span>Solar PV Generation Logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                      <span>Pump Uptime Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                      <span>Grid Peak Offset Feeds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                      <span>Decentralized Storage</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-400 shadow-md group-hover:scale-[1.02] transition-transform">
                <Activity size={16} className="animate-pulse" />
                <span>Launch Demo Dashboard</span>
              </div>
              </Link>
            </motion.div>

            {/* 3. Waste Dashboard - Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <Link to="/dashboards/waste" className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-purple-400 hover:shadow-xl transition-all duration-300 h-full group block">
              <div>
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-sm">
                    <Recycle size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                    Phase 3 Pipeline • 2027
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-purple-600 uppercase tracking-wider block mb-1">Sector 03</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1">Waste</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Zero-Waste & Bio-Composting Flow</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Panchayat-level organic waste segregation tracking, bio-fertilizer conversion analytics, and distribution ledgers to local agricultural collectives.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Planned Architecture:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                      <span>Source Segregation Logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                      <span>Bio-Compost Batches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                      <span>Farmer Allocation Ledger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                      <span>Landfill Divergence Rate</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-purple-500 shadow-md group-hover:scale-[1.02] transition-transform">
                <Activity size={16} className="animate-pulse" />
                <span>Launch Demo Dashboard</span>
              </div>
              </Link>
            </motion.div>

            {/* 4. Carbon Accounting Dashboard - Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-full"
            >
              <Link to="/dashboards/carbon" className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all duration-300 h-full group block">
              <div>
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-sm">
                    <Leaf size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    Phase 3 Pipeline • 2027
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">Sector 04</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1">Carbon Accounting</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Afforestation & Carbon Sinks Monitor</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Multi-spectral satellite canopy index (NDVI), native sapling survivability registries, and sub-surface moisture retention mapping across watersheds.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Planned Architecture:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      <span>Satellite NDVI Imagery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      <span>1M+ Sapling Registry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      <span>Soil Moisture Contours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      <span>Carbon Sequestration Log</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-blue-500 shadow-md group-hover:scale-[1.02] transition-transform">
                <Activity size={16} className="animate-pulse" />
                <span>Launch Demo Dashboard</span>
              </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motivation & Core Blueprint */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} className="text-emerald-600" /> Strategic Mandate
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mb-6 leading-tight">
                A Comprehensive Blueprint for Ecological Harmony
              </h2>
              <p className="text-slate-600 font-light leading-relaxed mb-6 text-sm sm:text-base">
                The Kuppam Area Development Authority (KADA) is masterminding a highly structured, transformative framework intended to establish Kuppam as India's premier clean, modern, and net-zero model constituency. By harmonizing IoT telemetry, distributed solar generation, afforestation, and closed-loop organic circularity, we establish an integrated network that honors our natural resources.
              </p>
              
              <div className="space-y-3 mb-8">
                {[
                  "100% Sub-surface telemetry mapping of rural drinking & irrigation wells.",
                  "Zero-grid load conversion via distributed solar photovoltaic micro-arrays.",
                  "Total agro-waste circularity returning bio-compost to local farmers."
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-light">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <Link to="/vision" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-bold text-sm transition-colors group">
                <span>Read our full action plan & milestone timeline</span> 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
              <img src="/hero-bg.png" alt="Ecological Blueprint" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">Kuppam Region</span>
                  <h4 className="text-base font-bold font-display">Integrated Watershed & Solar Grid Map</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Sustainability Pillars Preview */}
      <section className="py-24 bg-white border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-3">
            Core Framework
          </span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mb-12">The Four Pillars of Sustainability</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Droplet, title: 'Smart Water', desc: 'Rejuvenating vital deep aquifers via real-time telemetric monitoring grids.', tag: '100% Monitored', color: 'blue' },
              { icon: Sun, title: 'Renewable Energy', desc: 'Transitioning rural agricultural pumps and public lights to solar micro-grids.', tag: 'Solar First', color: 'amber' },
              { icon: Leaf, title: 'Afforestation', desc: 'Planting 1,000,000+ native saplings to establish permanent regional carbon sinks.', tag: '1M+ Trees', color: 'emerald' },
              { icon: Recycle, title: 'Zero Waste', desc: 'Driving closed-loop segregation logistics and bio-composting agricultural loops.', tag: 'Closed Loop', color: 'purple' }
            ].map((pillar, i) => (
              <Link 
                to={`/pillars`}
                key={i} 
                className="bg-slate-50/70 hover:bg-white p-6 rounded-3xl border border-slate-200/70 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                      <pillar.icon size={22} />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-200/60 text-slate-700">{pillar.tag}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2 font-display">{pillar.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-light">{pillar.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-200/50 flex items-center text-xs font-bold text-emerald-600 gap-1">
                  <span>Learn more</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          
          <Link to="/pillars" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-bold text-sm transition-colors group">
            <span>Explore all four core pillars and technical roadmaps</span> 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Surveyor Call to Action */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800 relative p-8 sm:p-12 md:p-14"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid md:grid-cols-5 gap-8 relative z-10 items-center">
              <div className="col-span-3 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} /> Authorized Personnel
                </div>
                <h2 className="text-3xl font-extrabold text-white font-display leading-tight">
                  Rural Water Supply Field Survey
                </h2>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  Field surveyors can authenticate to record smart tags, capture geo-referenced borewell imagery, and register pump mechanics directly into the central telemetry registry.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link to="/login" className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3 rounded-full font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 group">
                    <span>Access Surveyor Portal</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a 
                    href="https://kada3.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-full font-bold text-xs transition-all border border-slate-700"
                  >
                    <span>View Public Telemetry</span>
                  </a>
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/60 col-span-2 space-y-3.5 text-xs">
                <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-display">System Capabilities:</h4>
                <div className="flex items-center gap-2.5 text-slate-300 font-light">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Real-time GPS tag verification</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300 font-light">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Sub-surface aquifer depth logging</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300 font-light">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>High-resolution borewell photo uploads</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300 font-light">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>HNSS & Palar irrigation basin linkage</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive FAQ / Key Directives Section */}
      <section className="py-24 bg-white border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-3">
              Frequently Asked Questions
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">Key Directives & Inquiries</h3>
            <p className="text-slate-500 text-sm mt-2 font-light">Understanding the technical and ecological mechanisms driving Kuppam's NetZero mandate.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-slate-50/80 border-emerald-400/60 shadow-md shadow-emerald-950/5' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 font-display font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <div className={`p-1.5 rounded-full bg-slate-100 text-slate-600 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 bg-emerald-500 text-white' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-200/50 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

