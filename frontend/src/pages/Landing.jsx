import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ArrowRight, Droplet, Sun, Wind } from 'lucide-react';

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  const scrollToSurvey = () => {
    document.getElementById('survey-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logos */}
            <div className="flex items-center space-x-4">
              <img src="/netzero.jpg" alt="NetZero Logo" className="h-12 w-auto object-contain rounded-sm" />
              <div className="hidden sm:block border-l-2 border-slate-300 h-8 mx-4"></div>
              <div className="flex items-center text-primary-800 hidden sm:flex">
                <Droplet className="mr-2 h-6 w-6" />
                <span className="font-bold text-lg tracking-tight">Kuppam Area Development Authority</span>
              </div>
            </div>

            {/* Center Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-800 font-semibold hover:text-primary-600 transition-colors">Home</a>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-6">
              <button onClick={toggleLanguage} className="flex items-center text-slate-700 hover:text-primary-600 font-medium">
                <span className="mr-1 text-lg">अ</span> / En
              </button>
              <Link to="/login" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Aerial view of Kuppam" 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-serif drop-shadow-lg">
            Pioneering a <span className="text-emerald-400">NetZero</span><br />
            Future for Kuppam
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            We are transforming Kuppam into a 100% sustainable, NetZero community. By integrating solar-powered rural water supply, smart borewell monitoring, and zero-emission infrastructure, we are actively restoring our ecological balance for generations to come.
          </p>
          <div className="mt-10">
            <button onClick={scrollToSurvey} className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-bounce cursor-pointer" onClick={scrollToSurvey}>
          <span className="text-white/80 text-sm font-medium mb-2 uppercase tracking-widest">Scroll Down</span>
          <ChevronDown className="text-white h-6 w-6" />
        </div>
      </section>

      {/* Action Section */}
      <section id="survey-section" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <div className="flex space-x-3 mb-6 text-primary-600">
                  <Droplet className="h-6 w-6" />
                  <Sun className="h-6 w-6" />
                  <Wind className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">
                  NetZero Borewell Survey Initiative
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Join our mission to map, monitor, and maintain the rural water supply network. Only authorized surveyors can submit data to ensure accuracy and reliability.
                </p>
                <Link to="/surveyor/new" className="inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg w-fit group">
                  Start Survey Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="bg-slate-200 relative hidden md:block">
                <img src="/hero-bg.png" alt="Sustainability" className="absolute inset-0 w-full h-full object-cover object-left" />
                <div className="absolute inset-0 bg-primary-900/20 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center">
        <p>© 2026 Kuppam Area Development Authority. All rights reserved.</p>
      </footer>
    </div>
  );
}
