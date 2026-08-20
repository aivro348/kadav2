import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Droplet, Sun, Recycle, Leaf, Activity } from 'lucide-react';

export default function DashboardsSection() {
  return (
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
          {/* 1. Water Dashboard - Live */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <Link to="/dashboards/water" className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200/60 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-blue-500/80 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 h-full group block">
              {/* Stunning Background Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="/net-zero-water.png" 
                  alt="Water Telemetry" 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-25 group-hover:opacity-35 saturate-150" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95 group-hover:from-white/90 group-hover:via-white/75 group-hover:to-white/90 transition-colors duration-500" />
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl border border-blue-200/60 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Droplet size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-emerald-500/15 text-emerald-700 border border-emerald-300/60 shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live & Operational
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1">Sector 01</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1 group-hover:text-blue-600 transition-colors">Water</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Smart Water & Groundwater Telemetry</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Real-time sub-surface aquifer depth sensors, 440+ telemetry borewells, automated yield tracking, and GIS recharge analytics.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm group-hover:border-blue-200/60 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Live Infrastructure:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span>Aquifer Depth Sensors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span>Telemetry Borewells</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span>Automated Yield Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span>GIS Recharge Analytics</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-blue-500 shadow-md shadow-blue-600/20 group-hover:scale-[1.02] transition-transform">
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
            <Link to="/dashboards/energy" className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-amber-500/80 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 h-full group block">
              {/* Stunning Background Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="/net-zero-energy.png" 
                  alt="Solar Energy" 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-25 group-hover:opacity-35 saturate-150" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95 group-hover:from-white/90 group-hover:via-white/75 group-hover:to-white/90 transition-colors duration-500" />
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-200/60 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Sun size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-amber-500/15 text-amber-700 border border-amber-300/60 shadow-sm backdrop-blur-sm">
                    Phase 2 Pipeline • Q3-Q4 2026
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-600 uppercase tracking-wider block mb-1">Sector 02</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1 group-hover:text-amber-600 transition-colors">Energy</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Renewable Energy & Solar Pumps</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Centralized telemetry dashboard for tracking agricultural solar pump conversions, micro-grid generation efficiency, and battery storage reserve status.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm group-hover:border-amber-200/60 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Planned Architecture:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span>Solar PV Generation Logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span>Pump Uptime Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span>Grid Peak Offset Feeds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span>Decentralized Storage</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-400 shadow-md shadow-amber-500/20 group-hover:scale-[1.02] transition-transform">
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
            <Link to="/dashboards/waste" className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200/60 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-purple-500/80 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 h-full group block">
              {/* Stunning Background Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="/net-zero-waste.png" 
                  alt="Zero Waste Circularity" 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-25 group-hover:opacity-35 saturate-150" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95 group-hover:from-white/90 group-hover:via-white/75 group-hover:to-white/90 transition-colors duration-500" />
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl border border-purple-200/60 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Recycle size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-purple-500/15 text-purple-700 border border-purple-300/60 shadow-sm backdrop-blur-sm">
                    Phase 3 Pipeline • 2027
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-purple-600 uppercase tracking-wider block mb-1">Sector 03</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1 group-hover:text-purple-600 transition-colors">Waste</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Zero-Waste & Bio-Composting Flow</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Panchayat-level organic waste segregation tracking, bio-fertilizer conversion analytics, and distribution ledgers to local agricultural collectives.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm group-hover:border-purple-200/60 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Planned Architecture:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                      <span>Source Segregation Logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                      <span>Bio-Compost Batches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                      <span>Farmer Allocation Ledger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                      <span>Landfill Divergence Rate</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-purple-500 shadow-md shadow-purple-600/20 group-hover:scale-[1.02] transition-transform">
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
            <Link to="/dashboards/carbon" className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-soft relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/80 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 h-full group block">
              {/* Stunning Background Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="/net-zero-forestry.png" 
                  alt="Carbon Sinks & Afforestation" 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-25 group-hover:opacity-35 saturate-150" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95 group-hover:from-white/90 group-hover:via-white/75 group-hover:to-white/90 transition-colors duration-500" />
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-200/60 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Leaf size={24} />
                  </div>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-blue-500/15 text-blue-700 border border-blue-300/60 shadow-sm backdrop-blur-sm">
                    Phase 3 Pipeline • 2027
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">Sector 04</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1 group-hover:text-emerald-600 transition-colors">Carbon Accounting</h3>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Afforestation & Carbon Sinks Monitor</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Multi-spectral satellite canopy index (NDVI), native sapling survivability registries, and sub-surface moisture retention mapping across watersheds.
                </p>

                <div className="space-y-2 mb-6 sm:mb-8 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm group-hover:border-emerald-200/60 transition-colors">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Planned Architecture:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span>Satellite NDVI Imagery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span>1M+ Sapling Registry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span>Soil Moisture Contours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span>Carbon Sequestration Log</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-emerald-500 shadow-md shadow-emerald-600/20 group-hover:scale-[1.02] transition-transform">
                <Activity size={16} className="animate-pulse" />
                <span>Launch Demo Dashboard</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
