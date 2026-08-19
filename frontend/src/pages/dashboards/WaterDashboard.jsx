import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Activity, ArrowLeft, Wind, Map, ShieldCheck, Zap, ThermometerSun, Anchor, RefreshCcw, ExternalLink, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import ConstituencyMap from '../../components/ConstituencyMap';

const generateData = () => {
  const data = [];
  let depth = 180;
  for (let i = 0; i < 24; i++) {
    const time = `${i.toString().padStart(2, '0')}:00`;
    depth += Math.random() * 2 - 1;
    
    // Simulate emissions avoided mapping inversely to depth (closer to surface = less energy = more saved)
    const emissionsAvoided = 10 + (200 - depth) * 0.5;

    data.push({
      time,
      depth: parseFloat(depth.toFixed(1)),
      emissionsAvoided: parseFloat(emissionsAvoided.toFixed(2))
    });
  }

  const waterSources = [
    { name: 'Groundwater', value: 45, color: '#06b6d4' },
    { name: 'Rain Harvest', value: 30, color: '#10b981' },
    { name: 'Desalination', value: 15, color: '#3b82f6' },
    { name: 'Recycled', value: 10, color: '#8b5cf6' }
  ];

  const waterFlow = [
    { name: 'Flow', Supply: 100, Distribution: 85, Loss: 15 }
  ];

  return { data, waterSources, waterFlow };
};

const { data, waterSources, waterFlow } = generateData();

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
            Telemetry sync OK. Scope 2 verified.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WaterDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 pb-12 font-sans selection:bg-cyan-500/30">
      
      {/* Top Navigation & Status */}
      <div className="border-b border-slate-200 bg-white/80 border-b border-slate-200/60 shadow-sm saturate-[1.1] backdrop-blur-xl sticky top-0 z-50 mb-6 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold">
            <ArrowLeft size={14} />
            Mission Control
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-cyan-500"><Activity size={14} /></span>
              NETZERO_HYDRO_NODE
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono text-[10px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              PUMP TELEMETRY LIVE
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight mb-2">Hydrology & <span className="text-cyan-500">Emissions</span></h1>
            <p className="text-slate-400 text-sm max-w-2xl font-light">
              Tracking Scope 2 pumping emissions avoided via solar substitution, deep pumping carbon penalties, and water table net-positive indexes.
            </p>
          </div>
          <a 
            href="https://kada3.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 md:mt-0 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-600 border border-cyan-500/30 px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <span>Launch Live Vercel Operations</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* 25 Dense Parameters Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 row-span-2 bg-cyan-500/10 border border-cyan-500/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-cyan-500/20 transition-colors">
            <div className="absolute -right-10 -bottom-10 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <Droplet size={150} className="text-cyan-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wind size={18} className="text-cyan-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">Scope 2 Pumping Emissions Avoided</span>
              </div>
              <div className="text-4xl sm:text-6xl font-black text-slate-900 font-mono tracking-tighter">
                84.2<span className="text-xl text-cyan-500 font-sans ml-1">tCO₂e</span>
              </div>
              <div className="text-xs text-cyan-200/60 mt-2 font-light">Total emissions avoided via solar pump conversion</div>
            </div>
          </div>

          {/* Individual Micro-Parameters */}
          <ParameterCard title="Energy Intensity" value="1.2" unit="Wh/L" icon={Zap} colorClass="text-amber-600" trend="up" delay={0.05} />
          <ParameterCard title="Solar Peak Offset" value="4.8" unit="MW" icon={Activity} colorClass="text-emerald-600" trend="up" delay={0.06} />
          <ParameterCard title="Grid Energy Displ." value="420" unit="kWh" icon={Zap} colorClass="text-cyan-600" delay={0.07} />
          <ParameterCard title="Pump Eff. Ratio" value="1.8" unit="x" icon={Activity} colorClass="text-purple-600" trend="up" delay={0.08} />
          <ParameterCard title="Net Water Pos." value="1.4" unit="Idx" icon={Droplet} colorClass="text-emerald-600" delay={0.09} />
          
          <ParameterCard title="Deep Pump Penalty" value="14.2" unit="gCO₂/L" icon={Anchor} colorClass="text-rose-600" delay={0.10} />
          <ParameterCard title="Embedded CO2" value="42" unit="tons" icon={Activity} colorClass="text-slate-400" delay={0.11} />
          <ParameterCard title="Leakage Loss Equiv" value="12.4" unit="kWh" icon={Droplet} colorClass="text-rose-600" delay={0.12} />
          <ParameterCard title="Schedule Opt." value="ON" unit="" icon={ShieldCheck} colorClass="text-emerald-600" delay={0.13} />

          <ParameterCard title="Smart Valve Stat." value="SYNC" unit="" icon={Activity} colorClass="text-blue-600" delay={0.14} />
          <ParameterCard title="Flow Restrict" value="OFF" unit="" icon={ShieldCheck} colorClass="text-slate-400" delay={0.15} />
          <ParameterCard title="100% Renew Time" value="84" unit="%" icon={Sun} colorClass="text-amber-500" trend="up" delay={0.16} />
          <ParameterCard title="Night Pumping kWh" value="120" unit="kWh" icon={Activity} colorClass="text-slate-400" delay={0.17} />
          <ParameterCard title="Sensor Standby" value="0.2" unit="W" icon={Zap} colorClass="text-blue-600" delay={0.18} />
          <ParameterCard title="GW Temp Indicator" value="22.4" unit="°C" icon={ThermometerSun} colorClass="text-amber-500" trend="up" delay={0.19} />
          
          <ParameterCard title="Rain Catch Ratio" value="4:1" unit="" icon={Wind} colorClass="text-cyan-500" delay={0.20} />
          <ParameterCard title="Decentral Storage" value="450" unit="m³" icon={Droplet} colorClass="text-blue-600" delay={0.21} />
          <ParameterCard title="Desal CO2 Offset" value="1.2" unit="tCO₂" icon={Activity} colorClass="text-emerald-600" delay={0.22} />
          <ParameterCard title="Live Carbon Cost" value="0.02" unit="$/kL" icon={Activity} colorClass="text-amber-600" delay={0.23} />
          <ParameterCard title="Travel CO2 Avoided" value="420" unit="kg" icon={Wind} colorClass="text-emerald-600" delay={0.24} />
          <ParameterCard title="Active Solar Nodes" value="442" unit="" icon={Sun} colorClass="text-amber-500" delay={0.25} />
          
          <ParameterCard title="Crit. Zone Limits" value="4" unit="Zns" icon={ShieldCheck} colorClass="text-rose-600" delay={0.26} />
          <ParameterCard title="Avg Aquifer Depth" value="184" unit="ft" icon={Anchor} colorClass="text-blue-600" trend="down" delay={0.27} />
          <ParameterCard title="Telemetry Sync" value="99.9" unit="%" icon={RefreshCcw} colorClass="text-emerald-600" delay={0.28} />
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-emerald-500/20 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <ShieldCheck size={100} className="text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">24h NetZero Alignment</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">
                98.4<span className="text-xl text-emerald-500 font-sans ml-1">/100</span>
              </div>
              <div className="text-xs text-emerald-200/60 mt-2 font-light">Pumping operations fully decarbonized today</div>
            </div>
          </div>
        </div>
        
        {/* Dense Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Aquifer Depth vs CO2 Avoided</h3>
                <p className="text-[10px] text-slate-400 mt-1">Shallower water requires less pumping energy, increasing solar offset efficiency.</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAvoided" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                  <YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }}
                    itemStyle={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="depth" stroke="#06b6d4" strokeWidth={2} fill="url(#colorDepth)" name="Depth (ft)" />
                  <Area yAxisId="right" type="monotone" dataKey="emissionsAvoided" stroke="#10b981" strokeWidth={2} fill="url(#colorAvoided)" name="Avoided (kgCO2e)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Water Sources</h3>
              <p className="text-[10px] text-slate-400 mb-2">Current mix extraction</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={waterSources} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                    {waterSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Pump Efficiency</h3>
              <p className="text-[10px] text-slate-400 mb-6">Energy ratio per liter</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 0, right: 20, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} interval={3} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="emissionsAvoided" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Eff. Rating" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Water Flow</h3>
              <p className="text-[10px] text-slate-400 mb-6">Extraction to Distribution</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterFlow} layout="vertical" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Supply" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} name="Source Supply" />
                  <Bar dataKey="Distribution" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Distributed" />
                  <Bar dataKey="Loss" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Leakage Loss" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between lg:col-span-3 xl:col-span-1">
            <div className="mb-4 relative z-10">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Live Telemetry Map</h3>
              <p className="text-[10px] text-slate-400">440+ Nodes Synchronized</p>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="w-full scale-110">
                <ConstituencyMap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterDashboard;
