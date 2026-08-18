import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Sun, Leaf, Recycle, ShieldCheck, ArrowRight, Zap, Target } from 'lucide-react';

export default function Pillars() {
  const [activeTab, setActiveTab] = useState('water');

  const pillarsData = {
    water: {
      title: 'Intelligent Hydrological Management',
      icon: Droplet,
      image: '/net-zero-water.png',
      color: 'blue',
      tagline: 'Securing regional agricultural and domestic stability through advanced telemetry networks.',
      desc: 'Deploying high-precision IoT telemetry across rural borewells to dynamically monitor aquifer depths and extraction rates. Coupled with a 100% transition to decentralized solar-powered pumping infrastructure, we are engineering a zero-emission water grid that proactively mitigates the risk of groundwater depletion while ensuring equitable resource distribution.',
      actions: [
        'Deploy IoT telemetric sensors on rural borewells to log hourly aquifer depths.',
        'Establish solar-powered micro-irrigation systems to eliminate grid strain.',
        'Map regional watershed contours to construct optimized check-dams.'
      ],
      upcoming: [
        'Deploy predictive water-level alerts powered by regional models.',
        'Implement smart-shutoff valves to prevent well over-extraction.'
      ]
    },
    energy: {
      title: 'Decentralized Renewable Grids',
      icon: Sun,
      image: '/net-zero-energy.png',
      color: 'amber',
      tagline: 'Powering public infrastructure and agriculture via highly efficient distributed solar networks.',
      desc: 'Executing a massive transition of high-load agricultural pump sets and municipal lighting frameworks to dedicated solar micro-grids. By strategically installing grid-tied photovoltaic arrays across rural clusters, KADA systematically reduces dependency on centralized fossil-fuel power generation, eliminating carbon emissions and mitigating volatile utility overheads.',
      actions: [
        'Perform solar-irradiation audits across KADA government structures.',
        'Install localized rooftop micro-arrays on village community halls.',
        'Connect regional solar generation directly to grid-tied feeds.'
      ],
      upcoming: [
        'Establish decentralized energy storage vaults for seasonal reserve backup.',
        'Perform smart-grid integrations for remote net-metering.'
      ]
    },
    afforestation: {
      title: 'Strategic Ecological Restoration',
      icon: Leaf,
      image: '/net-zero-forestry.png',
      color: 'emerald',
      tagline: 'Revitalizing native biodiversity to engineer permanent, high-capacity carbon sinks.',
      desc: 'Orchestrating large-scale afforestation initiatives utilizing scientifically selected indigenous flora. By aggressively expanding localized canopy cover, we simultaneously maximize atmospheric carbon sequestration, enhance crucial topsoil moisture retention, and fundamentally restore the ecological equilibrium of the regional microclimate.',
      actions: [
        'Audit soil quality to match tree selection with optimal village zones.',
        'Implement localized community nurseries managed by local collectives.',
        'Establish natural bioswales around check-dams to maximize soil capture.'
      ],
      upcoming: [
        'Develop a digital tracking registry for sapling survivability.',
        'Create permanent afforestation buffer zones around major waterways.'
      ]
    },
    waste: {
      title: 'Total Resource Circularity',
      icon: Recycle,
      image: '/net-zero-waste.png',
      color: 'purple',
      tagline: 'Engineering total organic circularity to systematically eliminate municipal landfill impact.',
      desc: 'Implementing rigorous source-segregation logistics and decentralized organic processing hubs across all panchayats. By rapidly diverting organic biowaste into advanced bio-composting infrastructure, we synthesize premium-grade fertilizers, creating a closed-loop system that directly replenishes agricultural soil biology and offsets artificial chemical dependencies.',
      actions: [
        'Establish source-segregation waste hubs across pilot panchayats.',
        'Build bio-composting facilities to process village organic waste.',
        'Return organic compost directly to local farmers to offset artificial fertilizer costs.'
      ],
      upcoming: [
        'Deploy micro-recycling setups for rural plastic segregation.',
        'Implement zero-waste certifications for local commercial hubs.'
      ]
    }
  };

  const active = pillarsData[activeTab];

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-slate-50/30">
      {/* Decorative ambient light */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            Our Core Pillars
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
            Key Pillars of Sustainability
          </h1>
          <p className="mt-4 text-slate-500 text-base sm:text-lg font-light leading-relaxed">
            An in-depth exploration of the four interconnected strategic mandates systematically driving Kuppam's comprehensive environmental, energy, and sustainable resource transitions.
          </p>
        </motion.div>

        {/* Tab selection */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-12">
          {Object.entries(pillarsData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 border ${
                activeTab === key 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <data.icon size={18} />
              {data.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Card Overview */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-soft overflow-hidden"
          >
            {/* Visual Image Header */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-slate-250/50 shadow-sm">
              <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center`}>
                <active.icon size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">{active.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5 tracking-wider uppercase font-semibold">Active Pillar</p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-slate-800 mb-3">{active.tagline}</h4>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-light mb-8">{active.desc}</p>

            {/* List of things we do */}
            <div className="space-y-4">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={18} /> Active Actions
              </h5>
              <div className="grid gap-3">
                {active.actions.map((act, index) => (
                  <div key={index} className="flex gap-3 items-start text-xs sm:text-sm text-slate-650 font-light bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                    <p>{act}</p>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                {activeTab === 'water' ? (
                  <a
                    href="https://kada3.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition-all w-fit"
                  >
                    <span>Launch Live Water & Borewell Dashboard</span>
                    <ArrowRight size={14} />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-semibold text-xs w-fit">
                    <span>{active.title} Dashboard in Pipeline Planning</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Details / Upcoming */}
          <motion.div 
            key={`${activeTab}-upcoming`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2 text-emerald-400">
                <Zap size={20} /> Next Phase Roadmap
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                What we are planning to execute in the upcoming deployment cycle.
              </p>
              <div className="space-y-4">
                {active.upcoming.map((up, index) => (
                  <div key={index} className="flex gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-xs sm:text-sm text-slate-200">
                    <Target className="text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
                    <p className="font-light">{up}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-soft flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Need Surveyor Access?</h4>
                <p className="text-xs text-slate-450 mt-1 font-light">Field surveyors can log in to update records.</p>
              </div>
              <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
