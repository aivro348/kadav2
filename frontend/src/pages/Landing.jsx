import HeroSection from '../components/landing/HeroSection';
import PartnersBanner from '../components/landing/PartnersBanner';
import DashboardsSection from '../components/landing/DashboardsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import FaqSection from '../components/landing/FaqSection';

export default function Landing() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-850 selection:bg-emerald-500 selection:text-white">
      <HeroSection />
      <PartnersBanner />
      <DashboardsSection />
      <FeaturesSection />
      <FaqSection />
    </div>
  );
}
