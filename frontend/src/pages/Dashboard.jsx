import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle, 
  Banknote, Percent, Calendar, ChevronRight 
} from 'lucide-react';
import LoanEMIPanel from "@/components/emi/LoanEMIPanel";
import axios from 'axios';

const Dashboard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(
    state?.results ? { results: state.results, inputs: state.inputs } : null
  );
  const [loading, setLoading] = useState(!state?.results);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [openEmi, setOpenEmi] = useState(null);

  // On direct visits, try to load the latest saved analysis for the logged-in user
  useEffect(() => {
    if (state?.results) return; // we already have fresh data from the form

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchLastAnalysis = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/recommend/last`, {
          headers: { 'x-auth-token': token },
        });
        setData({ results: res.data.results, inputs: res.data.inputs });
      } catch (err) {
        if (err.response?.status === 404) {
          // No previous analysis for this user – just show the empty state
        } else {
          console.error('Failed to fetch last analysis:', err);
          setError('Failed to load your last analysis. You may need to run a new check.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLastAnalysis();
  }, [state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <Navbar />
        <div className="mt-24 text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your last analysis...</h2>
          <p className="text-neutral-400 text-sm">
            Please wait while we retrieve your saved eligibility check.
          </p>
        </div>
      </div>
    );
  }

  // If accessed directly without data and nothing saved, show prompt to start a new check
  if (!data?.results) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <Navbar />
        <h2 className="text-2xl font-bold mb-4">No analysis data found</h2>
        {error && <p className="text-red-400 mb-2 text-sm">{error}</p>}
        <Link
          to="/check-eligibility"
          className="px-6 py-3 bg-cyan-600 rounded-xl font-bold hover:bg-cyan-500"
        >
          Start New Check
        </Link>
      </div>
    );
  }

  const { results: loans, inputs } = data;

  // Normalize a loanType string to a key for filtering
  const normalizeType = (value = '') => value.toLowerCase().trim();

  // Fixed list of types the user can select
  const filterOptions = [
    { id: 'all', label: 'All Loans' },
    { id: 'home', label: 'Home Loan' },
    { id: 'car', label: 'Car Loan' },
    { id: 'education', label: 'Education Loan' },
    { id: 'personal', label: 'Personal Loan' },
  ];

  const filteredLoans = loans.filter((loan) => {
    if (selectedType === 'all') return true;

    // Backwards compatibility: if loanType is missing, treat it as "personal"
    if (!loan.loanType && selectedType === 'personal') return true;

    const key = normalizeType(loan.loanType);
    // Match if the loan type string contains the selected keyword
    return key.includes(selectedType);
  });

  // Helper for Status Colors
  const getStatusColor = (prob) => {
    if (prob >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (prob >= 50) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const getProgressBarColor = (prob) => {
    if (prob >= 80) return 'bg-emerald-500';
    if (prob >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* HEADER */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/check-eligibility')} 
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Edit Details
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Analysis Results
              </h1>
              <p className="text-neutral-400">
                Found{' '}
                <span className="text-white font-bold">
                  {filteredLoans.length} lenders
                </span>{' '}
                matching your profile.
              </p>
            </div>
            
            {/* Quick Stats + Filter */}
            <div className="flex flex-col items-stretch md:flex-row md:items-center gap-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-neutral-900 border border-white/5">
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Loan Amount</div>
                  <div className="text-xl font-bold">₹ {(inputs.loanAmount / 100000).toFixed(1)} Lakh</div>
                </div>
                <div className="w-[1px] bg-white/10"></div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Tenure</div>
                  <div className="text-xl font-bold">{inputs.tenureYears} Years</div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedType(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      selectedType === opt.id
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-neutral-900 text-neutral-300 border-white/10 hover:border-cyan-400/60 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="grid grid-cols-1 gap-6">
          {filteredLoans.length === 0 && (
            <div className="col-span-1 rounded-2xl bg-neutral-900 border border-white/10 p-6 text-center text-sm text-neutral-400">
              No lenders found for the selected loan type. Try a different filter.
            </div>
          )}

          {filteredLoans.map((loan, index) => (
  <motion.div
    key={loan._id || index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group relative bg-neutral-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8 hover:border-cyan-500/30 hover:bg-neutral-900/60 transition-all duration-300"
  >
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
      
      {/* 1. BANK INFO */}
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-2xl font-bold text-white mb-1">{loan.bankName}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(loan.approvalProbability)}`}>
            {loan.status}
          </span>
        </div>
      </div>

      {/* 2. NUMBERS */}
      <div className="flex-1 grid grid-cols-2 gap-4 w-full md:w-auto">
        <div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1">
            <Percent size={14} /> Interest Rate
          </div>
          <div className="text-xl font-bold text-white">{loan.interestRate}%</div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1">
            <Banknote size={14} /> Monthly EMI
          </div>
          <div className="text-xl font-bold text-white">
            ₹ {loan.monthlyEMI.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. PROBABILITY */}
      <div className="w-full md:w-64">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-400">Approval Chance</span>
          <span className="font-bold text-cyan-400">
            {loan.approvalProbability.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${loan.approvalProbability}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-cyan-500 rounded-full"
          />
        </div>
      </div>

      {/* 4. APPLY BUTTON */}
      <div className="w-full md:w-auto flex justify-end">
        {loan.link ? (
          <a
            href={loan.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
          >
            Apply <ChevronRight size={16} />
          </a>
        ) : (
          <button
            disabled
            className="px-5 py-3 rounded-xl bg-neutral-800 text-neutral-500 font-bold cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>

    {/* ---------- EMI TOGGLE BUTTON ---------- */}
    <div className="mt-6 border-t border-white/5 pt-6">
  <button
    onClick={() =>
      navigate(`/emi/${loan._id || index}`, {
        state: { loan, inputs }
      })
    }
    className="px-5 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition"
  >
    EMI Details
  </button>

      {/* ---------- EMI PANEL ---------- */}
      {openEmi === index && (
        <LoanEMIPanel
          loanAmount={inputs.loanAmount}
          interestRate={loan.interestRate}
          tenure={inputs.tenureYears}
        />
      )}
    </div>
  </motion.div>
))}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;