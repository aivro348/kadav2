import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Eye, Compass, Rocket } from 'lucide-react';

export default function Vision() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const milestones = [
    {
      year: '2026',
      title: 'Smart Grid Telemetry & Hydrological Baseline',
      desc: 'Deploy IoT telemetry sensors on all existing rural borewells. Complete geological and groundwater maps of the entire Kuppam constituency to create a live hydrological monitoring dashboard.',
      icon: Compass,
      status: 'Active Deployment'
    },
    {
      year: '2028',
      title: 'Distributed Clean Energy Integration',
      desc: 'Transition public water pumps and village clusters to solar power. Deploy decentralized micro-grids to secure energy independence and reduce KADA\'s utility emissions by 60%.',
      icon: Rocket,
      status: 'Planning Stage'
    },
    {
      year: '2030',
      title: '100% NetZero Ecosystem Integration',
      desc: 'Achieve total carbon neutrality and localized water equilibrium. Full circular loops for agricultural waste, complete afforestation targets, and a zero-landfill constituency.',
      icon: Eye,
      status: 'Strategic Goal'
    }
  ];

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-slate-50/30">
      {/* Decorative ambient light */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            Our Blueprint
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
            Vision for Ecological Harmony
          </h1>
          <p className="mt-4 text-slate-500 text-base sm:text-lg font-light leading-relaxed">
            An extensive overview of how the Kuppam Area Development Authority is engineering a scalable, zero-emission, and structurally resilient framework designed to act as a gold standard for regional environmental sustainability and economic growth.
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 font-display">A Model of Self-Sustaining Infrastructure</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-light">
              KADA’s strategic vision is fundamentally driven by the critical imperative to secure and revitalize our region’s most valuable natural assets, with a primary emphasis on rapidly depleting groundwater aquifers. Our highly comprehensive, multi-disciplinary framework seamlessly integrates robust infrastructure engineering, state-of-the-art IoT (Internet of Things) sensor networks, and democratized community-led governance models.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-light">
              By deploying direct, high-frequency telemetry lines deep into our critical aquifers, we are rapidly transitioning from an archaic model of reactive water management into an era of proactive, predictive hydrological conservation. We dynamically map sub-surface water tables in real-time, an unprecedented capability that empowers us to precisely deploy localized rainwater harvesting structures and micro-irrigation systems exactly where geological formations dictate maximum retention potential.
            </p>
            <div className="grid gap-4 pt-2">
              {[
                { title: 'Predictive Resource Security', desc: 'Predicting aquifer levels months in advance to prevent dry periods.' },
                { title: 'Community Green Governance', desc: 'Empowering local panchayats to manage their grids via transparent data logs.' }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200/50 shadow-soft">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2">
              <img src="/hero-bg.png" alt="Ecological Blueprint" className="w-full h-full object-cover rounded-2xl" />
            </div>
            {/* Visual Callout */}
            <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl border border-emerald-500/20 max-w-xs shadow-lg">
              <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest block mb-1">Key Focus</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering farmers and securing agricultural sectors by shifting 100% of rural irrigation wells to clean solar power.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Timeline Roadmap */}
        <div className="border-t border-slate-200 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-extrabold text-slate-900 font-display">Action Plan & Milestones</h3>
            <p className="text-slate-500 text-sm mt-2 font-light">A comprehensive operational timeline delineating our strategic phases to drive systemic ecological transition and infrastructure modernization over the ensuing decade.</p>
          </div>

          <div className="relative border-l border-slate-200 ml-4 md:ml-32 space-y-12">
            {milestones.map((milestone, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Year Marker */}
                <div className="absolute -left-16 md:-left-32 top-1 w-12 text-right hidden sm:block">
                  <span className="text-xl font-extrabold text-emerald-600 font-display tracking-tight">{milestone.year}</span>
                </div>
                
                {/* Connector Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white group-hover:bg-emerald-500 transition-colors duration-300 shadow-sm" />

                {/* Card Container */}
                <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-soft hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                      <milestone.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg font-display">{milestone.title}</h4>
                      <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">{milestone.status}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm font-light">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
