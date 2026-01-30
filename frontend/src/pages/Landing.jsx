import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion"; // Import motion hooks
import { AuroraBackground } from "@/components/ui/aurora-background"; 
import Navbar from "@/components/Navbar"; 
import HeroCard from "@/components/ui/hero-card";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each item
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Landing = () => {
  // Scroll Parallax Hooks
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Parallax: As user scrolls down, Text moves slower (y) and Card moves faster (y * 2)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <AuroraBackground>
      <Navbar />

      <div ref={targetRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full pt-20 lg:pt-0">
          
          {/* --- LEFT COLUMN: ANIMATED TEXT --- */}
          <motion.div 
            style={{ y: textY }} // Apply Parallax
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left space-y-8"
          >
            
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cyan-400 font-medium text-xs">
              <Sparkles size={14} />
              <span>AI-Powered Finance</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Know your odds <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                before you apply.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-lg text-neutral-400 max-w-xl leading-relaxed">
              Stop guessing with your credit. Our AI engine analyzes your profile against 50+ lenders to predict your approval chances instantly.
            </motion.p>

            {/* Trust Points */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-neutral-300">
                <CheckCircle2 size={18} className="text-cyan-500" />
                <span>No impact on credit score</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <CheckCircle2 size={18} className="text-cyan-500" />
                <span>Bank-grade encryption</span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-row gap-4 pt-4">
              <Link 
                to="/check-eligibility"
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 hover:scale-105"
              >
                Start Check <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all">
                How it works
              </button>
            </motion.div>
          </motion.div>

          {/* --- RIGHT COLUMN: 3D CARD ENTRANCE --- */}
          <motion.div 
            style={{ y: cardY }} // Apply Parallax (moves faster than text)
            initial={{ opacity: 0, x: 100, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block perspective-1000"
          >
             <HeroCard />
             
             {/* Decorative Background Blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          </motion.div>

        </div>
      </div>
    </AuroraBackground>
  );
};

export default Landing;