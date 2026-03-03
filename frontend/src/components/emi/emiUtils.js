// src/components/emi/emiUtils.js

// =============================
// EMI CALCULATION
// =============================
export const calculateEMI = (P, annualRate, years) => {
  const r = annualRate / 12 / 100;
  const n = years * 12;

  // Handle zero interest safely
  if (r === 0) {
    const emi = P / n;
    return {
      emi,
      totalPayment: P,
      totalInterest: 0,
      months: n,
    };
  }

  const emi =
    (P * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  return {
    emi,
    totalPayment,
    totalInterest,
    months: n,
  };
};

// =============================
// AMORTIZATION SCHEDULE
// Supports:
// - Extra monthly payment (reduces tenure)
// - Custom tenure (EMI recalculated outside)
// =============================
export function generateSchedule(
  principal,
  annualRate,
  years,
  extraPayment = 0
) {
  const monthlyRate = annualRate / 12 / 100;
  const baseEMI = calculateEMI(principal, annualRate, years).emi;

  let balance = principal;
  let month = 1;

  const schedule = [];

  // Safety cap to avoid infinite loop
  const maxMonths = years * 12 + 120;

  while (balance > 0 && month <= maxMonths) {
    const interest = balance * monthlyRate;

    let principalPaid = baseEMI - interest;

    // Add extra payment only in extra mode
    if (extraPayment > 0) {
      principalPaid += extraPayment;
    }

    // Prevent overpayment
    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance -= principalPaid;

    schedule.push({
      month,
      emi: baseEMI + (extraPayment > 0 ? extraPayment : 0),
      principal: principalPaid,
      interest,
      balance: balance > 0 ? balance : 0,
    });

    month++;
  }

  return schedule;
}