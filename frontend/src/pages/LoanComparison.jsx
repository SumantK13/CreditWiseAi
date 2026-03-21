import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

  const getTenureValue = (loan) => loan.tenureRange || `${inputs.tenureYears} years`|| 'N/A';
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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 text-center">
          <h1 className="text-3xl font-bold mb-3">Loan Comparison</h1>
          <p className="text-neutral-400 mb-8">
            Select at least 2 loans from the dashboard to compare them side-by-side.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-5 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Results
        </button>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Loan Comparison</h1>
          <p className="text-neutral-400 mt-2">
            Compare key metrics for your selected loans.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900/50 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-950/70">
              <tr className="text-left border-b border-white/10">
                <th className="px-5 py-4 text-xs tracking-wider uppercase text-neutral-400 min-w-[220px]">
                  Metric
                </th>
                {loans.map((loan) => (
                  <th key={loan.compareId || loan._id || loan.bankName} className="px-5 py-4 min-w-[220px]">
                    <div className="text-lg font-semibold">{loan.bankName}</div>
                    <div className="text-xs text-neutral-400 mt-1">{loan.loanType || 'Loan Offer'}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-5 py-4 text-sm text-neutral-300 font-medium">
                    {row.label}
                  </td>
                  {loans.map((loan) => (
                    <td
                      key={`${row.label}-${loan.compareId || loan._id || loan.bankName}`}
                      className="px-5 py-4 text-sm text-white/95"
                    >
                      {row.render(loan)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default LoanComparison;
