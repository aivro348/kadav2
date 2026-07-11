import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronDown, ArrowRight, Droplet, Sun, Wind, 
  Leaf, Recycle, Target, Activity, Users, MapPin, 
  Mail, Globe, ShieldCheck, Menu, X
} from 'lucide-react';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch visitor count
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/php-backend/api/counter.php`)
      .then(res => res.json())
      .then(data => {
         if (data.visitors) setVisitorCount(data.visitors);
      })
      .catch(err => console.error("Counter error", err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logos */}
            <div className="flex items-center">
              <img src="/netzero.jpg" alt="NetZero Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full shadow-sm border border-slate-200" />
              <div className="border-l-2 border-slate-300 h-6 sm:h-8 mx-3 sm:mx-4"></div>
              <div className="flex items-center text-primary-800">
                <span className="font-bold text-base sm:text-lg tracking-tight hidden sm:block">Kuppam Area Development Authority</span>
                <span className="font-bold text-lg tracking-tight sm:hidden">KADA</span>
              </div>
            </div>

            {/* Center Links */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('hero-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('vision-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Vision</button>
              <button onClick={() => scrollToSection('pillars-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Pillars</button>
              <button onClick={() => scrollToSection('verticals-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">NetZero Verticals</button>
              <button onClick={() => scrollToSection('impact-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Impact</button>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Link to="/login" className="bg-amber-600 hover:bg-amber-700 text-white px-4 sm:px-6 py-2 rounded-full font-medium transition-colors shadow-sm text-sm sm:text-base">
                Login
              </Link>
              <button 
                className="md:hidden p-2 text-slate-800 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-lg absolute top-full left-0 w-full py-4 px-4 flex flex-col space-y-4">
            <button onClick={() => { scrollToSection('hero-section'); setMobileMenuOpen(false); }} className="text-left text-slate-800 font-semibold text-lg">Home</button>
            <button onClick={() => { scrollToSection('vision-section'); setMobileMenuOpen(false); }} className="text-left text-slate-800 font-semibold text-lg">Vision</button>
            <button onClick={() => { scrollToSection('pillars-section'); setMobileMenuOpen(false); }} className="text-left text-slate-800 font-semibold text-lg">Pillars</button>
            <button onClick={() => { scrollToSection('verticals-section'); setMobileMenuOpen(false); }} className="text-left text-slate-800 font-semibold text-lg">NetZero Verticals</button>
            <button onClick={() => { scrollToSection('impact-section'); setMobileMenuOpen(false); }} className="text-left text-slate-800 font-semibold text-lg">Impact</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src="/hero-bg.png" 
            alt="Aerial view of Kuppam" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-200 border border-primary-500/30 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
              Sustainable Future Initiative
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-serif drop-shadow-lg max-w-5xl"
          >
            Pioneering a <span className="text-emerald-400">NetZero</span><br />
            Future for Kuppam
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-6 text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto drop-shadow-md leading-relaxed"
          >
            We are transforming Kuppam into a 100% sustainable, NetZero community. By integrating solar-powered rural water supply, smart borewell monitoring, and zero-emission infrastructure, we are actively restoring our ecological balance for generations to come.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button onClick={() => scrollToSection('vision-section')} className="border-2 border-primary-500 bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg hover:-translate-y-1 transform">
              Explore Our Vision
            </button>
            <button onClick={() => scrollToSection('survey-section')} className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg hover:-translate-y-1 transform">
              Join the Survey
            </button>
          </motion.div>

          {/* Quick Stats Overlay */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto border-t border-white/20 pt-8"
          >
            {[
              { label: 'Sustainable Goal', value: '100%' },
              { label: 'Carbon Emissions', value: '0' },
              { label: 'Clean Water', value: '24/7' },
              { label: 'Trees Target', value: '10k+' }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-slate-300 text-sm font-medium mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-bounce cursor-pointer" 
          onClick={() => scrollToSection('vision-section')}
        >
          <ChevronDown className="text-white/70 h-8 w-8 hover:text-white transition-colors" />
        </motion.div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision-section" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Our Motivation</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">A Blueprint for Ecological Harmony</h3>
            <div className="mt-4 w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The Kuppam Area Development Authority is embarking on a historic journey towards a NetZero future. Our vision integrates renewable energy, energy-efficient systems, and sustainable waste management with community-driven efforts to foster a culture of sustainability. 
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Enhancing water management practices to achieve Net Zero water will also be a critical focus area, ensuring ecological harmony for generations to come.
              </p>
              <ul className="space-y-4 mt-8">
                {[
                  "Protecting groundwater reserves through smart technology.",
                  "Empowering communities through green jobs and education.",
                  "Ensuring resilience against climate change for future generations."
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                    className="flex items-start"
                  >
                    <ShieldCheck className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img src="/hero-bg.png" alt="Vision" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary-900/20 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-emerald-100 rounded-full z-0 blur-3xl opacity-60"></div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-primary-100 rounded-full z-0 blur-3xl opacity-60"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Pillars Section */}
      <section id="pillars-section" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Focus Areas</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">Key Pillars of NetZero Kuppam</h3>
            <p className="mt-4 text-slate-600 text-lg">Our comprehensive strategy is built on four core pillars, designed to work in synergy to achieve total sustainability.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Pillar 1 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group cursor-pointer hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplet className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Smart Water Management</h4>
              <p className="text-slate-600 leading-relaxed">
                Mapping and monitoring rural borewells, implementing IoT sensors, and transitioning to 100% solar-powered water pumps to conserve our vital aquifers.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group cursor-pointer hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sun className="h-7 w-7 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Renewable Energy</h4>
              <p className="text-slate-600 leading-relaxed">
                Aggressive deployment of solar panels across public infrastructure and households, completely replacing fossil-fuel dependence.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group cursor-pointer hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="h-7 w-7 text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Afforestation</h4>
              <p className="text-slate-600 leading-relaxed">
                Massive tree-planting drives using native species to restore biodiversity, increase green cover, and create natural carbon sinks.
              </p>
            </motion.div>

            {/* Pillar 4 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group cursor-pointer hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Recycle className="h-7 w-7 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Waste Management</h4>
              <p className="text-slate-600 leading-relaxed">
                Implementing circular economy principles, establishing robust recycling networks, and ensuring zero waste reaches local landfills.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* NEW: The Verticals (Interactive Cards) - Light Theme */}
      <section id="verticals-section" className="py-32 relative bg-white border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mb-20 text-center md:text-left"
          >
            <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">The Architecture</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif">The Three NetZero Verticals</h3>
            <p className="mt-6 text-slate-600 text-lg max-w-2xl">Explore the specific infrastructure verticals that make our NetZero ecosystem a reality.</p>
          </motion.div>

          <div className="space-y-24">
            
            {/* Vertical 1: Water */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative group flex flex-col md:flex-row items-center gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src="/net-zero-water.png" alt="Net Zero Water" className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 flex items-center shadow-sm">
                  <Droplet className="w-4 h-4 text-cyan-600 mr-2" />
                  <span className="text-xs font-bold tracking-widest uppercase text-slate-800">Live System</span>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 mb-6 border border-cyan-200">
                  <span className="text-2xl font-serif font-bold">01</span>
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-4">Net Zero Water</h4>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Securing our most vital resource. We map and monitor the rural borewell network and implement massive rainwater harvesting infrastructure to actively rejuvenate the local aquifers.
                </p>
                <div className="bg-white border border-slate-200 p-5 rounded-xl mb-6 shadow-sm">
                  <p className="text-sm text-slate-600 italic">"The Groundwater Monitoring Survey is currently active in the field."</p>
                </div>
                <Link to="/login" className="inline-flex items-center px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-all shadow-md hover:shadow-lg w-fit group-hover:bg-cyan-700">
                  Open Water Survey Portal
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Vertical 2: Energy */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative group flex flex-col md:flex-row-reverse items-center gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src="/net-zero-energy.png" alt="Net Zero Energy" className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mb-6 border border-amber-200">
                  <span className="text-2xl font-serif font-bold">02</span>
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-4">Net Zero Energy</h4>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Transitioning to 100% renewable power generation. From vast solar arrays in the village squares to highly efficient wind turbines, we eliminate reliance on fossil fuels.
                </p>
                <button disabled className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-200 text-slate-500 font-bold border border-slate-300 cursor-not-allowed">
                  <Sun className="mr-2 w-5 h-5 text-slate-400" />
                  Portal Coming Soon
                </button>
              </div>
            </motion.div>

            {/* Vertical 3: Waste */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative group flex flex-col md:flex-row items-center gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src="/net-zero-waste.png" alt="Net Zero Waste" className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mb-6 border border-emerald-200">
                  <span className="text-2xl font-serif font-bold">03</span>
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-4">Net Zero Waste</h4>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  The circular economy in action. We are achieving zero landfill contribution through advanced local recycling centers, organic composting, and aggressive resource recovery.
                </p>
                <button disabled className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-200 text-slate-500 font-bold border border-slate-300 cursor-not-allowed">
                  <Recycle className="mr-2 w-5 h-5 text-slate-400" />
                  Portal Coming Soon
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Impact & Statistics */}
      <section id="impact-section" className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary-700"
          >
            {[
              { icon: Target, val: '2030', label: 'NetZero Target Year', color: 'text-emerald-400' },
              { icon: Activity, val: '500+', label: 'Solar Pumps Planned', color: 'text-amber-400' },
              { icon: Users, val: '50k+', label: 'Citizens Impacted', color: 'text-blue-400' },
              { icon: Leaf, val: '1M+', label: 'Trees to be Planted', color: 'text-emerald-400' }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="p-4">
                <stat.icon className={`h-10 w-10 mx-auto ${stat.color} mb-4`} />
                <div className="text-4xl font-bold mb-2">{stat.val}</div>
                <div className="text-primary-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Action Section (Survey) */}
      <section id="survey-section" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-50 rounded-3xl shadow-xl overflow-hidden border border-slate-200 relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100 rounded-full opacity-50 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-5 relative z-10">
              <div className="p-10 md:p-16 flex flex-col justify-center col-span-3">
                <div className="flex space-x-3 mb-6 text-primary-600">
                  <Droplet className="h-6 w-6 animate-bounce" style={{ animationDelay: '0s' }} />
                  <Sun className="h-6 w-6 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <Wind className="h-6 w-6 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">
                  Rural Water Supply Survey Initiative
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  Phase 1 of our NetZero mission begins with securing our water. Authorized surveyors can log in here to map, monitor, and submit real-time data on the constituency's borewell network.
                </p>
                <Link to="/login" className="inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg w-fit group">
                  Surveyor Login
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="bg-primary-800 relative hidden md:block col-span-2">
                <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                  <h3 className="text-xl font-bold mb-4">Why this matters:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-primary-700 p-1.5 rounded-full mr-3 mt-0.5">
                        <Activity className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-primary-100">Real-time aquifer monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-700 p-1.5 rounded-full mr-3 mt-0.5">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-primary-100">GIS mapped infrastructure</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-700 p-1.5 rounded-full mr-3 mt-0.5">
                        <Target className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-primary-100">Rapid maintenance response</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <img src="/netzero.jpg" alt="NetZero Logo" className="h-12 w-12 object-cover rounded-full shadow-sm mr-3 border border-slate-700" />
                <span className="font-bold text-xl text-white tracking-tight">NetZero Kuppam</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                An initiative by the Kuppam Area Development Authority to pioneer a 100% sustainable, ecologically balanced, and zero-emission constituency.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('hero-section')} className="hover:text-primary-400 transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('vision-section')} className="hover:text-primary-400 transition-colors">Our Vision</button></li>
                <li><button onClick={() => scrollToSection('pillars-section')} className="hover:text-primary-400 transition-colors">Key Pillars</button></li>
                <li><button onClick={() => scrollToSection('impact-section')} className="hover:text-primary-400 transition-colors">Impact Stats</button></li>
                <li><Link to="/login" className="hover:text-primary-400 transition-colors">Surveyor Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary-500 flex-shrink-0" />
                  <span className="text-sm">Kuppam Area Development Authority,<br/>Chittoor District, AP</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} Kuppam Area Development Authority. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 bg-slate-800 rounded px-3 py-1.5 shadow-inner">
                <span className="text-xs text-white uppercase tracking-wider font-bold">Total Visitors</span>
                <span className="bg-emerald-500 text-white text-sm font-bold px-2 py-0.5 rounded shadow-sm">{visitorCount > 0 ? visitorCount : '...'}</span>
              </div>
            </div>
            <div className="flex space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
