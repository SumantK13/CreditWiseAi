import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, BarChart3, Lock, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 border border-indigo-100">
              <Zap size={16} fill="currentColor" />
              <span>AI-Powered Loan Eligibility Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Stop Guessing. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Start Getting Approved.
              </span>
            </h1>
            
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              We analyze your financial profile against 50+ banks using AI to predict 
              approval chances before you apply. No hard inquiries. No credit score impact.
            </p>
            
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/check-eligibility" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                Check My Eligibility <ChevronRight size={20} />
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-slate-400">
              <Lock size={12} className="inline mr-1" />
              Bank-grade security. Your data is never shared without consent.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Grid */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why borrowers trust us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
              title="Soft-Check Technology"
              desc="We verify your eligibility without triggering a hard inquiry on your CIBIL report."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
              title="AI Probability Score"
              desc="Our neural network predicts your approval odds with 92% accuracy based on your profile."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-indigo-600" />}
              title="Personalized Match"
              desc="We filter through thousands of loan products to find the ones that fit your income."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Cards
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;