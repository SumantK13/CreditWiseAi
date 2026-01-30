import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-black z-0 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium text-xs mb-8">
          <Sparkles size={14} />
          <span>Ready to check?</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
          Stop wondering. <br />
          Start <span className="text-cyan-400">knowing.</span>
        </h2>

        <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of users who found their perfect loan match without hurting their credit score.
        </p>

        <Link 
          to="/check-eligibility" 
          className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-cyan-50 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          Check My Eligibility <ArrowRight size={20} />
        </Link>

      </div>
    </section>
  );
};

export default CTA;