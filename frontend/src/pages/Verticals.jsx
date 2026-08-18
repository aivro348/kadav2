import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Sun, Recycle, ShieldCheck, ArrowRight, Activity, Zap, RefreshCw } from 'lucide-react';

export default function Verticals() {
  const [activeVector, setActiveVector] = useState('water');

  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const vectorDetails = {
    water: {
      title: 'Net Zero Water',
      id: '01',
      icon: Droplet,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      tag: 'Live System',
      tagColor: 'bg-cyan-50 text-cyan-600 border-cyan-150',
      desc: 'Our advanced hydrological telemetry network constitutes the foundational baseline of KADA\'s sustainability framework. Synchronized, real-time sensory monitoring continually maps deep aquifer water tables, facilitating highly optimized groundwater extraction matrices. Fully automated, high-capacity solar pump arrays facilitate water lift without central grid dependence, while strategically engineered check-dams and bioswales capture and route monsoon precipitation directly into deep recharge basins.',
      milestones: [
        'Real-time groundwater telemetry arrays mapping aquifer drawdown.',
        '100% solar pump conversions for rural farming clusters.',
        'Bioswales and check-dams for active soil-moisture retention.'
      ]
    },
    energy: {
      title: 'Net Zero Energy',
      id: '02',
      icon: Sun,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      tag: 'Coming Soon',
      tagColor: 'bg-amber-50 text-amber-600 border-amber-150',
      desc: 'Systematically displacing centralized fossil-fuel overheads through the deployment of localized clean energy generation. KADA is actively constructing decentralized solar micro-grids across primary municipal infrastructures and agricultural clusters. The integration of expansive grid-tied photovoltaic arrays with high-density battery storage reserves ensures highly stable, zero-carbon utility feeds tailored explicitly for rural farming operations and residential consumption.',
      milestones: [
        'Distributed solar arrays on pilot panchayat rooftops.',
        'Decentralized battery vaults for evening grid stability.',
        'Transitioning public lighting systems to clean solar power.'
      ]
    },
    waste: {
      title: 'Net Zero Waste',
      id: '03',
      icon: Recycle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      tag: 'Planning Phase',
      tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-150',
      desc: 'Executing a comprehensive, closed-loop municipal organic waste circularity framework. Precisely segregated biowaste from village logistics hubs is efficiently routed directly into dedicated bio-composting facilities. This organic matter is systematically synthesized into premium-grade compost and redistributed to local farming collectives, radically offsetting reliance on petrochemical fertilizers while actively restoring degraded soil biology and locking in crucial topsoil moisture.',
      milestones: [
        'Decentralized bio-composting returning organic carbon to local soil.',
        'Panchayat resource segregation diverting paper, glass, and metals.',
        'Community waste education programs for zero-landfill goals.'
      ]
    }
  };

  const active = vectorDetails[activeVector];

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-slate-50/30 font-sans text-slate-850">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            System Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
            Interconnected NetZero Verticals
          </h1>
          <p className="mt-4 text-slate-500 text-base sm:text-lg font-light leading-relaxed">
            Interact with the topological nodes within our circularity model below to understand the synergistic mechanics linking our Water, Energy, and Waste sectors into a perfectly closed-loop sustainability cycle.
          </p>
        </motion.div>

        {/* Dynamic Diagram Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20 bg-white/70 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-slate-200/60 shadow-soft">
          
          {/* Animated SVG Diagram (Interactive Loop) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-6">Interactive Circularity Loop</h4>
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Spinning circular pathway */}
              <svg className="absolute w-full h-full animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
              </svg>

              {/* Water Node */}
              <button 
                onClick={() => setActiveVector('water')}
                className={`absolute top-4 w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 border shadow-md ${
                  activeVector === 'water' 
                    ? 'bg-cyan-500 border-cyan-400 text-white scale-110 shadow-glow' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-cyan-300 hover:text-cyan-500'
                }`}
              >
                <Droplet size={24} />
                <span className="text-[9px] font-bold mt-1 uppercase">Water</span>
              </button>

              {/* Energy Node */}
              <button 
                onClick={() => setActiveVector('energy')}
                className={`absolute bottom-4 right-4 w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 border shadow-md ${
                  activeVector === 'energy' 
                    ? 'bg-amber-500 border-amber-400 text-white scale-110 shadow-glow' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-500'
                }`}
              >
                <Sun size={24} />
                <span className="text-[9px] font-bold mt-1 uppercase">Energy</span>
              </button>

              {/* Waste Node */}
              <button 
                onClick={() => setActiveVector('waste')}
                className={`absolute bottom-4 left-4 w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 border shadow-md ${
                  activeVector === 'waste' 
                    ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-glow' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-500'
                }`}
              >
                <Recycle size={24} />
                <span className="text-[9px] font-bold mt-1 uppercase">Waste</span>
              </button>

              {/* Center Loop Indicator */}
              <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-2 shadow-inner">
                <RefreshCw className="text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} size={20} />
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Closed Loop</span>
              </div>
            </div>
          </div>

          {/* Details Content Card */}
          <div className="lg:col-span-6 min-h-[350px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVector}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${active.bg} ${active.color} ${active.border} rounded-xl border flex items-center justify-center`}>
                    <active.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 font-display">{active.title}</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${active.tagColor} inline-block mt-0.5`}>
                      {active.tag}
                    </span>
                  </div>
                </div>

                <p className="text-slate-650 leading-relaxed text-sm sm:text-base font-light mb-6">
                  {active.desc}
                </p>

                <div className="space-y-3 mb-6">
                  <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Key Milestones</h5>
                  {active.milestones.map((m, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-700 font-light">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="leading-snug">{m}</p>
                    </div>
                  ))}
                </div>

                {activeVector === 'water' ? (
                  <a
                    href="https://kada3.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all w-fit"
                  >
                    <span>Launch Live Water Dashboard</span>
                    <ArrowRight size={14} />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-semibold text-xs w-fit">
                    <span>Sector Dashboard in Planning Pipeline</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Explaining the Interconnection */}
            <div className="mt-8 border-t border-slate-200/80 pt-6 flex gap-4 items-center bg-slate-50/60 p-4 rounded-2xl border border-slate-200/40">
              <Activity size={24} className="text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                {activeVector === 'water' && "Water needs Energy for zero-carbon pumping, and relies on compost from Waste to hold soil moisture."}
                {activeVector === 'energy' && "Energy powers Water pumping telemetry networks and runs localized Waste sorting infrastructure."}
                {activeVector === 'waste' && "Waste composting locks soil moisture for Water, and organic matter offsets farming energy demands."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
