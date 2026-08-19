import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Battery, Zap, Activity, ArrowLeft, Wind, ChevronDown, CheckCircle2, ShieldCheck, Target, Leaf, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const generateData = () => {
  const data = [];
  let pv = 0;
  for (let i = 0; i < 24; i++) {
    const time = `${i.toString().padStart(2, '0')}:00`;
    // Simulate a solar curve
    let generation = 0;
    if (i >= 6 && i <= 18) {
      generation = Math.round(Math.sin((i - 6) * Math.PI / 12) * 50 + (Math.random() * 5 - 2.5));
    }
    
    // Grid offset is generation minus some base consumption
    const gridOffset = Math.max(0, generation - 15);
    const emissionsAvoided = generation * 0.82; // 0.82 tCO2e per MWh

    data.push({
      time,
      generation: Math.max(0, generation),
      gridOffset,
      emissionsAvoided: parseFloat(emissionsAvoided.toFixed(2))
    });
  }

  const energyMix = [
    { name: 'Solar PV', value: 65, color: '#f59e0b' },
    { name: 'Wind', value: 20, color: '#0ea5e9' },
    { name: 'Battery', value: 10, color: '#10b981' },
    { name: 'Grid', value: 5, color: '#64748b' }
  ];

  const powerFlow = [
    { name: 'Generated', Grid: 12, Storage: 28, Internal: 60 }
  ];

  return { data, energyMix, powerFlow };
};

const { data, energyMix, powerFlow } = generateData();

// Clickable Parameter Card with Minimal Animation
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

      {/* Minimal Click Expansion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-200 relative z-10"
          >
            Real-time monitoring active. Data synced 2s ago.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EnergyDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 pb-12 font-sans selection:bg-amber-500/30">
      
      {/* Top Navigation & Status */}
      <div className="border-b border-slate-200 bg-white/80 border-b border-slate-200/60 shadow-sm saturate-[1.1] backdrop-blur-xl sticky top-0 z-50 mb-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold">
            <ArrowLeft size={14} />
            Mission Control
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-amber-500"><Activity size={14} /></span>
              NETZERO_ENERGY_NODE
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono text-[10px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              GRID SYNCED
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight mb-2">Decarbonization <span className="text-amber-500">Grid</span></h1>
          <p className="text-slate-400 text-sm max-w-2xl font-light">
            Live telemetry for distributed solar micro-grids. Tracking exact NetZero control parameters, Scope 1 & 2 emissions displaced, and battery peak-shaving operations.
          </p>
        </div>

        {/* 25 Dense Parameters Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 row-span-2 bg-amber-500/10 border border-amber-500/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-amber-500/20 transition-colors">
            <div className="absolute -right-10 -bottom-10 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <Sun size={150} className="text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sun size={18} className="text-amber-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Scope 2 Displaced</span>
              </div>
              <div className="text-4xl sm:text-6xl font-black text-slate-900 font-mono tracking-tighter">
                42.8<span className="text-xl text-amber-500 font-sans ml-1">tCO₂e</span>
              </div>
              <div className="text-xs text-amber-200/60 mt-2 font-light">Total emissions avoided via solar pumping</div>
            </div>
          </div>

          {/* Individual Micro-Parameters */}
          <ParameterCard title="Total PV Gen" value="124.5" unit="MWh" icon={Zap} colorClass="text-amber-600" trend="up" delay={0.05} />
          <ParameterCard title="Coal Avoided" value="98.2" unit="tCO₂e" icon={Activity} colorClass="text-slate-600" trend="up" delay={0.06} />
          <ParameterCard title="Diesel Saved" value="14,200" unit="L" icon={Battery} colorClass="text-purple-600" delay={0.07} />
          <ParameterCard title="Scope 1 Avoided" value="38.1" unit="tCO₂e" icon={Wind} colorClass="text-emerald-600" trend="up" delay={0.08} />
          <ParameterCard title="Battery SOC" value="84" unit="%" icon={Battery} colorClass="text-blue-600" delay={0.09} />
          
          <ParameterCard title="Peak Shaving" value="2.4" unit="MW" icon={Activity} colorClass="text-rose-600" delay={0.10} />
          <ParameterCard title="Grid Export" value="450" unit="kWh" icon={Zap} colorClass="text-emerald-600" trend="up" delay={0.11} />
          <ParameterCard title="Islanding Mode" value="OFF" unit="" icon={ShieldCheck} colorClass="text-slate-400" delay={0.12} />
          <ParameterCard title="Clip Loss" value="0.2" unit="kWh" icon={ChevronDown} colorClass="text-rose-600" delay={0.13} />

          <ParameterCard title="Panel Degradation" value="-0.4" unit="%" icon={Activity} colorClass="text-amber-500" delay={0.14} />
          <ParameterCard title="Grid Carbon Int." value="820" unit="g/kWh" icon={Activity} colorClass="text-slate-400" delay={0.15} />
          <ParameterCard title="Offset Target" value="92" unit="%" icon={Target} colorClass="text-emerald-600" trend="up" delay={0.16} />
          <ParameterCard title="Payback Period" value="34" unit="Mo" icon={Activity} colorClass="text-blue-600" delay={0.17} />
          <ParameterCard title="Battery Embd CO2" value="12.4" unit="tCO₂" icon={Battery} colorClass="text-rose-600" delay={0.18} />
          <ParameterCard title="Module Temp Loss" value="4.2" unit="%" icon={Sun} colorClass="text-amber-500" trend="up" delay={0.19} />
          
          <ParameterCard title="Albedo Cooling" value="-0.1" unit="°C" icon={Wind} colorClass="text-blue-500" delay={0.20} />
          <ParameterCard title="Curtailment" value="OFF" unit="" icon={ShieldCheck} colorClass="text-slate-400" delay={0.21} />
          <ParameterCard title="Load Shedding" value="IDLE" unit="" icon={Activity} colorClass="text-slate-400" delay={0.22} />
          <ParameterCard title="Freq Regulation" value="50.0" unit="Hz" icon={Activity} colorClass="text-emerald-600" delay={0.23} />
          <ParameterCard title="VARs Injected" value="120" unit="kVAR" icon={Zap} colorClass="text-purple-600" delay={0.24} />
          <ParameterCard title="Reactive Carbon" value="0" unit="Cost" icon={Leaf} colorClass="text-emerald-600" delay={0.25} />
          
          <ParameterCard title="System LCOE" value="0.04" unit="$/kWh" icon={Landmark} colorClass="text-amber-600" delay={0.26} />
          <ParameterCard title="24h Solar Fcst" value="18.5" unit="MWh" icon={Sun} colorClass="text-amber-600" trend="up" delay={0.27} />
          <ParameterCard title="Soiling Penalty" value="1.2" unit="tCO₂e" icon={Activity} colorClass="text-rose-600" delay={0.28} />
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-emerald-500/20 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <Leaf size={100} className="text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">NetZero Trajectory</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">
                ON TRACK
              </div>
              <div className="text-xs text-emerald-200/60 mt-2 font-light">Emissions offset exceeding operations by 42%</div>
            </div>
          </div>
        </div>

        {/* Dense Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Carbon Displaced vs Generation</h3>
                <p className="text-[10px] text-slate-400 mt-1">Real-time MW vs tCO2e offset trajectory</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }}
                    itemStyle={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="generation" stroke="#f59e0b" strokeWidth={2} fill="url(#colorGen)" name="PV (MW)" />
                  <Area type="monotone" dataKey="emissionsAvoided" stroke="#10b981" strokeWidth={2} fill="url(#colorOffset)" name="Offset (tCO2e)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Peak Shaving</h3>
              <p className="text-[10px] text-slate-400 mb-6">Grid export vs internal load</p>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} interval={3} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                    itemStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#38bdf8' }}
                  />
                  <Bar dataKey="gridOffset" fill="#38bdf8" radius={[2, 2, 0, 0]} name="Grid Export (MW)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Grid Efficiency</h3>
              <p className="text-[10px] text-slate-400 mb-6">Loss vs Transmission Trend</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} interval={3} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="generation" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Eff. Rating" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Energy Mix</h3>
              <p className="text-[10px] text-slate-400 mb-2">Sources Distribution</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={energyMix} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                    {energyMix.map((entry, index) => (
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
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Power Flow</h3>
              <p className="text-[10px] text-slate-400 mb-6">Generation routing breakdown</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={powerFlow} layout="vertical" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Internal" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Internal Load" />
                  <Bar dataKey="Storage" stackId="a" fill="#38bdf8" radius={[0, 0, 0, 0]} name="Battery Storage" />
                  <Bar dataKey="Grid" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Grid Export" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;
