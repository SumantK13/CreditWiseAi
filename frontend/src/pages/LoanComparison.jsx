import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCompare, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const LoanComparison = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const loans = state?.loans || [];
  const inputs = state?.inputs || {};

  // --- HELPER FUNCTIONS ---
  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || Number.isNaN(amount)) return 'N/A';
    return `₹ ${amount.toLocaleString()}`;
  };

  const getTenureValue = (loan) => {
    if (loan.tenureRange) return loan.tenureRange;
    if (inputs.tenureYears != null && inputs.tenureYears !== '')
      return `${inputs.tenureYears} Years`;
    return 'N/A';
  };

  const getMaxAmountValue = (loan) => {
    if (typeof loan.maxLoanAmount === 'number') return loan.maxLoanAmount;
    if (typeof loan.maxAmount === 'number') return loan.maxAmount;
    return inputs.loanAmount;
  };

  const getStatusStyle = (prob) => {
    if (prob >= 80) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    if (prob >= 50) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
    return 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
  };

  // Smart Link Redirector (Same as Dashboard)
  const getOfficialApplyLink = (bankName, loanType = "Loan") => {
    const searchQuery = encodeURIComponent(`${bankName} ${loanType} apply online official website`);
    return `https://www.google.com/search?q=${searchQuery}`;
  };

  // --- ROW DEFINITIONS (Now returning actual UI components, not just text) ---
  const rows = [
    { 
      label: 'Status', 
      render: (loan) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-max ${getStatusStyle(loan.approvalProbability)}`}>
           <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
           {loan.status || 'N/A'}
        </span>
      ) 
    },
    { 
      label: 'Approval Odds', 
      render: (loan) => (
        <div className="flex items-center gap-3">
          <span className="font-bold text-cyan-400 w-12">{loan.approvalProbability?.toFixed(1)}%</span>
          <div className="h-1.5 w-24 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${loan.approvalProbability}%` }}></div>
          </div>
        </div>
      ) 
    },
    { 
      label: 'Interest Rate', 
      render: (loan) => (
        <span className="text-lg font-bold text-white">{loan.interestRate ?? 'N/A'}% <span className="text-xs font-normal text-neutral-500">p.a.</span></span>
      ) 
    },
    { 
      label: 'Monthly EMI', 
      render: (loan) => (
        <span className="text-lg font-bold text-emerald-400">{formatAmount(loan.monthlyEMI)}</span>
      ) 
    },
    { 
      label: 'Total Payable', 
      render: (loan) => <span className="font-semibold text-white">{formatAmount(loan.totalAmountPayable)}</span> 
    },
    { 
      label: 'FOIR Impact', 
      render: (loan) => (
        <span className={`font-semibold ${loan.foir > 50 ? 'text-red-400' : 'text-purple-400'}`}>
          {typeof loan.foir === 'number' ? `${loan.foir}%` : 'N/A'}
        </span>
      ) 
    },
    { 
      label: 'Processing Fee', 
      render: (loan) => <span className="text-neutral-300">{loan.processingFee || 'Standard'}</span> 
    },
    { 
      label: 'Max Amount', 
      render: (loan) => <span className="text-neutral-300">{formatAmount(getMaxAmountValue(loan))}</span> 
    },
    { 
      label: 'Tenure', 
      render: (loan) => <span className="text-neutral-300">{getTenureValue(loan)}</span> 
    },
    {
      label: 'Rejection Risk',
      render: (loan) => loan.rejectionReason ? (
        <span className="text-red-400 text-xs flex items-center gap-1 font-medium bg-red-500/10 px-2 py-1.5 rounded border border-red-500/20 w-max">
          <AlertTriangle size={12} /> {loan.rejectionReason}
        </span>
      ) : <span className="text-neutral-500">-</span>
    },
    {
      label: 'Features',
      render: (loan) =>
        Array.isArray(loan.features) && loan.features.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {loan.features.map((f, i) => (
               <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 text-neutral-300 text-xs border border-white/10 whitespace-nowrap">
                 <ShieldCheck size={12} className="text-cyan-500" /> {f}
               </span>
            ))}
          </div>
        ) : <span className="text-neutral-500">N/A</span>
    },
  ];

  // --- EMPTY STATE ---
  if (loans.length < 2) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <Navbar />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <main className="mx-auto max-w-lg px-4 pt-32 pb-12 sm:px-6 lg:px-8 relative z-10">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-md p-10 text-center shadow-2xl">
            <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10">
              <GitCompare className="text-cyan-400" size={30} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-3">
              Nothing to compare
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-neutral-400">
              Head back to your results and click <strong className="text-white">Compare</strong> on at least two lenders to view them side-by-side.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105"
            >
              <ArrowLeft size={18} /> Back to Matches
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // --- MAIN COMPARISON VIEW ---
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* VIBE: Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Matches
        </button>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 tracking-wider uppercase">
              <GitCompare size={14} /> Head-to-Head
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl mb-3">
              Offer <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Comparison.</span>
            </h1>
            <p className="max-w-xl text-lg text-neutral-400">
              Evaluating {loans.length} customized lending options based on your financial profile.
            </p>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full border-collapse text-left">
              
              {/* TABLE HEADER (Bank Names) */}
              <thead>
                <tr className="border-b border-white/10">
                  <th className="sticky left-0 z-20 min-w-[160px] border-r border-white/5 bg-black/80 px-6 py-6 text-xs font-bold uppercase tracking-widest text-neutral-500 backdrop-blur-xl sm:min-w-[200px]">
                    Analysis Metric
                  </th>
                  {loans.map((loan) => (
                    <th
                      key={loan.compareId || loan._id || loan.bankName}
                      className="min-w-[280px] px-6 py-6 bg-white/[0.02]"
                    >
                      <div className="text-2xl font-bold text-white mb-1 tracking-tight">{loan.bankName}</div>
                      <div className="inline-block rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {loan.loanType || 'Loan Offer'}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* TABLE BODY (Metrics) */}
              <tbody className="divide-y divide-white/[0.06]">
                {rows.map((row) => (
                  <tr key={row.label} className="transition-colors hover:bg-white/[0.02] group">
                    <td className="sticky left-0 z-10 border-r border-white/5 bg-black/80 px-6 py-5 text-sm font-semibold text-neutral-400 backdrop-blur-xl group-hover:text-white transition-colors">
                      {row.label}
                    </td>
                    {loans.map((loan) => (
                      <td
                        key={`${row.label}-${loan.compareId || loan._id || loan.bankName}`}
                        className="px-6 py-5 text-sm leading-relaxed"
                      >
                        {row.render(loan)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* ACTION ROW (Apply Buttons) */}
                <tr className="bg-white/[0.02]">
                  <td className="sticky left-0 z-10 border-r border-white/5 bg-black/80 px-6 py-6 backdrop-blur-xl">
                    {/* Empty cell for metric column */}
                  </td>
                  {loans.map((loan) => (
                    <td key={`action-${loan.compareId || loan._id}`} className="px-6 py-6">
                       <a
                          href={getOfficialApplyLink(loan.bankName, loan.loanType)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-black font-bold hover:scale-[1.02] transition-transform text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                          Apply Officially <ChevronRight size={16} />
                        </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LoanComparison;