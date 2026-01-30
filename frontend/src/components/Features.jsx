import React from "react";
import { Shield, Zap, Target, Globe, Lock, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Privacy First",
    description: "We don't sell your data. No spam calls, no random emails. Your financial data is encrypted and anonymized.",
    icon: Lock,
    size: "col-span-1 md:col-span-1", // Small square
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "92% Prediction Accuracy",
    description: "Our AI model is trained on millions of loan applications to give you the most accurate approval odds in the industry.",
    icon: Target,
    size: "col-span-1 md:col-span-2", // Wide rectangle
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Real-Time Analysis",
    description: "Get your eligibility report in under 60 seconds. No waiting for manual reviews.",
    icon: Zap,
    size: "col-span-1 md:col-span-2", // Wide rectangle
    gradient: "from-amber-500/20 to-orange-500/20"
  },
  {
    title: "Universal Market View",
    description: "We scan 50+ lenders simultaneously to find deals that specific banks won't tell you about.",
    icon: Globe,
    size: "col-span-1 md:col-span-1", // Small square
    gradient: "from-emerald-500/20 to-green-500/20"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-black relative z-20">
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why use <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CreditWise?</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl">
            Banks look after their interests. We look after yours. 
            Here is the unfair advantage you get with AI.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/5 p-8 ${feature.size}`}
            >
              
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10`} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-white" size={24} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Decorative Border Glow on Hover */}
              <div className="absolute inset-0 border border-white/5 rounded-3xl group-hover:border-white/20 transition-colors duration-300" />
            
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;