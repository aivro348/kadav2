import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center mt-12 lg:mt-24">
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
      </div>
    </section>
  );
}
