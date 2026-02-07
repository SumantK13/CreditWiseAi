import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowRight, Wallet, Briefcase, Store, GraduationCap, 
  Landmark, CheckCircle2, HelpCircle, Calendar, Loader2 
} from 'lucide-react';

const LoanForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const totalSteps = 3;

  // Form State
  const [formData, setFormData] = useState({
    age: '', 
    income: '',
    existingEmi: '',
    creditScore: '',
    employmentType: 'salaried',
    loanAmount: '',
    tenure: '5',
  });

  const [showEstimator, setShowEstimator] = useState(false);
  
  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // 1. MAP DATA TO BACKEND FORMAT
      const payload = {
        monthlyIncome: parseInt(formData.income),
        currentEMIs: parseInt(formData.existingEmi),
        employmentType: formData.employmentType,
        creditScore: parseInt(formData.creditScore),
        loanAmount: parseInt(formData.loanAmount),
        tenureYears: parseInt(formData.tenure),
        age: parseInt(formData.age)
      };

      // 2. CALL THE API
      const res = await axios.post(`${API_URL}/recommend`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      // 3. NAVIGATE WITH RESULTS
      navigate('/dashboard', { state: { results: res.data, inputs: payload } });

    } catch (err) {
      console.error("Analysis Failed:", err);
      alert("Something went wrong with the analysis. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      
      {/* 1. THE "SCANNER" HEADER BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden z-0 pointer-events-none">
        
        {/* The Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_-20%,#000_20%,transparent_100%)]"></div>
        
        {/* The Massive Glow Orb */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        
        {/* Secondary Purple Glow */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      
      </div>

      {/* 2. HEADER CONTENT */}
      <div className="relative z-10 pt-20 pb-12 text-center px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-medium mb-6 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span>System Ready</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Eligibility Check
            </span>
          </h1>
          
          <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed">
             Initialize the AI scanner. We'll analyze your profile against 50+ lenders in real-time.
          </p>
        </motion.div>
      </div>

      {/* 3. FORM CARD */}
      <div className="relative z-20 flex justify-center px-4 pb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl ring-1 ring-white/5"
        >
          
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between text-xs text-neutral-400 mb-3 uppercase tracking-wider font-semibold">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <form onSubmit={handleNext}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300 ml-1">Current Age</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        required type="number" min="18" max="100" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="e.g. 26" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-neutral-300 ml-1">Employment Status</label>
                     <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'salaried', label: 'Salaried', icon: Briefcase },
                        { id: 'self-employed', label: 'Self Employed', icon: Store },
                        { id: 'student', label: 'Student', icon: GraduationCap },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setFormData({...formData, employmentType: item.id})}
                          className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-200 group ${
                            formData.employmentType === item.id 
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                            : 'bg-white/5 border-transparent text-neutral-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <item.icon 
                            className={`mx-auto mb-2 transition-transform duration-300 ${
                              formData.employmentType === item.id ? 'scale-110' : 'group-hover:scale-110'
                            }`} 
                            size={24} 
                          />
                          <span className="text-xs font-bold uppercase tracking-wide block">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300 ml-1">Monthly Income (₹)</label>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        required type="number" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} placeholder="e.g. 85000" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all text-lg"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: FINANCIAL HEALTH */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300 ml-1">Current Monthly EMIs (₹)</label>
                    <div className="relative group">
                      <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        required type="number" value={formData.existingEmi} onChange={(e) => setFormData({...formData, existingEmi: e.target.value})} placeholder="e.g. 12000" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-medium text-neutral-300">CIBIL / Credit Score</label>
                      <button type="button" onClick={() => setShowEstimator(true)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        <HelpCircle size={12} /> Don't know?
                      </button>
                    </div>
                    <div className="relative group">
                      <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="number" value={formData.creditScore} onChange={(e) => setFormData({...formData, creditScore: e.target.value})} placeholder="e.g. 750" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all text-lg"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: LOAN REQ */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300 ml-1">Required Loan Amount (₹)</label>
                    <input 
                      required type="number" value={formData.loanAmount} onChange={(e) => setFormData({...formData, loanAmount: e.target.value})} placeholder="e.g. 500000" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white text-center text-3xl font-bold focus:border-cyan-500/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-6">
                    <label className="text-sm font-medium text-neutral-300 ml-1 block text-center">
                      Loan Tenure: <span className="text-cyan-400 font-bold text-xl">{formData.tenure} Years</span>
                    </label>
                    <input 
                      type="range" min="1" max="20" step="1" value={formData.tenure} onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-neutral-500 px-1 font-mono">
                      <span>1 YEAR</span>
                      <span>20 YEARS</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-10 pt-8 border-t border-white/5">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="px-6 py-3 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  Back
                </button>
              )}
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Scanning...' : (step === totalSteps ? 'Analyze Eligibility' : 'Continue')}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* 4. LOADING OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-4"
          >
            {/* Pulsing Scanner Effect */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 size={32} className="text-cyan-400 animate-spin" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Profile</h2>
            <p className="text-neutral-400 max-w-sm">
              Connecting to Python Neural Engine...<br/>
              Evaluating risk parameters against live bank data.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LoanForm;