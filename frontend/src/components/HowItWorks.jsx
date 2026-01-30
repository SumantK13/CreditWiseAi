import React from "react";
import { ScanSearch, BrainCircuit, Smartphone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Market Scan",
    description: "We aggregate real-time loan data from 50+ lenders across the market, independent of any specific bank.",
    icon: ScanSearch,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20"
  },
  {
    id: 2,
    title: "AI Analysis",
    description: "Our engine runs your profile against 20+ approval parameters to calculate your exact probability of success.",
    icon: BrainCircuit,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    id: 3,
    title: "Smart Decision",
    description: "You get a ranked list of loans you are actually eligible for, saving you from rejections and credit score hits.",
    icon: Smartphone,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 bg-black overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Inside the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Decision Engine</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            We don't sell loans. We sell certainty. Here is how our AI ensures you only apply for what you can get.
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-emerald-500/30 border-t border-dashed border-white/10 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative z-10 group"
            >
              {/* Card Body */}
              <div className="h-full p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors duration-300">
                
                {/* Icon Circle */}
                <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                  <step.icon size={32} className={step.color} />
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative Step Number */}
                <div className="absolute top-8 right-8 text-6xl font-bold text-white/5 select-none font-mono">
                  0{step.id}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-${step.color.split('-')[1]}-500 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-lg -z-10`} />
              
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;