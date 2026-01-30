import React from 'react';
import { ShieldCheck, TrendingUp, Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroCard = () => {
  return (
    // 1. FLOATING ANIMATION CONTAINER
    <motion.div
      animate={{ y: [0, -15, 0] }} // Float up 15px and back down
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative group perspective-1000"
    >
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      {/* Main Glass Card */}
      <div className="relative h-full p-6 bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl leading-none shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
               <ShieldCheck size={20} />
             </div>
             <div>
               <h3 className="text-white font-semibold text-sm">Eligibility Check</h3>
               <p className="text-[10px] text-neutral-400 uppercase tracking-wider">AI Analysis</p>
             </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            LIVE
          </div>
        </div>

        {/* The Big Score (Visual Centerpiece) */}
        <div className="flex flex-col items-center justify-center mb-8 relative py-4">
           {/* SVG Circle with Draw Animation */}
           <svg className="w-48 h-48 transform -rotate-90">
             {/* Background Track */}
             <circle cx="96" cy="96" r="88" fill="none" stroke="#1e293b" strokeWidth="8" />
             {/* Animated Progress Bar */}
             <motion.circle 
               cx="96" cy="96" r="88" fill="none" 
               stroke="url(#gradient)" 
               strokeWidth="8" 
               strokeLinecap="round"
               initial={{ strokeDasharray: "565.48", strokeDashoffset: "565.48" }}
               animate={{ strokeDashoffset: "50" }} // Ends at ~90%
               transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
             />
             <defs>
               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#22d3ee" />
                 <stop offset="100%" stopColor="#8b5cf6" />
               </linearGradient>
             </defs>
           </svg>
           
           {/* Text inside circle */}
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 1, duration: 0.5 }}
               className="text-5xl font-bold text-white tracking-tighter"
             >
               92<span className="text-2xl text-cyan-400">%</span>
             </motion.div>
             <span className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Approval chances</span>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase tracking-wide">
              <TrendingUp size={10} /> Interest
            </div>
            <div className="text-white font-mono font-semibold text-lg">8.5%</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase tracking-wide">
              <Check size={10} /> Limit
            </div>
            <div className="text-white font-mono font-semibold text-lg">₹ 5.0L</div>
          </div>
        </div>

        {/* Floating Tag */}
        

      </div>
    </motion.div>
  );
};

export default HeroCard;