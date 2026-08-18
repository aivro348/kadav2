import React from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Users, Leaf, ArrowUpRight, Award, Landmark } from 'lucide-react';

export default function Impact() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const statistics = [
    { icon: Target, val: '2030', label: 'NetZero Target Year', desc: 'Achieving total carbon-neutral status for all municipal operations and localized water tables.', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { icon: Activity, val: '500+', label: 'Solar Pumps Planned', desc: 'Upgrading deep farming borewells to solar arrays to remove grid pressure.', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { icon: Users, val: '50,000+', label: 'Citizens Impacted', desc: 'Providing safe groundwater access, clean air, and bio-fertilizer supply loops to Kuppam families.', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    { icon: Leaf, val: '1,000,000+', label: 'Saplings Planted', desc: 'Executing local native afforestation to develop permanent natural carbon offsets.', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' }
  ];

  const targets = [
    { name: 'Rural Water Supply Telemetry Mapping', progress: 85, current: '425 Borewells', target: '500 Borewells' },
    { name: 'Decentralized Solar Micro-Grids', progress: 40, current: '2 Clusters', target: '5 Clusters' },
    { name: 'AfforestationSaplings In Soil', progress: 30, current: '300,000 Saplings', target: '1,000,000 Saplings' },
    { name: 'Panchayat Waste Circularity', progress: 55, current: '11 Facilities', target: '20 Facilities' }
  ];

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-slate-50/30">
      {/* Ambient background light */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            Our Progress
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
            Impact & Target Metrics
          </h1>
          <p className="mt-4 text-slate-500 text-base sm:text-lg font-light leading-relaxed">
            Comprehensive, real-time analytics visualizing KADA's quantitative sustainability metrics, programmatic community reach, and critical infrastructural milestone progression.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {statistics.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl border ${stat.border} flex items-center justify-center mb-5`}>
                  <stat.icon size={20} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 font-display mb-1">{stat.val}</h3>
                <h4 className="text-slate-550 text-xs font-bold uppercase tracking-wider mb-3">{stat.label}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-light">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Metrics Overview */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Target Tracking Bars */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-soft space-y-6"
          >
            <h2 className="text-xl font-bold text-slate-900 font-display mb-4">Milestone Tracker</h2>
            <div className="space-y-6">
              {targets.map((target, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-800">
                    <span>{target.name}</span>
                    <span className="text-emerald-600 font-bold">{target.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${target.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Current: {target.current}</span>
                    <span>Target: {target.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Impact Overview Callout */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl w-fit mb-5">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Consolidated Progress Reports</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                KADA establishes direct, bi-directional coordination with localized panchayat bodies to rigorously verify all comprehensive energy audits, sapling survivability metrics, and real-time groundwater table measurements. Every individual data point rendered here signifies a tangible, verifiable structural transition actively shaping Kuppam's ecological resilience.
              </p>
              <div className="flex gap-4 items-center border-t border-slate-800 pt-4">
                <Landmark size={20} className="text-slate-400 flex-shrink-0" />
                <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">Verified by Kuppam Area Development Authority</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
