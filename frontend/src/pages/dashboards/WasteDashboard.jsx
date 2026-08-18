import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, Leaf, Trash2, Activity, ArrowLeft, Wind, Flame, Tractor, TestTube, Factory, Truck, Droplet, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const generateData = () => {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < days.length; i++) {
    const collected = Math.round(Math.random() * 20 + 80); 
    const composted = Math.round(collected * (0.8 + Math.random() * 0.15)); // High divergence rate for NetZero
    const landfill = collected - composted;
    const methaneAvoided = composted * 1.5; // Estimated multiplier for CH4 to CO2e avoided

    data.push({
      day: days[i],
      composted,
      landfill,
      methaneAvoided: parseFloat(methaneAvoided.toFixed(1))
    });
  }

  const wasteTypes = [
    { name: 'Organic', value: 55, color: '#10b981' },
    { name: 'Recyclable', value: 30, color: '#3b82f6' },
    { name: 'E-Waste', value: 10, color: '#f59e0b' },
    { name: 'Landfill', value: 5, color: '#64748b' }
  ];

  const processingFlow = [
    { name: 'Processing', Collection: 100, Sorted: 90, Residual: 10 }
  ];

  return { data, wasteTypes, processingFlow };
};

const { data, wasteTypes, processingFlow } = generateData();

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
            Audited via verified blockchain ledger.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WasteDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 pt-20 pb-12 font-sans selection:bg-purple-500/30">
      
      {/* Top Navigation & Status */}
      <div className="border-b border-slate-200 bg-white/80 border-b border-slate-200/60 shadow-sm saturate-[1.1] backdrop-blur-xl sticky top-0 z-50 mb-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold">
            <ArrowLeft size={14} />
            Mission Control
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-purple-500"><Activity size={14} /></span>
              NETZERO_WASTE_NODE
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono text-[10px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              LIVELINK ACTIVE
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight mb-2">Circular <span className="text-purple-500">Bio-Economy</span></h1>
          <p className="text-slate-400 text-sm max-w-2xl font-light">
            Live telemetry for Methane (CH4) avoidance, bio-compost maturity mapping, and fleet EV logistics emissions tracking.
          </p>
        </div>

        {/* 25 Dense Parameters Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 row-span-2 bg-purple-500/10 border border-purple-500/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-purple-500/20 transition-colors">
            <div className="absolute -right-10 -bottom-10 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <Flame size={150} className="text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame size={18} className="text-purple-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">Methane Avoided (YTD)</span>
              </div>
              <div className="text-4xl sm:text-6xl font-black text-slate-900 font-mono tracking-tighter">
                4,250<span className="text-xl text-purple-500 font-sans ml-1">tCO₂e</span>
              </div>
              <div className="text-xs text-purple-200/60 mt-2 font-light">Calculated via direct landfill divergence</div>
            </div>
          </div>

          {/* Individual Micro-Parameters */}
          <ParameterCard title="Org Carbon Seq" value="842" unit="tCO₂" icon={Leaf} colorClass="text-emerald-600" trend="up" delay={0.05} />
          <ParameterCard title="N2O Avoided" value="18.4" unit="tCO₂e" icon={Wind} colorClass="text-blue-600" delay={0.06} />
          <ParameterCard title="Biogas Gen" value="2.1k" unit="m³" icon={Flame} colorClass="text-amber-600" trend="up" delay={0.07} />
          <ParameterCard title="Fossil Displaced" value="980" unit="L" icon={Recycle} colorClass="text-emerald-600" delay={0.08} />
          <ParameterCard title="Divergence" value="94" unit="%" icon={Activity} colorClass="text-emerald-600" trend="up" delay={0.09} />
          
          <ParameterCard title="EV Fleet CO2e" value="1.2" unit="tCO₂" icon={Truck} colorClass="text-emerald-600" delay={0.10} />
          <ParameterCard title="Route Savings" value="480" unit="kgCO₂" icon={Truck} colorClass="text-purple-600" delay={0.11} />
          <ParameterCard title="Facility Grid kWh" value="120" unit="kWh" icon={Factory} colorClass="text-rose-600" delay={0.12} />
          <ParameterCard title="Scope 3 Transp" value="12" unit="tCO₂e" icon={Wind} colorClass="text-slate-400" delay={0.13} />

          <ParameterCard title="Decomp Ratio" value="12:1" unit="A:An" icon={TestTube} colorClass="text-slate-600" delay={0.14} />
          <ParameterCard title="Plastic Upcycled" value="1.4" unit="tCO₂e" icon={Recycle} colorClass="text-emerald-600" delay={0.15} />
          <ParameterCard title="Bio-char Locked" value="42" unit="Tons" icon={Flame} colorClass="text-amber-500" trend="up" delay={0.16} />
          <ParameterCard title="Soil Humus Idx" value="8.4" unit="/10" icon={Leaf} colorClass="text-emerald-600" delay={0.17} />
          <ParameterCard title="Fertilizer Displ." value="450" unit="Tons" icon={Tractor} colorClass="text-blue-600" delay={0.18} />
          <ParameterCard title="Diesel Elimin." value="100" unit="%" icon={Activity} colorClass="text-emerald-600" trend="up" delay={0.19} />
          
          <ParameterCard title="Moisture CO2" value="2.1" unit="kgCO₂" icon={TestTube} colorClass="text-slate-400" delay={0.20} />
          <ParameterCard title="Temp Control" value="65" unit="°C" icon={Flame} colorClass="text-amber-600" delay={0.21} />
          <ParameterCard title="Leachate kWh" value="4.2" unit="kWh" icon={Droplet} colorClass="text-blue-600" delay={0.22} />
          <ParameterCard title="Odor Scrub Cost" value="1.1" unit="kgCO₂" icon={Wind} colorClass="text-slate-400" delay={0.23} />
          <ParameterCard title="C:N Score" value="30:1" unit="Opt" icon={TestTube} colorClass="text-emerald-600" delay={0.24} />
          <ParameterCard title="Circularity Idx" value="96" unit="/100" icon={Recycle} colorClass="text-emerald-500" trend="up" delay={0.25} />
          
          <ParameterCard title="Bio-Revenue" value="14.2" unit="k$" icon={Landmark} colorClass="text-amber-600" delay={0.26} />
          <ParameterCard title="Negative Bal." value="1.1" unit="kt" icon={Leaf} colorClass="text-emerald-600" trend="up" delay={0.27} />
          <ParameterCard title="H2S Sensor" value="0.2" unit="ppm" icon={Activity} colorClass="text-slate-400" delay={0.28} />
          
          {/* Main Highlights - Span 2 */}
          <div className="col-span-2 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-emerald-500/20 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.15] group-hover:opacity-25 transition-opacity">
              <Recycle size={100} className="text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={16} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Net Negative Status</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">
                ACTIVE
              </div>
              <div className="text-xs text-emerald-200/60 mt-2 font-light">Carbon sequestration &gt; operating emissions</div>
            </div>
          </div>
        </div>

        {/* Dense Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Methane (CH4) Avoidance</h3>
                <p className="text-[10px] text-slate-400 mt-1">Landfill divergence tracking vs CO2e</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMeth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }}
                    itemStyle={{ fontFamily: 'monospace', fontSize: '11px', color: '#c084fc', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="methaneAvoided" stroke="#a855f7" strokeWidth={2} fill="url(#colorMeth)" name="Avoided (tCO2e)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Compost vs Landfill</h3>
              <p className="text-[10px] text-slate-400 mb-6">NetZero target &gt; 90% divergence</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                    itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }}
                  />
                  <Bar dataKey="composted" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Composted (t)" />
                  <Bar dataKey="landfill" stackId="a" fill="#334155" radius={[0, 4, 4, 0]} name="Landfill (t)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Divergence Rate</h3>
              <p className="text-[10px] text-slate-400 mb-6">Efficiency trend (%)</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="composted" stroke="#a855f7" strokeWidth={2} dot={false} name="Efficiency" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Waste Composition</h3>
              <p className="text-[10px] text-slate-400 mb-2">Collected segregation</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={wasteTypes} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                    {wasteTypes.map((entry, index) => (
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
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Processing Flow</h3>
              <p className="text-[10px] text-slate-400 mb-6">Collection to Sort</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processingFlow} layout="vertical" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} itemStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Collection" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} name="Collected" />
                  <Bar dataKey="Sorted" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Sorted" />
                  <Bar dataKey="Residual" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} name="Residual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WasteDashboard;
