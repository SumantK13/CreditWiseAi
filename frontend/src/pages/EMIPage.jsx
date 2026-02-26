import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoanEMIPanel from "@/components/emi/LoanEMIPanel";
import { ArrowLeft } from "lucide-react";

export default function EMIPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // receive data from dashboard
  const loan = state?.loan;
  const inputs = state?.inputs;

  if (!loan || !inputs) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Invalid EMI Data
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      {/* HEADER */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        EMI Analytics — {loan.bankName}
      </h1>

      {/* PREMIUM EMI PANEL */}
      <LoanEMIPanel
        loanAmount={inputs.loanAmount}
        interestRate={loan.interestRate}
        tenure={inputs.tenureYears}
      />
    </div>
  );
}