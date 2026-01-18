import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Calculator, Wallet, Briefcase, IndianRupee } from 'lucide-react';
import { calculateEstimatedScore } from '../utils/creditScoreCalculator';

const LoanForm = () => {
  const navigate = useNavigate();
  const [showEstimator, setShowEstimator] = useState(false);
  
  const [formData, setFormData] = useState({
    income: '',          // Param 1
    existingEmi: '',     // Param 2
    creditScore: '',     // Param 3
    employmentType: 'salaried', // Param 4
    loanAmount: '',      // Param 5
    tenure: '5',         // Param 6 (Years)
  });

  // Simulator State
  const [estimator, setEstimator] = useState({ payOnTime: 'yes', hasLoans: 'no', hasCreditCard: 'no' });
  const [age, setAge] = useState('');

  const calculateScore = () => {
    if (!age) {
      alert('Please enter your age to calculate the score');
      return;
    }
    const estimatedScore = calculateEstimatedScore(estimator, parseInt(age));
    setFormData({ ...formData, creditScore: estimatedScore });
    setShowEstimator(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard', { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Check Eligibility</h2>
          <p className="text-slate-500 mt-2">Fill in your details to get AI-powered recommendations.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Financial Profile */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Wallet size={18} className="text-indigo-600"/> Financial Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income (₹)</label>
                <input required type="number" placeholder="e.g. 50000" className="input-field"
                  onChange={(e) => setFormData({...formData, income: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Monthly EMIs (₹)</label>
                <input required type="number" placeholder="e.g. 5000" className="input-field"
                  onChange={(e) => setFormData({...formData, existingEmi: e.target.value})} />
                <p className="text-xs text-slate-400 mt-1">Sum of all current loan payments.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['salaried', 'self-employed', 'student'].map((type) => (
                  <button
                    key={type} type="button"
                    onClick={() => setFormData({...formData, employmentType: type})}
                    className={`py-3 px-4 rounded-lg border text-sm font-medium capitalize transition-all ${
                      formData.employmentType === type 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Credit Score */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600"/> Credit Information
            </h3>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-slate-700">CIBIL/Credit Score</label>
                <button type="button" onClick={() => setShowEstimator(!showEstimator)} 
                  className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline">
                  <HelpCircle size={14} /> Don't know my score
                </button>
              </div>
              
              <input type="number" value={formData.creditScore} placeholder="e.g. 750" className="input-field mb-4"
                onChange={(e) => setFormData({...formData, creditScore: e.target.value})} />

              {showEstimator && (
                <div className="animate-fade-in-down bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800 mb-3">Score Simulator</p>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <input type="number" placeholder="Your Age" className="p-2 border rounded" 
                      value={age} onChange={(e) => setAge(e.target.value)} />
                    <select className="p-2 border rounded" onChange={(e) => setEstimator({...estimator, payOnTime: e.target.value})}>
                      <option value="yes">I pay bills on time (Always)</option>
                      <option value="sometimes">I miss payments sometimes</option>
                      <option value="no">I rarely pay on time</option>
                    </select>
                    <select className="p-2 border rounded" onChange={(e) => setEstimator({...estimator, hasLoans: e.target.value})}>
                      <option value="no">I have no other loans</option>
                      <option value="yes">I have active loans</option>
                    </select>
                    <select className="p-2 border rounded" onChange={(e) => setEstimator({...estimator, hasCreditCard: e.target.value})}>
                      <option value="no">I don't have a credit card</option>
                      <option value="yes">I have a credit card</option>
                    </select>
                    <button type="button" onClick={calculateScore} className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700">
                      Estimate Score
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Loan Details */}
          <div className="space-y-6">
             <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
              <IndianRupee size={18} className="text-indigo-600"/> Loan Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Amount (₹)</label>
                <input required type="number" placeholder="e.g. 500000" className="input-field"
                  onChange={(e) => setFormData({...formData, loanAmount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tenure (Years)</label>
                <select className="input-field" onChange={(e) => setFormData({...formData, tenure: e.target.value})}>
                  {[1,2,3,4,5,7,10,15,20].map(y => <option key={y} value={y}>{y} Years</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
            Analyze Eligibility
          </button>
        </form>
      </div>
    </div>
  );
};

// Add this CSS via a class or styled-component. For now, inline utility:
// "input-field" corresponds to: "w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"

export default LoanForm;