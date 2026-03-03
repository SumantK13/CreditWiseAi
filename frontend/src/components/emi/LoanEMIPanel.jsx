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
  const [mode, setMode] = useState("extra");

  const [extraPaymentInput, setExtraPaymentInput] = useState("");
  const [extraPayment, setExtraPayment] = useState(0);

  // Proper split of tenure
  const [tenureYearsInput, setTenureYearsInput] = useState(
    Math.floor(tenure)
  );

  const [tenureMonthsInput, setTenureMonthsInput] = useState(
    Math.round((tenure % 1) * 12)
  );

  const [appliedTenure, setAppliedTenure] = useState(tenure);

  const valid =
    loanAmount > 0 &&
    interestRate > 0 &&
    tenure > 0 &&
    interestRate < 50;

  const baseResult = useMemo(() => {
    if (!valid) return null;
    return calculateEMI(loanAmount, interestRate, tenure);
  }, [loanAmount, interestRate, tenure, valid]);

  const schedule = useMemo(() => {
    if (!valid) return [];

    if (mode === "extra") {
      return generateSchedule(
        loanAmount,
        interestRate,
        tenure,
        extraPayment
      );
    }

    if (mode === "tenure") {
      return generateSchedule(
        loanAmount,
        interestRate,
        appliedTenure,
        0
      );
    }

    return [];
  }, [
    loanAmount,
    interestRate,
    tenure,
    appliedTenure,
    extraPayment,
    mode,
    valid,
  ]);

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
      months: schedule.length,
    };
  }, [schedule, loanAmount, baseResult]);

  const interestSaved =
    (baseResult?.totalInterest || 0) -
    (dynamicStats?.totalInterest || 0);

  const monthsSaved =
    (baseResult?.months || 0) -
    (dynamicStats?.months || 0);

  if (!valid) {
    return (
      <div className="mt-4 text-red-400 text-sm">
        Invalid EMI data received.
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-3xl bg-neutral-900/60 border border-white/10 p-6">

      {/* SUMMARY + PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

        {/* LEFT */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
          <h3 className="text-sm text-neutral-400 mb-6 font-semibold">
            Loan Summary
          </h3>

          <Metric label="Principal Amount" value={loanAmount} color="text-white" />
          <Metric label="Monthly EMI" value={dynamicStats?.monthlyEMI || baseResult?.emi || 0} color="text-cyan-400" />
          <Metric label="Total Interest" value={dynamicStats?.totalInterest || baseResult?.totalInterest || 0} color="text-orange-400" />
          <Metric label="Total Payment" value={dynamicStats?.totalPayment || baseResult?.totalPayment || 0} color="text-emerald-400" />

          {/* Savings / Warning */}
          {dynamicStats && (
            <>
              {interestSaved > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-sm text-emerald-400 font-semibold">
                    🎉 You Save ₹ {interestSaved.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Loan closes {monthsSaved} months earlier
                  </div>
                </div>
              )}

              {monthsSaved < 0 && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-sm text-red-400 font-semibold">
                    ⚠ Loan Duration Increased
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    You will pay ₹ {Math.abs(interestSaved).toLocaleString()} more interest
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
          <h3 className="text-sm text-neutral-400 mb-6 font-semibold">
            Loan Breakdown
          </h3>

          <div className="flex items-center justify-center">
            <EMIPieChart
              principal={loanAmount}
              interest={
                dynamicStats?.totalInterest ||
                baseResult?.totalInterest ||
                0
              }
            />
          </div>
        </div>
      </div>

      {/* STRATEGY */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm text-neutral-400 font-semibold">
          Choose Your Repayment Plan
        </h3>

        <div className="flex gap-4">
          <button
            onClick={() => setMode("extra")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              mode === "extra"
                ? "bg-cyan-500 text-black"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Pay Off Faster
          </button>

          <button
            onClick={() => setMode("tenure")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              mode === "tenure"
                ? "bg-cyan-500 text-black"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Adjust Loan Duration
          </button>
        </div>
      </div>

      {/* EXTRA PAYMENT */}
      {mode === "extra" && (
        <div className="flex gap-3 mb-6">
          <input
  type="number"
  value={extraPaymentInput}
  onChange={(e) => setExtraPaymentInput(e.target.value)}
  placeholder="Enter extra amount"
  className="flex-1 bg-neutral-900 border border-white/10 
             rounded-xl p-3 text-white 
             appearance-none outline-none
             [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none"
/>
          <button
            onClick={() =>
              setExtraPayment(Number(extraPaymentInput || 0))
            }
            className="px-6 rounded-xl bg-cyan-500 text-black font-semibold"
          >
            Apply
          </button>
        </div>
      )}

      {/* TENURE */}
      {mode === "tenure" && (
        <div className="flex gap-4 mb-6 items-end">

          {/* Years */}
          <div className="flex-1">
            <label className="text-xs text-neutral-400 mb-2 block">
              Years
            </label>
            <input
  type="number"
  min="0"
  value={tenureYearsInput === 0 ? "" : tenureYearsInput}
  onChange={(e) =>
    setTenureYearsInput(
      e.target.value === ""
        ? 0
        : Math.max(0, Number(e.target.value))
    )
  }
  placeholder="Enter years"
  className="w-full bg-neutral-900 border border-white/10 
             rounded-xl p-3 text-white outline-none 
             focus:border-cyan-500
             appearance-none
             [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none"
/>
          </div>

          {/* Months */}
          <div className="flex-1">
            <label className="text-xs text-neutral-400 mb-2 block">
              Months
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={tenureMonthsInput === 0 ? "" : tenureMonthsInput}
              onChange={(e) =>
                setTenureMonthsInput(
                  e.target.value === ""
                    ? 0
                    : Math.min(12, Math.max(1, Number(e.target.value)))
                )
              }
              placeholder="1 - 12"
              className="w-full bg-neutral-900 border border-white/10 
           rounded-xl p-3 text-white outline-none 
           focus:border-cyan-500
           appearance-none
           [&::-webkit-inner-spin-button]:appearance-none
           [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={() =>
              setAppliedTenure(
                tenureYearsInput + tenureMonthsInput / 12
              )
            }
            className="px-6 h-[46px] rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Apply
          </button>
        </div>
      )}

      {/* TABLE TOGGLE */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="mt-6 flex items-center gap-2 text-cyan-400"
      >
        {showTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showTable ? "Hide Schedule" : "View Schedule"}
      </button>

      {showTable && (
        <div className="mt-6 overflow-x-auto">
          <AmortizationTable schedule={schedule} />
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-none">
      <span className="text-neutral-400 text-sm">{label}</span>
      <span className={`text-lg font-semibold ${color}`}>
        ₹{" "}
        {Number(value).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );
}