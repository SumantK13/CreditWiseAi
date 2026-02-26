// src/components/emi/LoanEMIPanel.jsx

import React, { useMemo, useState } from "react";
import EMIPieChart from "./EMIPieChart";
import AmortizationTable from "./AmortizationTable";
import { calculateEMI, generateSchedule } from "./emiUtils";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function LoanEMIPanel({
  loanAmount,
  interestRate,
  tenure,
}) {
  const [showTable, setShowTable] = useState(false);
  const [extraPaymentInput, setExtraPaymentInput] = useState("");
  const [extraPayment, setExtraPayment] = useState(0);

  const valid =
    loanAmount > 0 &&
    interestRate > 0 &&
    tenure > 0 &&
    interestRate < 50;

  const result = useMemo(() => {
    if (!valid) return null;
    return calculateEMI(loanAmount, interestRate, tenure);
  }, [loanAmount, interestRate, tenure]);

  const schedule = useMemo(() => {
    if (!valid) return [];
    return generateSchedule(
      loanAmount,
      interestRate,
      tenure,
      extraPayment
    );
  }, [loanAmount, interestRate, tenure, extraPayment]);
  // NEW: derive totals from updated schedule
const dynamicTotals = useMemo(() => {
  if (!schedule.length) return null;

  const totalPayment = schedule.reduce(
    (sum, row) => sum + row.emi,
    0
  );

  const totalInterest = totalPayment - loanAmount;

  return {
    totalPayment,
    totalInterest,
  };
}, [schedule, loanAmount]);
  const updatedTotals = useMemo(() => {
  if (!schedule.length) return null;

  const totalInterest = schedule.reduce(
    (sum, row) => sum + row.interest,
    0
  );

  const totalPayment = loanAmount + totalInterest;

  return {
    totalInterest,
    totalPayment,
  };
}, [schedule, loanAmount]);

  // PREMIUM ANALYTICS
  const newTenure = schedule.length;
  const interestPaid = schedule.reduce((a, b) => a + b.interest, 0);
  const interestSaved = result.totalInterest - interestPaid;

  if (!valid) {
    return <div className="mt-4 text-red-400">Invalid EMI data</div>;
  }

  return (
    <div className="mt-6 rounded-3xl bg-neutral-900/60 border border-white/10 p-6">

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Monthly EMI" value={result.emi} color="text-cyan-400"/>
       <Card
  title="Total Interest"
  value={dynamicTotals?.totalInterest || result.totalInterest}
  color="text-orange-400"
/>

<Card
  title="Total Payment"
  value={dynamicTotals?.totalPayment || result.totalPayment}
  color="text-white"
/>
      </div>

    <EMIPieChart
  principal={loanAmount}
  interest={dynamicTotals?.totalInterest || result.totalInterest}
/>

      {/* PREPAYMENT */}
      <div className="mt-6 space-y-3">
        <label className="text-sm text-neutral-300">
          Extra Payment per Month (₹)
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            value={extraPaymentInput}
            onChange={(e) => setExtraPaymentInput(e.target.value)}
            className="flex-1 bg-black border border-white/10 rounded-xl p-3"
            placeholder="Enter extra amount"
          />

          <button
            onClick={() => setExtraPayment(Number(extraPaymentInput || 0))}
            className="px-5 rounded-xl bg-cyan-500 text-black font-semibold"
          >
            Apply
          </button>
        </div>

        {/* PREMIUM ANALYTICS */}
        {extraPayment > 0 && (
          <div className="text-sm bg-white/5 border border-white/10 p-3 rounded-xl">
            <div>New Tenure: <span className="text-cyan-400">{newTenure} months</span></div>
            <div>Interest Saved: <span className="text-emerald-400">₹ {interestSaved.toFixed(0)}</span></div>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowTable(!showTable)}
        className="mt-6 flex items-center gap-2 text-cyan-400"
      >
        {showTable ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        {showTable ? "Hide Amortization Schedule" : "View Amortization Schedule"}
      </button>

      {showTable && (
        <div className="mt-4">
          <AmortizationTable schedule={schedule} />
        </div>
      )}
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
      <div className="text-xs text-neutral-400">{title}</div>
      <div className={`text-xl font-bold ${color}`}>
        ₹ {value.toFixed(0)}
      </div>
    </div>
  );
}