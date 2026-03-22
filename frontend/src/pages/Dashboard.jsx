import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Banknote, Percent, ChevronRight, GitCompare
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
  /** Indices into full `loans` array for side-by-side compare (max 4). */
  const [compareIndices, setCompareIndices] = useState([]);

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

  const loanIndexKey = (loan) => {
    const idx = loans.indexOf(loan);
    return idx >= 0 ? idx : null;
  };

  const toggleCompareLoan = (loan) => {
    const idx = loanIndexKey(loan);
    if (idx == null) return;
    setCompareIndices((prev) => {
      if (prev.includes(idx)) return prev.filter((i) => i !== idx);
      if (prev.length >= 4) return prev;
      return [...prev, idx];
    });
  };

  const selectedForCompare = compareIndices
    .map((i) => loans[i])
    .filter(Boolean);

  const goToCompare = () => {
    if (selectedForCompare.length < 2) return;
    navigate('/loan-comparison', {
      state: {
        loans: selectedForCompare.map((loan, i) => ({
          ...loan,
          compareId: compareIndices[i],
        })),
        inputs,
      },
    });
  };

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

          {loans.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative mt-8 overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/50 via-neutral-900/80 to-neutral-950 p-5 shadow-[0_0_48px_-16px_rgba(6,182,212,0.35)] sm:p-6"
            >
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl"
                aria-hidden
              />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-600/10 blur-3xl" aria-hidden />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 shadow-inner">
                    <GitCompare className="text-cyan-300" size={22} strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                      Compare offers
                    </h2>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-neutral-400">
                      Choose two to four lenders below. We’ll show rates, EMI, fees, and approval signals in one table.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition-colors ${
                        selectedForCompare.length >= 2
                          ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200'
                          : 'border-white/10 bg-black/25 text-neutral-400'
                      }`}
                    >
                      {selectedForCompare.length} of 4 selected
                    </span>
                    {selectedForCompare.length > 0 && selectedForCompare.length < 2 && (
                      <span className="text-xs text-neutral-500">
                        Need {2 - selectedForCompare.length} more
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={goToCompare}
                    disabled={selectedForCompare.length < 2}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_32px_-6px_rgba(34,211,238,0.55)] transition-all hover:bg-cyan-300 hover:shadow-[0_0_40px_-6px_rgba(34,211,238,0.65)] disabled:pointer-events-none disabled:opacity-25 disabled:shadow-none sm:w-auto"
                  >
                    Open comparison
                    <ChevronRight size={18} className="opacity-90" aria-hidden />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* RESULTS GRID */}
        <div className="grid grid-cols-1 gap-6">
          {filteredLoans.length === 0 && (
            <div className="col-span-1 rounded-2xl bg-neutral-900 border border-white/10 p-6 text-center text-sm text-neutral-400">
              No lenders found for the selected loan type. Try a different filter.
            </div>
          )}

          {filteredLoans.map((loan, index) => {
            const idx = loanIndexKey(loan);
            const compareChecked = idx != null && compareIndices.includes(idx);
            const compareDisabled = idx == null || (compareIndices.length >= 4 && !compareChecked);
            const compareSlot =
              compareChecked && idx != null ? compareIndices.indexOf(idx) + 1 : null;
            return (
  <motion.div
    key={loan._id || index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`group relative overflow-hidden rounded-3xl border p-6 backdrop-blur-sm transition-all duration-300 md:p-8 ${
      compareChecked
        ? 'border-cyan-400/35 bg-gradient-to-br from-cyan-950/25 to-neutral-900/50 shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)] ring-1 ring-cyan-400/20'
        : 'border-white/10 bg-neutral-900/40 hover:border-cyan-500/30 hover:bg-neutral-900/60'
    }`}
  >
    <div className="flex flex-col gap-8 md:flex-row md:items-center">
      {/* 1. BANK INFO + compare toggle */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">{loan.bankName}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(loan.approvalProbability)}`}>
              {loan.status}
            </span>
          </div>
        </div>
        {loans.length >= 2 && (
          <button
            type="button"
            onClick={() => toggleCompareLoan(loan)}
            disabled={compareDisabled}
            aria-pressed={compareChecked}
            aria-label={
              compareChecked
                ? `Remove ${loan.bankName} from comparison`
                : `Add ${loan.bankName} to comparison`
            }
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all sm:mt-0.5 ${
              compareChecked
                ? 'border-cyan-400/45 bg-cyan-500/15 text-cyan-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                : 'border-white/12 bg-white/[0.04] text-neutral-300 hover:border-cyan-500/35 hover:bg-cyan-500/10 hover:text-white'
            } disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/12 disabled:hover:bg-white/[0.04] disabled:hover:text-neutral-300`}
          >
            {compareChecked ? (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-[11px] font-bold text-black shadow-sm">
                  {compareSlot}
                </span>
                <span>In compare</span>
              </>
            ) : (
              <>
                <GitCompare size={14} className="text-neutral-400 group-hover:text-cyan-300/90" aria-hidden />
                <span>Add to compare</span>
              </>
            )}
          </button>
        )}
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
);
})}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;