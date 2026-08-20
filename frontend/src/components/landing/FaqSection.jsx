import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

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
    <>
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
    </>
  );
}
