import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ConstituencyMap() {
  // Generate random node positions within an abstract "constituency" shape
  const nodes = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      active: Math.random() > 0.3,
      size: Math.random() * 4 + 2
    }));
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4 shadow-inner">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Abstract Topo Map SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10">
        <path 
          d="M20,10 C40,5 70,15 85,30 C95,45 90,70 75,85 C55,95 25,90 10,70 C0,50 5,20 20,10 Z" 
          fill="rgba(15, 23, 42, 0.8)" 
          stroke="rgba(16, 185, 129, 0.4)" 
          strokeWidth="0.5"
        />
        <path 
          d="M30,25 C45,20 65,30 75,45 C80,60 70,75 55,80 C40,85 25,75 20,55 C15,40 20,30 30,25 Z" 
          fill="transparent" 
          stroke="rgba(16, 185, 129, 0.2)" 
          strokeWidth="0.3"
          strokeDasharray="1 1"
        />
        
        {/* Nodes */}
        {nodes.map(node => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.size / 2}
            fill={node.active ? "#10B981" : "#475569"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: Math.random() * 1.5 }}
            className={node.active ? "animate-pulse" : ""}
            style={{ filter: node.active ? "drop-shadow(0 0 4px rgba(16,185,129,0.8))" : "none" }}
          />
        ))}
      </svg>
      
      {/* Overlay Status */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg p-2 flex flex-col font-mono">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest">Active Nodes</span>
          <span className="text-emerald-400 font-bold text-sm">440+</span>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] text-slate-400 font-mono">Online</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span className="text-[9px] text-slate-400 font-mono">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
