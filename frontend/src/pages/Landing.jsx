import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background"; 
import Navbar from "@/components/Navbar"; 
import HeroCard from "@/components/ui/hero-card";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Landing = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuroraBackground>
      {/* 1. Navbar (Fixed at top) */}
      <Navbar />

      {/* 2. HERO SECTION */}
      {/* We add 'pb-32' to give space for the fade effect at the bottom */}
      <div ref={targetRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          
          {/* Left Column (Text) */}
          <motion.div 
            style={{ y: textY }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cyan-400 font-medium text-xs">
              <Sparkles size={14} />
              <span>AI-Powered Finance</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Know your odds <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                before you apply.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-neutral-400 max-w-xl leading-relaxed">
              Stop guessing with your credit. Our AI engine analyzes your profile against 50+ lenders to predict your approval chances instantly.
            </motion.p>

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

            <motion.div variants={itemVariants} className="flex flex-row gap-4 pt-4">
              <Link 
                to="/check-eligibility"
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 hover:scale-105"
              >
                Start Check <ArrowRight size={18} />
              </Link>
              <button 
                onClick={scrollToHowItWorks}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                How it works
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column (Card) */}
          <motion.div 
            style={{ y: cardY }}
            initial={{ opacity: 0, x: 100, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block perspective-1000"
          >
             <HeroCard />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          </motion.div>

        </div>
      </div>

      {/* 3. THE FADE TRANSITION */}
      {/* This gradient sits at the bottom of the Aurora section and fades into black */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black z-20 pointer-events-none"></div>

      {/* 4. CONTENT SECTIONS (Solid Black Background) */}
      {/* relative z-30 ensures it sits ON TOP of the Aurora, blocking it out */}
     {/* 4. CONTENT SECTIONS (Solid Black Background) */}
    <div className="relative z-30 bg-black">
      <HowItWorks />
      {/* New Section */}
      <Features /> 
      <CTA/>
      <Footer />
    </div>

    </AuroraBackground>
  );
};

export default Landing;