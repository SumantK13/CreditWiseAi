import React, { useMemo, useState } from "react";
import EMIPieChart from "./EMIPieChart";
import AmortizationTable from "./AmortizationTable";
import { calculateEMI, generateSchedule } from "./emiUtils";
import { ChevronDown, ChevronUp, AlertTriangle, IndianRupee, TrendingUp, CalendarClock, Settings2, Sparkles, Zap } from "lucide-react";

export default function LoanEMIPanel({
  loanAmount,
  interestRate,
  tenure,
}) {
  const [showTable, setShowTable] = useState(false);
  const [mode, setMode] = useState("extra");

  // Removed the separate "Input" states to allow for REAL-TIME updates
  const [extraPayment, setExtraPayment] = useState(0);
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

  // Dynamic max value for the slider (either 50k or 2x their EMI, whichever is higher)
  const maxExtraPaymentSlider = Math.max(50000, Math.round((baseResult?.emi || 0) * 2));

  return (
    <div className="relative mt-6 rounded-3xl bg-black/40 border border-white/5 p-6 md:p-8 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* SUMMARY + PIE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* LEFT: Metrics */}
          <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 transition-all duration-300">
            <h3 className="text-sm text-neutral-400 mb-6 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} className="text-cyan-400" /> Loan Summary
            </h3>

            <div className="space-y-2">
              <Metric icon={IndianRupee} label="Principal Amount" value={loanAmount} color="text-white" />
              <Metric 
                icon={CalendarClock} 
                label={mode === 'extra' && extraPayment > 0 ? "New Total Monthly Outflow" : "Monthly EMI"} 
                value={mode === 'extra' ? (baseResult?.emi || 0) + extraPayment : (dynamicStats?.monthlyEMI || baseResult?.emi || 0)} 
                color="text-cyan-400" 
              />
              <Metric icon={TrendingUp} label="Total Interest" value={dynamicStats?.totalInterest || baseResult?.totalInterest || 0} color="text-purple-400" />
              <Metric icon={IndianRupee} label="Total Payment" value={dynamicStats?.totalPayment || baseResult?.totalPayment || 0} color="text-emerald-400" />
            </div>

            {hasAdjustments && dynamicStats && (
              <div className="mt-6">
                {interestSaved > 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] transform transition-all duration-300 scale-100">
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
            <div className="w-full mt-4 transition-all duration-500">
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
            <h3 className="text-sm text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" /> Interactive Optimizer
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

          {/* EXTRA PAYMENT INTERACTIVE CONTROLS */}
          {mode === "extra" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                  <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="number"
                    value={extraPayment || ""}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    placeholder="Additional monthly payment"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-lg font-bold focus:outline-none focus:border-cyan-500/50 transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                
                {/* Quick-Tap Chips */}
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                  {[1000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setExtraPayment((prev) => prev + amount)}
                      className="whitespace-nowrap px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold"
                    >
                      +₹{amount.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => setExtraPayment(0)}
                    className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-neutral-500">
                  <span>₹0</span>
                  <span className="text-cyan-400">Drag to visualize savings</span>
                  <span>₹{maxExtraPaymentSlider.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxExtraPaymentSlider}
                  step="500"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TENURE INTERACTIVE CONTROLS */}
          {mode === "tenure" && (
            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row gap-4 items-center">
                 <div className="w-full sm:w-1/2 text-center sm:text-left">
                   <div className="text-neutral-400 text-sm font-semibold mb-1">Target Loan Duration</div>
                   <div className="text-3xl font-bold text-white">
                      {Math.floor(appliedTenure)} <span className="text-lg text-neutral-500">Yrs</span>{" "}
                      {Math.round((appliedTenure % 1) * 12)} <span className="text-lg text-neutral-500">Mos</span>
                   </div>
                 </div>

                 <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar justify-end">
                    <button onClick={() => setAppliedTenure(Math.max(1, appliedTenure - 1))} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition-colors text-sm font-semibold">
                      -1 Year
                    </button>
                    <button onClick={() => setAppliedTenure(tenure)} className="px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm font-semibold">
                      Original ({tenure}Y)
                    </button>
                    <button onClick={() => setAppliedTenure(appliedTenure + 1)} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition-colors text-sm font-semibold">
                      +1 Year
                    </button>
                 </div>
               </div>

               {/* Slider */}
               <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-neutral-500">
                  <span>1 Year</span>
                  <span className="text-cyan-400">Slide to adjust duration</span>
                  <span>30 Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={Math.max(30, tenure)} // Cap max slider to 30 years or original
                  step="0.5"
                  value={appliedTenure}
                  onChange={(e) => setAppliedTenure(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
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
      <span className={`text-lg font-bold ${color} transition-all duration-300`}>
        ₹ {Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
    </div>
  );
}