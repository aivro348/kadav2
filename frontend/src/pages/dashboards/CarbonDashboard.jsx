import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Map, TreePine, Droplets, Activity, ArrowLeft, Sun, Wind, Scan, ShieldCheck, ThermometerSun, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const generateData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let seq = 1200;
  for (let i = 0; i < months.length; i++) {
    seq += Math.round(Math.random() * 50 + 100); 
    const albedoShift = (i * 0.05 + 0.1).toFixed(2);
    
    data.push({
      month: months[i],
      carbonSeq: seq,
      albedoShift: parseFloat(albedoShift)
    });
  }

  const sequestrationSources = [
    { name: 'Afforestation', value: 50, color: '#10b981' },
    { name: 'Soil Carbon', value: 25, color: '#8b5cf6' },
    { name: 'Biochar', value: 15, color: '#f59e0b' },
    { name: 'Direct Air', value: 10, color: '#3b82f6' }
  ];

  const carbonFlow = [
    { name: 'Balance', Emitted: 40, Sequestered: 60 }
  ];

  return { data, sequestrationSources, carbonFlow };
};

const { data, sequestrationSources, carbonFlow } = generateData();

const ParameterCard = ({ title, value, unit, icon: Icon, colorClass, trend, delay }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-white border border-slate-200 p-3 shadow-sm sm:p-4 rounded-2xl cursor-pointer relative overflow-hidden group flex flex-col justify-between"
    >
      <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-[0.15] transition-opacity">
        <Icon size={64} className={colorClass} />
      </div>
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className={`p-1.5 rounded-lg bg-slate-50 ${colorClass}`}>
          <Icon size={16} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-auto">
        <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
          {value}<span className="text-[10px] sm:text-xs text-slate-400 font-sans ml-1">{unit}</span>
        </div>
        <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mt-1">
          {title}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-200 relative z-10"
          >
            Verified via multi-spectral satellite imagery.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CarbonDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 pb-12 font-sans selection:bg-blue-500/30">
      
      {/* Top Navigation & Status */}
      <div className="border-b border-slate-200 bg-white/80 border-b border-slate-200/60 shadow-sm saturate-[1.1] backdrop-blur-xl sticky top-0 z-50 mb-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold">
            <ArrowLeft size={14} />
            Mission Control
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-blue-500"><Scan size={14} /></span>
              NETZERO_ECOLOGY_NODE
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono text-[10px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              SAT-LINK ACTIVE
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight mb-2">Geospatial <span className="text-blue-500">Sequestration</span></h1>
          <p className="text-slate-400 text-sm max-w-2xl font-light">
            Live telemetry for afforestation carbon sinking, land surface temperature cooling, and GHG Protocol Scope 1+2+3 net balances.
          </p>
        </div>

        {/* 25 Dense Parameters Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 row-span-2 bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-blue-50 transition-colors">
            <div className="absolute -right-10 -bottom-10 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <Map size={150} className="text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Map size={18} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Verified Sequestered (YTD)</span>
              </div>
              <div className="text-4xl sm:text-6xl font-black text-slate-900 font-mono tracking-tighter">
                128.4<span className="text-xl text-blue-500 font-sans ml-1">tCO₂e</span>
              </div>
              <div className="text-xs text-blue-200/60 mt-2 font-light">Above and below-ground biomass calculation</div>
            </div>
          </div>

          {/* Individual Micro-Parameters */}
          <ParameterCard title="Daily Fixation" value="420" unit="kgCO₂" icon={Sun} colorClass="text-amber-600" trend="up" delay={0.05} />
          <ParameterCard title="Above-Grnd Bio" value="84" unit="Tons" icon={TreePine} colorClass="text-emerald-600" trend="up" delay={0.06} />
          <ParameterCard title="Below-Grnd Bio" value="44" unit="Tons" icon={Leaf} colorClass="text-amber-500" trend="up" delay={0.07} />
          <ParameterCard title="SOC Accum." value="1.2" unit="%" icon={Activity} colorClass="text-rose-600" trend="up" delay={0.08} />
          <ParameterCard title="Live NDVI" value="0.74" unit="Idx" icon={Scan} colorClass="text-blue-600" delay={0.09} />
          
          <ParameterCard title="EVI Index" value="0.68" unit="Idx" icon={Activity} colorClass="text-blue-600" delay={0.10} />
          <ParameterCard title="LST Cooling" value="-1.4" unit="°C" icon={ThermometerSun} colorClass="text-blue-500" trend="up" delay={0.11} />
          <ParameterCard title="Albedo Shift" value="0.12" unit="" icon={Sun} colorClass="text-amber-500" delay={0.12} />
          <ParameterCard title="Evapotransp." value="4.2" unit="mm/d" icon={Wind} colorClass="text-slate-600" delay={0.13} />

          <ParameterCard title="Sat Passes" value="4" unit="/day" icon={Activity} colorClass="text-emerald-600" delay={0.14} />
          <ParameterCard title="Tokenized CRD" value="120" unit="Tkns" icon={ShieldCheck} colorClass="text-purple-600" delay={0.15} />
          <ParameterCard title="Survival Pnlty" value="4.2" unit="tCO₂e" icon={Activity} colorClass="text-rose-600" delay={0.16} />
          <ParameterCard title="Fire Alerts" value="0" unit="Zns" icon={Activity} colorClass="text-slate-400" delay={0.17} />
          <ParameterCard title="Drone CO2e" value="120" unit="gCO₂" icon={Wind} colorClass="text-slate-400" delay={0.18} />
          <ParameterCard title="Mycorrhizal C" value="14" unit="tCO₂e" icon={Leaf} colorClass="text-emerald-600" trend="up" delay={0.19} />
          
          <ParameterCard title="Riparian Buf." value="42" unit="Ha" icon={Droplets} colorClass="text-blue-600" delay={0.20} />
          <ParameterCard title="Nursery kWh" value="450" unit="kWh" icon={Activity} colorClass="text-rose-600" delay={0.21} />
          <ParameterCard title="Transp. Scope 3" value="2.4" unit="tCO₂e" icon={Wind} colorClass="text-slate-400" delay={0.22} />
          <ParameterCard title="Net Seq Ratio" value="98:2" unit="" icon={Leaf} colorClass="text-emerald-600" delay={0.23} />
          <ParameterCard title="Climate Buffer" value="84" unit="/100" icon={ShieldCheck} colorClass="text-blue-600" delay={0.24} />
          <ParameterCard title="Drought Pnlty" value="1.1" unit="%" icon={ThermometerSun} colorClass="text-rose-600" delay={0.25} />
          
          <ParameterCard title="Peak Absorp." value="14:00" unit="Hrs" icon={Sun} colorClass="text-amber-600" delay={0.26} />
          <ParameterCard title="Biodiversity" value="9.2" unit="Idx" icon={Leaf} colorClass="text-emerald-600" delay={0.27} />
          <ParameterCard title="Official GHG" value="NEG" unit="Bal" icon={ShieldCheck} colorClass="text-emerald-600" trend="up" delay={0.28} />
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 bg-white border border-slate-200 p-5 shadow-sm rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <CloudRain size={100} className="text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CloudRain size={16} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Hydrological Impact</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">
                +4,200<span className="text-xl text-blue-500 font-sans ml-1">m³</span>
              </div>
              <div className="text-xs text-blue-200/60 mt-2 font-light">Est. groundwater recharge via root systems</div>
            </div>
          </div>
        </div>

        {/* Dense Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Carbon Sequestration Trajectory</h3>
                <p className="text-[10px] text-slate-400 mt-1">Cumulative tCO2e locked across all planting zones</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} itemStyle={{ fontFamily: 'monospace', fontSize: '11px', color: '#10b981', fontWeight: 'bold' }} labelStyle={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }} />
                  <Area type="monotone" dataKey="carbonSeq" stroke="#10b981" strokeWidth={2} fill="url(#colorC)" name="Sequestered (tCO2e)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">LST Cooling Trend</h3>
              <p className="text-[10px] text-slate-400 mb-6">Micro-climate temperature reduction</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                  <Line type="stepAfter" dataKey="albedoShift" stroke="#3b82f6" strokeWidth={2} dot={false} name="Cooling (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Sequestration Sources</h3>
              <p className="text-[10px] text-slate-400 mb-2">Project composition</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sequestrationSources} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                    {sequestrationSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between lg:col-span-2 xl:col-span-1">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Carbon Balance Flow</h3>
              <p className="text-[10px] text-slate-400 mb-6">Emissions vs Offsets</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonFlow} layout="vertical" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Emitted" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} name="Emitted" />
                  <Bar dataKey="Sequestered" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} name="Sequestered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonDashboard;
