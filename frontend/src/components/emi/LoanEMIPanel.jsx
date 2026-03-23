import React, { useMemo, useState } from "react";
import EMIPieChart from "./EMIPieChart";
import AmortizationTable from "./AmortizationTable";
import { calculateEMI, generateSchedule } from "./emiUtils";
import { ChevronDown, ChevronUp, AlertTriangle, IndianRupee, TrendingUp, CalendarClock, Settings2, Sparkles } from "lucide-react";

export default function LoanEMIPanel({
  loanAmount,
  interestRate,
  tenure,
}) {
  const [showTable, setShowTable] = useState(false);
  const [mode, setMode] = useState("extra");

  const [extraPaymentInput, setExtraPaymentInput] = useState("");
  const [extraPayment, setExtraPayment] = useState(0);

  const [tenureYearsInput, setTenureYearsInput] = useState(Math.floor(tenure));
  const [tenureMonthsInput, setTenureMonthsInput] = useState(Math.round((tenure % 1) * 12));
  const [appliedTenure, setAppliedTenure] = useState(tenure);

  const valid = loanAmount > 0 && interestRate > 0 && tenure > 0 && interestRate < 50;

  const baseResult = useMemo(() => {
    if (!valid) return null;
    return calculateEMI(loanAmount, interestRate, tenure);
  }, [loanAmount, interestRate, tenure, valid]);

  const schedule = useMemo(() => {
    if (!valid) return [];
    if (mode === "extra") return generateSchedule(loanAmount, interestRate, tenure, extraPayment);
    if (mode === "tenure") return generateSchedule(loanAmount, interestRate, appliedTenure, 0);
    return [];
  }, [loanAmount, interestRate, tenure, appliedTenure, extraPayment, mode, valid]);

  const dynamicStats = useMemo(() => {
    if (!schedule.length) return null;
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
    const totalPayment = loanAmount + totalInterest;
    const monthlyEMI = schedule[0]?.emi || baseResult?.emi || 0;
    return { monthlyEMI, totalInterest, totalPayment, months: schedule.length };
  }, [schedule, loanAmount, baseResult]);

  const interestSaved = Math.round((baseResult?.totalInterest || 0) - (dynamicStats?.totalInterest || 0));
  const monthsSaved = Math.round((baseResult?.months || 0) - (dynamicStats?.months || 0));

  const hasAdjustments = (mode === "extra" && extraPayment > 0) || (mode === "tenure" && appliedTenure !== tenure);

  if (!valid) {
    return <div className="mt-4 text-red-400 text-sm">Invalid EMI data received.</div>;
  }

  return (
    <div className="relative mt-6 rounded-3xl bg-black/40 border border-white/5 p-6 md:p-8 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* SUMMARY + PIE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* LEFT: Metrics */}
          <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm text-neutral-400 mb-6 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} className="text-cyan-400" /> Loan Summary
            </h3>

            <div className="space-y-2">
              <Metric icon={IndianRupee} label="Principal Amount" value={loanAmount} color="text-white" />
              <Metric icon={CalendarClock} label="Monthly EMI" value={dynamicStats?.monthlyEMI || baseResult?.emi || 0} color="text-cyan-400" />
              <Metric icon={TrendingUp} label="Total Interest" value={dynamicStats?.totalInterest || baseResult?.totalInterest || 0} color="text-purple-400" />
              <Metric icon={IndianRupee} label="Total Payment" value={dynamicStats?.totalPayment || baseResult?.totalPayment || 0} color="text-emerald-400" />
            </div>

            {hasAdjustments && dynamicStats && (
              <div className="mt-6">
                {interestSaved > 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <div className="text-sm text-emerald-400 font-bold flex items-center gap-2">
                      <Sparkles size={16} /> You Save ₹ {interestSaved.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-400/70 mt-1 font-medium">
                      Loan closes {monthsSaved} months earlier
                    </div>
                  </div>
                )}
                {monthsSaved < 0 && interestSaved < 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20">
                    <div className="text-sm text-red-400 font-bold flex items-center gap-2">
                      <AlertTriangle size={16} /> Loan Duration Increased
                    </div>
                    <div className="text-xs text-red-400/70 mt-1 font-medium">
                      You will pay ₹ {Math.abs(interestSaved).toLocaleString()} more interest
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Pie Chart */}
          <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative">
             <h3 className="text-sm text-neutral-400 font-semibold uppercase tracking-wider absolute top-6 left-6">
              Breakdown
            </h3>
            <div className="w-full mt-4">
              <EMIPieChart
                principal={loanAmount}
                interest={dynamicStats?.totalInterest || baseResult?.totalInterest || 0}
              />
            </div>
          </div>
        </div>

        {/* STRATEGY */}
        <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-sm text-neutral-400 font-semibold uppercase tracking-wider">
              Optimization Strategy
            </h3>
            
            {/* Segmented Control */}
            <div className="flex p-1 bg-black/50 border border-white/10 rounded-xl">
              <button
                onClick={() => setMode("extra")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === "extra" ? "bg-cyan-500 text-black shadow-lg" : "text-neutral-400 hover:text-white"
                }`}
              >
                Extra Payment
              </button>
              <button
                onClick={() => setMode("tenure")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === "tenure" ? "bg-cyan-500 text-black shadow-lg" : "text-neutral-400 hover:text-white"
                }`}
              >
                Adjust Tenure
              </button>
            </div>
          </div>

          {/* EXTRA PAYMENT INPUT */}
          {mode === "extra" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="number"
                  value={extraPaymentInput}
                  onChange={(e) => setExtraPaymentInput(e.target.value)}
                  placeholder="Additional monthly payment (e.g. 5000)"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={() => setExtraPayment(Number(extraPaymentInput || 0))}
                className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Apply Strategy
              </button>
            </div>
          )}

          {/* TENURE INPUT */}
          {mode === "tenure" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <div className="flex-1 relative group">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 uppercase font-bold">Yrs</span>
                  <input
                    type="number" min="0" value={tenureYearsInput === 0 ? "" : tenureYearsInput}
                    onChange={(e) => setTenureYearsInput(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                    placeholder="Years"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-cyan-500/50 transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex-1 relative group">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 uppercase font-bold">Mos</span>
                  <input
                    type="number" min="1" max="12" value={tenureMonthsInput === 0 ? "" : tenureMonthsInput}
                    onChange={(e) => setTenureMonthsInput(e.target.value === "" ? 0 : Math.min(12, Math.max(1, Number(e.target.value))))}
                    placeholder="Months"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-cyan-500/50 transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <button
                onClick={() => setAppliedTenure(tenureYearsInput + tenureMonthsInput / 12)}
                className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] sm:w-auto w-full"
              >
                Apply Strategy
              </button>
            </div>
          )}
        </div>

        {/* TABLE TOGGLE */}
        <button
          onClick={() => setShowTable(!showTable)}
          className="mt-6 mx-auto flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {showTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showTable ? "Hide Amortization Schedule" : "View Full Amortization Schedule"}
        </button>

        {showTable && (
          <div className="mt-6">
            <AmortizationTable schedule={schedule} />
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, color }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-none group">
      <span className="text-neutral-400 text-sm flex items-center gap-2">
        <Icon size={14} className="text-neutral-500 group-hover:text-white transition-colors" /> {label}
      </span>
      <span className={`text-lg font-bold ${color}`}>
        ₹ {Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
    </div>
  );
}