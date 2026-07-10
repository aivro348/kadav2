import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, ArrowRight, Droplet, Sun, Wind, 
  Leaf, Recycle, Target, Activity, Users, MapPin, 
  Mail, Phone, Globe, ShieldCheck
} from 'lucide-react';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logos */}
            <div className="flex items-center space-x-4">
              <img src="/netzero.jpg" alt="NetZero Logo" className="h-12 w-12 object-cover rounded-full shadow-sm border border-slate-200" />
              <div className="hidden sm:block border-l-2 border-slate-300 h-8 mx-4"></div>
              <div className="flex items-center text-primary-800 hidden sm:flex">
                <span className="font-bold text-lg tracking-tight">Kuppam Area Development Authority</span>
              </div>
            </div>

            {/* Center Links */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('hero-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('vision-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Vision</button>
              <button onClick={() => scrollToSection('pillars-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Pillars</button>
              <button onClick={() => scrollToSection('impact-section')} className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Impact</button>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-6">
              <Link to="/login" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Aerial view of Kuppam" 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-10">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-200 border border-primary-500/30 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
            Sustainable Future Initiative
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-serif drop-shadow-lg max-w-5xl">
            Pioneering a <span className="text-emerald-400">NetZero</span><br />
            Future for Kuppam
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            We are transforming Kuppam into a 100% sustainable, NetZero community. By integrating solar-powered rural water supply, smart borewell monitoring, and zero-emission infrastructure, we are actively restoring our ecological balance for generations to come.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button onClick={() => scrollToSection('vision-section')} className="border-2 border-primary-500 bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg">
              Explore Our Vision
            </button>
            <button onClick={() => scrollToSection('survey-section')} className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg">
              Join the Survey
            </button>
          </div>

          {/* Quick Stats Overlay */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto border-t border-white/20 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-slate-300 text-sm font-medium mt-1">Sustainable Goal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">0</div>
              <div className="text-slate-300 text-sm font-medium mt-1">Carbon Emissions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">24/7</div>
              <div className="text-slate-300 text-sm font-medium mt-1">Clean Water</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">10k+</div>
              <div className="text-slate-300 text-sm font-medium mt-1">Trees Target</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-bounce cursor-pointer" onClick={() => scrollToSection('vision-section')}>
          <ChevronDown className="text-white/70 h-8 w-8 hover:text-white transition-colors" />
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Our Motivation</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">A Blueprint for Ecological Harmony</h3>
            <div className="mt-4 w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The Kuppam Area Development Authority has embarked on a historic journey to make our constituency a benchmark for environmental sustainability in India. The NetZero initiative is not just about reducing emissions; it is a holistic approach to harmonizing human development with nature.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Our vision encompasses the rejuvenation of local water bodies, transitioning our entire rural infrastructure to renewable energy, and engaging every citizen in our aggressive afforestation drives.
              </p>
              <ul className="space-y-4 mt-8">
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Protecting groundwater reserves through smart technology.</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Empowering communities through green jobs and education.</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Ensuring resilience against climate change for future generations.</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img src="/hero-bg.png" alt="Vision" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary-900/20 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-emerald-100 rounded-full z-0 blur-3xl opacity-60"></div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-primary-100 rounded-full z-0 blur-3xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Pillars Section */}
      <section id="pillars-section" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Focus Areas</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">Key Pillars of NetZero Kuppam</h3>
            <p className="mt-4 text-slate-600 text-lg">Our comprehensive strategy is built on four core pillars, designed to work in synergy to achieve total sustainability.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplet className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Smart Water Management</h4>
              <p className="text-slate-600 leading-relaxed">
                Mapping and monitoring rural borewells, implementing IoT sensors, and transitioning to 100% solar-powered water pumps to conserve our vital aquifers.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sun className="h-7 w-7 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Renewable Energy</h4>
              <p className="text-slate-600 leading-relaxed">
                Aggressive deployment of solar panels across public infrastructure and households, completely replacing fossil-fuel dependence.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="h-7 w-7 text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Afforestation</h4>
              <p className="text-slate-600 leading-relaxed">
                Massive tree-planting drives using native species to restore biodiversity, increase green cover, and create natural carbon sinks.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Recycle className="h-7 w-7 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Waste Management</h4>
              <p className="text-slate-600 leading-relaxed">
                Implementing circular economy principles, establishing robust recycling networks, and ensuring zero waste reaches local landfills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Statistics */}
      <section id="impact-section" className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary-700">
            <div className="p-4">
              <Target className="h-10 w-10 mx-auto text-emerald-400 mb-4" />
              <div className="text-4xl font-bold mb-2">2030</div>
              <div className="text-primary-200 font-medium">NetZero Target Year</div>
            </div>
            <div className="p-4">
              <Activity className="h-10 w-10 mx-auto text-amber-400 mb-4" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-200 font-medium">Solar Pumps Planned</div>
            </div>
            <div className="p-4">
              <Users className="h-10 w-10 mx-auto text-blue-400 mb-4" />
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-primary-200 font-medium">Citizens Impacted</div>
            </div>
            <div className="p-4">
              <Leaf className="h-10 w-10 mx-auto text-emerald-400 mb-4" />
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-primary-200 font-medium">Trees to be Planted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Section (Survey) */}
      <section id="survey-section" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl shadow-xl overflow-hidden border border-slate-200 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100 rounded-full opacity-50 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-5 relative z-10">
              <div className="p-10 md:p-16 flex flex-col justify-center col-span-3">
                <div className="flex space-x-3 mb-6 text-primary-600">
                  <Droplet className="h-6 w-6" />
                  <Sun className="h-6 w-6" />
                  <Wind className="h-6 w-6" />
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
          </div>
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
                {/* Social icons placeholders */}
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
            <p className="text-sm text-slate-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Kuppam Area Development Authority. All rights reserved.
            </p>
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
