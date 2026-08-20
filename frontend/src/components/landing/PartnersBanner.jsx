import { Landmark, ShieldCheck, GraduationCap } from 'lucide-react';

export default function PartnersBanner() {
  return (
    <section className="py-5 sm:py-6 bg-slate-900 border-b border-slate-800 text-slate-400">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-[10px] sm:text-[11px] text-slate-500 tracking-widest font-extrabold">Institutional Alliance:</span>
          <div className="flex items-center gap-2 text-slate-300">
            <Landmark size={15} className="text-emerald-400" />
            <span className="text-[11px] sm:text-xs">Govt. of Andhra Pradesh</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span className="text-[11px] sm:text-xs">Kuppam Area Development Authority</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <GraduationCap size={15} className="text-emerald-400" />
            <span className="text-[11px] sm:text-xs">IIT Kanpur</span>
          </div>
        </div>
      </div>
    </section>
  );
}
