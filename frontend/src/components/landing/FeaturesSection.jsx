import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight, Droplet, Sun, Leaf, Recycle } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <>
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
    </>
  );
}
