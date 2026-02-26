// src/components/emi/emiUtils.js

export const calculateEMI = (P, annualRate, years) => {
  const r = annualRate / 12 / 100;
  const n = years * 12;

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

export function generateSchedule(
  principal,
  annualRate,
  years,
  extraPayment = 0
) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  const emi = calculateEMI(principal, annualRate, years).emi;

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= months && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let principalPaid = emi - interest + extraPayment;

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance -= principalPaid;

    schedule.push({
      month,
      emi: emi + extraPayment,
      principal: principalPaid,
      interest,
      balance: balance < 0 ? 0 : balance,
    });
  }

  return schedule;
};