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

  // Base EMI calculation
  const baseResult = useMemo(() => {
    if (!valid) return null;
    return calculateEMI(loanAmount, interestRate, tenure);
  }, [loanAmount, interestRate, tenure, valid]);

  // Schedule updates automatically when extraPayment changes
  const schedule = useMemo(() => {
    if (!valid) return [];
    return generateSchedule(
      loanAmount,
      interestRate,
      tenure,
      extraPayment
    );
  }, [loanAmount, interestRate, tenure, extraPayment, valid]);

  // Dynamic totals from updated schedule
  const dynamicStats = useMemo(() => {
    if (!schedule.length) return null;

    const totalInterest = schedule.reduce(
      (sum, row) => sum + row.interest,
      0
    );

    const totalPayment = loanAmount + totalInterest;

    const monthlyEMI = schedule[0]?.emi || baseResult?.emi || 0;

    return {
      monthlyEMI,
      totalInterest,
      totalPayment,
    };
  }, [schedule, loanAmount, baseResult]);

  if (!valid) {
    return (
      <div className="mt-4 text-red-400 text-sm">
        Invalid EMI data received.
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-3xl bg-neutral-900/60 border border-white/10 p-6">

      {/* ====== PREMIUM LAYOUT ====== */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 items-stretch">

  {/* LEFT CARD */}
  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10 rounded-3xl p-8 flex flex-col">

    <h3 className="text-sm text-neutral-400 mb-8 font-semibold">
      Loan Summary
    </h3>

    <div className="space-y-8 flex-1">

      <Metric
        label="Principal Amount"
        value={loanAmount}
        color="text-white"
      />

      <Metric
        label="Monthly EMI"
        value={dynamicStats?.monthlyEMI || baseResult?.emi || 0}
        color="text-cyan-400"
      />

      <Metric
        label="Total Interest"
        value={dynamicStats?.totalInterest || baseResult?.totalInterest || 0}
        color="text-orange-400"
      />

      <Metric
        label="Total Payment"
        value={dynamicStats?.totalPayment || baseResult?.totalPayment || 0}
        color="text-emerald-400"
      />

    </div>
  </div>

  {/* RIGHT CARD */}
  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10 rounded-3xl p-8 flex flex-col">

    <h3 className="text-sm text-neutral-400 mb-8 font-semibold">
      Loan Breakdown
    </h3>

    <div className="flex-1 flex items-center justify-center">
      <EMIPieChart
        principal={loanAmount}
        interest={
          dynamicStats?.totalInterest || baseResult?.totalInterest || 0
        }
      />
    </div>

  </div>

</div>
      {/* ===== PREPAYMENT SECTION ===== */}
      <div className="space-y-3">
        <label className="text-sm text-neutral-300">
          Extra Payment per Month (₹)
        </label>

        <div className="flex gap-3">
          <input
            type="number"
            value={extraPaymentInput}
            onChange={(e) => setExtraPaymentInput(e.target.value)}
            className="flex-1 bg-black border border-white/10 rounded-xl p-3"
            placeholder="Enter extra amount"
          />

          <button
            onClick={() =>
              setExtraPayment(Number(extraPaymentInput || 0))
            }
            className="px-6 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ===== TABLE TOGGLE ===== */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="mt-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
      >
        {showTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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

function Metric({ label, value, color }) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-white/5 last:border-none">
      <span className="text-neutral-400 text-sm tracking-wide">
        {label}
      </span>
      <span className={`text-xl font-semibold ${color}`}>
        ₹ {Number(value).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );
}