import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCompare } from 'lucide-react';
import Navbar from '@/components/Navbar';

const LoanComparison = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const loans = state?.loans || [];
  const inputs = state?.inputs || {};

  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || Number.isNaN(amount)) return 'N/A';
    return `₹ ${amount.toLocaleString()}`;
  };

  const getTenureValue = (loan) => {
    if (loan.tenureRange) return loan.tenureRange;
    if (inputs.tenureYears != null && inputs.tenureYears !== '')
      return `${inputs.tenureYears} years`;
    return 'N/A';
  };
  const getMaxAmountValue = (loan) => {
    if (typeof loan.maxLoanAmount === 'number') return loan.maxLoanAmount;
    if (typeof loan.maxAmount === 'number') return loan.maxAmount;
    return inputs.loanAmount;
  };

  const formatPercent = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  const rows = [
    { label: 'Loan Type', render: (loan) => loan.loanType || 'N/A' },
    { label: 'Status', render: (loan) => loan.status || 'N/A' },
    { label: 'Interest Rate', render: (loan) => `${loan.interestRate ?? 'N/A'}% p.a.` },
    { label: 'Monthly EMI', render: (loan) => formatAmount(loan.monthlyEMI) },
    { label: 'Total Amount Payable', render: (loan) => formatAmount(loan.totalAmountPayable) },
    { label: 'Max Amount', render: (loan) => formatAmount(getMaxAmountValue(loan)) },
    { label: 'Tenure', render: (loan) => getTenureValue(loan) },
    { label: 'Processing Fee', render: (loan) => loan.processingFee || 'N/A' },
    { label: 'FOIR', render: (loan) => (typeof loan.foir === 'number' ? `${loan.foir}%` : 'N/A') },
    { label: 'Approval Probability', render: (loan) => formatPercent(loan.approvalProbability) },
    {
      label: 'Rejection Reason',
      render: (loan) => loan.rejectionReason || 'N/A',
    },
    {
      label: 'Features',
      render: (loan) =>
        Array.isArray(loan.features) && loan.features.length > 0
          ? loan.features.join(', ')
          : 'N/A',
    },
  ];

  if (loans.length < 2) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-lg px-4 pt-28 pb-12 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-neutral-900/90 to-neutral-950 p-8 text-center shadow-[0_0_48px_-16px_rgba(6,182,212,0.3)]">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"
              aria-hidden
            />
            <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-500/10">
              <GitCompare className="text-cyan-300" size={26} strokeWidth={1.75} aria-hidden />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Nothing to compare yet
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
              On your results page, use <span className="text-neutral-300">Add to compare</span> on at least two lenders, then open the comparison.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-black shadow-[0_0_28px_-6px_rgba(34,211,238,0.5)] transition-all hover:bg-cyan-300"
            >
              <ArrowLeft size={18} aria-hidden />
              Back to results
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to results
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200/90">
              <GitCompare size={14} aria-hidden />
              {loans.length} offers
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Side-by-side comparison
            </h1>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">
              Rates, repayment, and eligibility signals in one view. Scroll horizontally on smaller screens.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-b from-neutral-900/80 to-neutral-950/90 shadow-[0_0_40px_-14px_rgba(6,182,212,0.2)]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="sticky left-0 z-20 min-w-[160px] border-r border-white/5 bg-neutral-950/95 px-4 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 backdrop-blur-sm sm:min-w-[200px] sm:px-5">
                    Metric
                  </th>
                  {loans.map((loan) => (
                    <th
                      key={loan.compareId || loan._id || loan.bankName}
                      className="min-w-[200px] px-4 py-4 sm:min-w-[220px] sm:px-5"
                    >
                      <div className="text-base font-semibold text-white sm:text-lg">{loan.bankName}</div>
                      <div className="mt-1 text-xs font-medium text-cyan-200/70">
                        {loan.loanType || 'Loan offer'}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {rows.map((row) => (
                  <tr key={row.label} className="transition-colors hover:bg-white/[0.03]">
                    <td className="sticky left-0 z-10 border-r border-white/5 bg-neutral-950/95 px-4 py-3.5 text-sm font-medium text-neutral-400 backdrop-blur-sm sm:px-5">
                      {row.label}
                    </td>
                    {loans.map((loan) => (
                      <td
                        key={`${row.label}-${loan.compareId || loan._id || loan.bankName}`}
                        className="px-4 py-3.5 text-sm leading-relaxed text-white/90 sm:px-5"
                      >
                        {row.render(loan)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoanComparison;
