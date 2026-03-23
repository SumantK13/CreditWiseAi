import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Banknote,
  Percent,
  ChevronRight,
  Filter,
  ArrowUpDown,
  GitCompare,
  ShieldCheck,
  Activity,
  Wallet,
  Sparkles,
} from "lucide-react";
import LoanEMIPanel from "@/components/emi/LoanEMIPanel";

const Dashboard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(
    state?.results ? { results: state.results, inputs: state.inputs } : null,
  );
  const [loading, setLoading] = useState(!state?.results);
  const [error, setError] = useState("");

  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("probability");
  const [openEmi, setOpenEmi] = useState(null);
  const [compareIndices, setCompareIndices] = useState([]);

  useEffect(() => {
    if (state?.results) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchLastAnalysis = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_URL}/recommend/last`, {
          headers: { "x-auth-token": token },
        });
        setData({ results: res.data.results, inputs: res.data.inputs });
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(
            "Failed to load your last analysis. You may need to run a new check.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLastAnalysis();
  }, [state]);

  // --- FILTER & SORT LOGIC (MOVED ABOVE EARLY RETURNS!) ---
  const filteredAndSortedLoans = useMemo(() => {
    if (!data?.results) return []; // Safely return empty if no data yet

    let processed = data.results.filter((loan) => {
      if (selectedType === "all") return true;
      if (!loan.loanType && selectedType === "personal") return true;
      return (loan.loanType || "").toLowerCase().includes(selectedType);
    });

    processed.sort((a, b) => {
      if (sortBy === "rate") return a.interestRate - b.interestRate;
      if (sortBy === "emi") return a.monthlyEMI - b.monthlyEMI;
      return b.approvalProbability - a.approvalProbability; // default
    });

    return processed;
  }, [data, selectedType, sortBy]);

  // --- EARLY RETURNS ---
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <Navbar />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="mt-24 text-center z-10">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Decrypting Lenders...</h2>
          <p className="text-neutral-400 text-sm">
            Retrieving your AI eligibility scan.
          </p>
        </div>
      </div>
    );
  }

  if (!data?.results) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <Navbar />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div className="z-10 text-center">
          <h2 className="text-3xl font-bold mb-4">No analysis data found</h2>
          {error && <p className="text-red-400 mb-6 text-sm">{error}</p>}
          <Link
            to="/check-eligibility"
            className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            Start AI Check <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const { results: loans, inputs } = data;

  // --- COMPARE LOGIC ---
  const loanIndexKey = (loan) => loans.indexOf(loan);
  const toggleCompareLoan = (loan) => {
    const idx = loanIndexKey(loan);
    if (idx < 0) return;
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
    navigate("/loan-comparison", {
      state: {
        loans: selectedForCompare.map((loan, i) => ({
          ...loan,
          compareId: compareIndices[i],
        })),
        inputs,
      },
    });
  };

  const filterOptions = [
    { id: "all", label: "All Loans" },
    { id: "home", label: "Home Loan" },
    { id: "car", label: "Car Loan" },
    { id: "education", label: "Education Loan" },
    { id: "personal", label: "Personal Loan" },
  ];

  // --- STYLING HELPERS ---
  const getStatusStyle = (prob) => {
    if (prob >= 80)
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        glow: "shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      };
    if (prob >= 50)
      return {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
        glow: "shadow-[0_0_10px_rgba(234,179,8,0.2)]",
      };
    return {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      glow: "shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    };
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* VIBE: Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* HEADER SECTION */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/check-eligibility")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 text-sm group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Edit Profile
          </button>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-medium mb-4">
                <Sparkles size={14} /> AI Analysis Complete
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  Matches.
                </span>
              </h1>
              <p className="text-neutral-400 text-lg">
                We found{" "}
                <span className="text-white font-bold">
                  {filteredAndSortedLoans.length}
                </span>{" "}
                tailored options.
              </p>
            </div>

            {/* Quick Stats Panel */}
            <div className="flex bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-xl">
              <div className="px-6 py-3">
                <span className="text-neutral-500 text-xs uppercase tracking-widest font-semibold block mb-1">
                  Required Loan
                </span>
                <span className="text-2xl font-bold text-white">
                  ₹ {(inputs.loanAmount / 100000).toFixed(2)}L
                </span>
              </div>
              <div className="w-[1px] bg-white/10 my-2"></div>
              <div className="px-6 py-3">
                <span className="text-neutral-500 text-xs uppercase tracking-widest font-semibold block mb-1">
                  Tenure
                </span>
                <span className="text-2xl font-bold text-white">
                  {inputs.tenureYears} Yrs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS TOOLBAR */}
        <div className="sticky top-20 z-30 mb-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <Filter size={16} className="text-neutral-500 shrink-0 mx-2" />
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedType(opt.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === opt.id
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 md:border-l border-white/10 md:pl-4">
            <ArrowUpDown size={16} className="text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="probability" className="bg-neutral-900">
                Highest Approval
              </option>
              <option value="rate" className="bg-neutral-900">
                Lowest Interest
              </option>
              <option value="emi" className="bg-neutral-900">
                Lowest EMI
              </option>
            </select>
          </div>
        </div>

        {/* COMPARE BANNER */}
        <AnimatePresence>
          {selectedForCompare.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                    <GitCompare className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Compare Lenders</h3>
                    <p className="text-sm text-neutral-400">
                      {selectedForCompare.length} of 4 selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={goToCompare}
                  disabled={selectedForCompare.length < 2}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  View Comparison <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS GRID */}
        <div className="grid grid-cols-1 gap-6">
          {filteredAndSortedLoans.length === 0 ? (
            <div className="py-20 text-center bg-neutral-900/20 border border-white/5 rounded-3xl backdrop-blur-sm">
              <Filter className="mx-auto mb-4 text-neutral-600" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">
                No matches found
              </h3>
              <p className="text-neutral-400">
                Try adjusting your filters to see more options.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredAndSortedLoans.map((loan, index) => {
                const idx = loanIndexKey(loan);
                const compareChecked = compareIndices.includes(idx);
                const compareDisabled =
                  compareIndices.length >= 4 && !compareChecked;
                const statusStyle = getStatusStyle(loan.approvalProbability);

                return (
                  <motion.div
                    key={loan._id || index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`group relative overflow-hidden rounded-3xl border p-6 md:p-8 backdrop-blur-md transition-all duration-300 ${
                      compareChecked
                        ? "bg-neutral-900/80 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                        : "bg-neutral-900/40 border-white/10 hover:border-cyan-500/30 hover:bg-neutral-900/60"
                    }`}
                  >
                    {/* TOP BAR: Header & Status */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white tracking-tight">
                            {loan.bankName}
                          </h3>
                          {loan.loanType && (
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                              {loan.loanType}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text} ${statusStyle.glow} flex items-center gap-1.5`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`}
                            ></div>
                            {loan.status}
                          </span>
                          {loan.rejectionReason && (
                            <span className="text-red-400 text-xs flex items-center gap-1 font-medium bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                              <AlertTriangle size={12} /> {loan.rejectionReason}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCompareLoan(loan)}
                        disabled={compareDisabled}
                        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          compareChecked
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                            : "bg-black/50 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                        } disabled:opacity-50`}
                      >
                        <GitCompare size={14} />
                        {compareChecked ? "Added to Compare" : "Compare"}
                      </button>
                    </div>

                    {/* MIDDLE: Data Grid & Probability */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-8">
                      {/* The 2x2 Data Grid */}
                      <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                          <div className="flex items-center gap-1.5 text-neutral-400 text-xs uppercase tracking-wider font-semibold mb-2">
                            <Percent size={14} className="text-cyan-400" />{" "}
                            Interest Rate
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {loan.interestRate}%
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                          <div className="flex items-center gap-1.5 text-neutral-400 text-xs uppercase tracking-wider font-semibold mb-2">
                            <Banknote size={14} className="text-emerald-400" />{" "}
                            Monthly EMI
                          </div>
                          <div className="text-2xl font-bold text-white">
                            ₹ {loan.monthlyEMI?.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                          <div className="flex items-center gap-1.5 text-neutral-400 text-xs uppercase tracking-wider font-semibold mb-2">
                            <Activity
                              size={14}
                              className={
                                loan.foir > 50
                                  ? "text-red-400"
                                  : "text-purple-400"
                              }
                            />{" "}
                            FOIR Impact
                          </div>
                          <div className="text-xl font-bold text-white">
                            {loan.foir}%{" "}
                            <span className="text-sm font-normal text-neutral-500">
                              of income
                            </span>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                          <div className="flex items-center gap-1.5 text-neutral-400 text-xs uppercase tracking-wider font-semibold mb-2">
                            <Wallet size={14} className="text-yellow-400" />{" "}
                            Total Payable
                          </div>
                          <div className="text-xl font-bold text-white">
                            ₹ {(loan.totalAmountPayable / 100000).toFixed(2)}L
                          </div>
                        </div>
                      </div>

                      {/* AI Probability Gauge */}
                      <div className="w-full lg:w-72 bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-end mb-3 relative z-10">
                          <span className="text-neutral-400 font-medium text-sm">
                            Approval Odds
                          </span>
                          <span className="text-3xl font-bold text-white">
                            {loan.approvalProbability.toFixed(0)}
                            <span className="text-lg text-neutral-500">%</span>
                          </span>
                        </div>
                        <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden relative z-10 border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${loan.approvalProbability}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500`}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-3 text-right">
                          Based on AI Risk Engine
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM: Features, Fees, Actions */}
                    <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1 space-y-3">
                        {/* Features Tags */}
                        {loan.features && loan.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {loan.features.map((feature, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 text-neutral-300 text-xs border border-white/5"
                              >
                                <ShieldCheck
                                  size={12}
                                  className="text-cyan-500"
                                />{" "}
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Processing Fee */}
                        <div className="text-sm text-neutral-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                          Processing Fee:{" "}
                          <span className="text-white font-medium">
                            {loan.processingFee || "Standard"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          onClick={() =>
                            setOpenEmi(openEmi === index ? null : index)
                          }
                          className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors text-sm"
                        >
                          {openEmi === index ? "Hide EMI" : "EMI Details"}
                        </button>
                        <div className="w-full md:w-auto flex justify-end">
                          {loan.bankName ? (
                            <a
                              // Dynamically generate the search query
                              href={`https://www.google.com/search?q=${encodeURIComponent(`${loan.bankName} ${loan.loanType || "Loan"} apply online official website`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                              Apply Officially <ChevronRight size={16} />
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
                    </div>

                    {/* EMI Dropdown Panel */}
                    <AnimatePresence>
                      {openEmi === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-6 border-t border-white/5">
                            <LoanEMIPanel
                              loanAmount={inputs.loanAmount}
                              interestRate={loan.interestRate}
                              tenure={inputs.tenureYears}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
