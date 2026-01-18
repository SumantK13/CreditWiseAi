import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, BarChart3, Lock, TrendingUp, CheckCircle2, Sparkles, ArrowRight, Shield, Database, Cpu } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-white text-[#0F172A]">
      {/* Hero Section - Asymmetric Layout */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 via-purple-100 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 left-40 w-80 h-80 bg-gradient-to-tr from-purple-200 via-purple-100 to-transparent rounded-full blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-[#4F46E5] font-medium text-sm border border-purple-200 hover:border-purple-300 transition-colors">
                <Sparkles size={16} className="text-[#4F46E5]" />
                <span>AI-Powered Loan Intelligence</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
                  Know Your
                  <span className="block bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#2EE6D6] bg-clip-text text-transparent mt-2">
                    Approval Odds.
                  </span>
                  <span className="block text-[#0F172A]">Before You Apply.</span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-lg text-[#475569] leading-relaxed max-w-xl">
                Our AI analyzes your financial profile against 50+ banks to predict approval chances with 92% accuracy — 
                <span className="font-semibold text-[#4F46E5]"> no credit score impact, no hard inquiries</span>.
              </p>

              {/* Key Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[#475569]">Soft-check technology — won't affect your CIBIL score</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[#475569]">Bank-grade encryption & zero data sharing without consent</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[#475569]">Instant results — understand your loan options in seconds</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/check-eligibility" className="group px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold rounded-xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/60 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 hover:gap-3">
                  Check My Eligibility
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 bg-slate-100 text-[#0F172A] font-bold rounded-xl hover:bg-slate-200 transition-all duration-300 border border-[#E2E8F0] flex items-center justify-center gap-2">
                  <Zap size={18} />
                  See Sample Report
                </button>
              </div>

              {/* Trust Line */}
              <p className="text-xs text-[#475569] flex items-center gap-2 pt-2">
                <Lock size={14} className="text-[#4F46E5]" />
                Bank-grade security. Built in India. INDIA's first AI loan eligibility engine.
              </p>
            </div>

            {/* Right: Visual Component - AI Score Card */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-sm">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-300 rounded-3xl blur-3xl opacity-20"></div>
                
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-white to-white backdrop-blur-xl rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden">
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider">Your AI Score</h3>
                      <Sparkles className="text-[#2EE6D6]" size={20} />
                    </div>

                    {/* Main Score Display */}
                    <div className="mb-8">
                      <div className="relative mb-4">
                        <svg className="w-32 h-32 transform -rotate-90 mx-auto" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeDasharray={`${135} ${339}`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#4F46E5" />
                              <stop offset="100%" stopColor="#2EE6D6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#4F46E5] to-[#2EE6D6] bg-clip-text">
                            78%
                          </div>
                          <div className="text-xs text-[#475569] mt-1">Approval</div>
                        </div>
                      </div>
                      <p className="text-center text-sm text-[#475569] font-medium">
                        High chance across 12 lenders
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 border-t border-[#E2E8F0] pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#475569]">Max Loan Amount</span>
                        <span className="font-bold text-[#0F172A]">₹5,50,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#475569]">Avg Interest Rate</span>
                        <span className="font-bold text-[#0F172A]">7.8% p.a.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#475569]">Soft Check?</span>
                        <span className="font-bold text-emerald-600">✓ Safe</span>
                      </div>
                    </div>

                    {/* CTA in Card */}
                    <button className="w-full mt-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200">
                      Proceed to Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar Section */}
      <div className="relative bg-gradient-to-r from-[#0F172A] to-[#1E293B] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <TrustItem 
              icon={<Database size={24} className="text-[#2EE6D6]" />}
              title="50+ Banks"
              subtitle="Analyzed Instantly"
            />
            <TrustItem 
              icon={<Shield size={24} className="text-[#2EE6D6]" />}
              title="No Hard Inquiries"
              subtitle="Soft-Check Only"
            />
            <TrustItem 
              icon={<Cpu size={24} className="text-[#2EE6D6]" />}
              title="92% Accurate"
              subtitle="AI-Backed Predictions"
            />
            <TrustItem 
              icon={<ShieldCheck size={24} className="text-[#2EE6D6]" />}
              title="Bank-Grade"
              subtitle="Military Encryption"
            />
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Your journey from confusion to confidence, powered by artificial intelligence
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              num="01"
              icon={<BarChart3 className="w-6 h-6" />}
              title="AI Eligibility Check"
              desc="Answer 5 quick questions. Our AI instantly analyzes your profile against 50+ lenders."
              delay="delay-0"
            />
            <FeatureCard 
              num="02"
              icon={<TrendingUp className="w-6 h-6" />}
              title="Approval Probability"
              desc="Get a clear percentage showing your chances across different loan products and banks."
              delay="delay-100"
            />
            <FeatureCard 
              num="03"
              icon={<Zap className="w-6 h-6" />}
              title="Bank Matching"
              desc="Discover which specific banks are most likely to approve you with best rates."
              delay="delay-200"
            />
            <FeatureCard 
              num="04"
              icon={<TrendingUp className="w-6 h-6" />}
              title="Optimization Tips"
              desc="Get actionable advice to improve your approval odds and get better rates."
              delay="delay-300"
            />
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-20 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-100 rounded-full blur-3xl opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6">
            Ready to Know Your Odds?
          </h2>
          <p className="text-lg text-[#475569] mb-8 max-w-2xl mx-auto">
            Get your AI-backed approval prediction in under 60 seconds. No credit score impact. No spam. No pressure.
          </p>
          <Link 
            to="/check-eligibility" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold rounded-xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/60 transition-all duration-300 hover:scale-105 group"
          >
            Check My Eligibility Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Footer Trust Statement */}
      <div className="bg-[#0F172A] text-slate-400 py-8 px-4 text-center text-sm border-t border-slate-700">
        <p>
          🔒 Your data is encrypted with bank-grade security | 📱 Regulated & compliant with RBI guidelines | ✅ 10,000+ loans approved
        </p>
      </div>
    </div>
  );
};

// Trust Item Component
const TrustItem = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center gap-3 text-center">
    <div className="p-3 bg-[#2EE6D6]/20 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-white font-bold text-sm">{title}</p>
      <p className="text-slate-400 text-xs">{subtitle}</p>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ num, icon, title, desc, delay }) => (
  <div className={`group relative bg-white rounded-2xl border border-[#E2E8F0] p-8 hover:border-[#2EE6D6] transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/30 hover:-translate-y-2 ${delay}`}>
    {/* Gradient border effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-teal-500/0 group-hover:from-purple-500/5 group-hover:to-teal-500/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
    
    <div className="relative">
      {/* Number Badge */}
      <div className="inline-block mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-[#4F46E5] to-[#2EE6D6] bg-clip-text">
        {num}
      </div>

      {/* Icon */}
      <div className="mb-4 p-3 bg-purple-50 rounded-xl w-fit text-[#4F46E5] group-hover:bg-purple-100 transition-colors">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#0F172A] mb-3">{title}</h3>

      {/* Description */}
      <p className="text-[#475569] leading-relaxed text-sm">{desc}</p>

      {/* Accent Line */}
      <div className="mt-4 h-1 w-8 bg-gradient-to-r from-[#4F46E5] to-[#2EE6D6] rounded-full group-hover:w-12 transition-all duration-300"></div>
    </div>
  </div>
);

export default Landing;