import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, PieChart } from 'lucide-react';

const Dashboard = () => {
  const { state } = useLocation(); // Contains the 6 parameters
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  // Mock Database of Loans
  const allLoans = [
    { id: 1, bank: "HDFC Bank", name: "Smart Personal", rate: 10.5, maxAmt: 1500000, minScore: 720, type: "salaried" },
    { id: 2, bank: "SBI", name: "Scholar Ed-Loan", rate: 8.5, maxAmt: 2000000, minScore: 650, type: "student" },
    { id: 3, bank: "ICICI", name: "Business Growth", rate: 11.2, maxAmt: 5000000, minScore: 700, type: "self-employed" },
    { id: 4, bank: "Kotak", name: "Quick Cash", rate: 14.0, maxAmt: 500000, minScore: 600, type: "any" },
    { id: 5, bank: "Axis Bank", name: "Prime Home", rate: 8.7, maxAmt: 10000000, minScore: 750, type: "salaried" },
  ];

  // Helper: Calculate EMI
  const calculateEMI = (principal, rate, years) => {
    const r = rate / 12 / 100;
    const n = years * 12;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  useEffect(() => {
    // Simulate AI Processing Delay (2 seconds)
    setTimeout(() => {
      if (!state) return;

      const userIncome = Number(state.income);
      const userEmi = Number(state.existingEmi);
      const userScore = Number(state.creditScore);
      const reqAmount = Number(state.loanAmount);
      
      // LOGIC: Filter & Score Loans
      const filtered = allLoans.map(loan => {
        let probability = 0;
        let reasons = [];

        // 1. Employment Check
        if (loan.type !== 'any' && loan.type !== state.employmentType) {
          return null; // Hard reject
        }

        // 2. FOIR Check (Fixed Obligation to Income Ratio)
        // If (Existing EMI + New EMI) > 50% of Income, Risky.
        const estNewEMI = calculateEMI(reqAmount, loan.rate, state.tenure);
        const totalObligation = userEmi + estNewEMI;
        const foir = (totalObligation / userIncome) * 100;

        if (foir > 60) return null; // Hard reject: Cannot afford

        // 3. AI Probability Calculation (Mock Logic)
        let baseScore = 50; 
        if (userScore >= loan.minScore) baseScore += 30;
        if (foir < 40) baseScore += 20; // Healthy income
        if (state.employmentType === 'salaried') baseScore += 10;

        // Cap at 98%
        if (baseScore > 98) baseScore = 98;
        
        return { 
          ...loan, 
          prob: baseScore, 
          emi: Math.round(estNewEMI),
          foir: Math.round(foir)
        };
      }).filter(Boolean).sort((a, b) => b.prob - a.prob);

      setRecommendations(filtered);
      setLoading(false);
    }, 2000);
  }, [state]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analysis Report</h1>
            <p className="text-slate-500 mt-1">
              Based on Income: ₹{state?.income} | Score: {state?.creditScore}
            </p>
          </div>
          <Link to="/check-eligibility" className="text-indigo-600 font-medium hover:underline">
            Modify Inputs
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List (Left) */}
          <div className="lg:col-span-2 space-y-6">
            {recommendations.length > 0 ? (
              recommendations.map((loan, idx) => (
                <div key={loan.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 transition-all relative overflow-hidden group">
                  {/* Approval Badge */}
                  <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase rounded-bl-xl ${
                    loan.prob > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {loan.prob}% Approval Chance
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{loan.bank}</h3>
                      <p className="text-slate-500 text-sm">{loan.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400">Interest Rate</p>
                      <p className="text-lg font-semibold text-slate-800">{loan.rate}%</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400">Monthly EMI</p>
                      <p className="text-lg font-semibold text-slate-800">₹{loan.emi.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400">Tenure</p>
                      <p className="text-lg font-semibold text-slate-800">{state.tenure} Yrs</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">
                      Apply Now
                    </button>
                    <button className="px-4 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl text-center border border-red-100">
                <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No Pre-Approved Loans Found</h3>
                <p className="text-slate-500">Your Debt-to-Income ratio (FOIR) might be too high.</p>
              </div>
            )}
          </div>

          {/* Sidebar Stats (Right) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PieChart size={18} /> Financial Health
              </h3>
              
              {/* Fake Chart Visualization */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    Calculated FOIR
                  </span>
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {recommendations[0]?.foir || 0}%
                  </span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                  <div style={{ width: `${recommendations[0]?.foir || 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                </div>
                <p className="text-xs text-slate-500">
                  Banks prefer a FOIR (Fixed Obligation to Income Ratio) below 50%.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <TrendingUp size={18}/> Pro Tip
              </h3>
              <p className="text-sm text-blue-800">
                Increasing your tenure to {Number(state?.tenure) + 2} years could reduce your EMI by ₹2,500 and increase approval chances.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
    <h2 className="text-xl font-bold text-slate-700">Analyzing 50+ Banking Partners...</h2>
    <p className="text-slate-500">Verifying Credit Rules & Income Ratios</p>
  </div>
);

export default Dashboard;