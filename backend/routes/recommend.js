import express from 'express';
import axios from 'axios';
import BankLoan from '../models/BankLoan.js';

const router = express.Router();

// POST /api/recommend
router.post('/', async (req, res) => {
    try {
        const { 
            monthlyIncome, 
            currentEMIs, 
            employmentType, 
            creditScore, 
            loanAmount, 
            tenureYears 
        } = req.body;


        // 1. CALL THE MODEL (Machine Learning)
        let approvalProbability = 0;
        try {
            const mlResponse = await axios.post('http://127.0.0.1:5001/predict', { // Replace 5001 with Model's address
                monthly_income: monthlyIncome,
                current_emis: currentEMIs,
                employment_type: employmentType,
                credit_score: creditScore,
                loan_amount: loanAmount,
                tenure_years: tenureYears
            });
            
            approvalProbability = mlResponse.data.approval_probability;
            console.log(`🤖 ML Engine says: ${approvalProbability}% chance`);

        } catch (mlError) {
            console.error("⚠️ ML Engine Offline:", mlError.message);
            approvalProbability = 50; // Fallback if Python crashes
        }


        // 2. FETCH LIVE BANK DATA (From Scraper)
        const allLoans = await BankLoan.find({});


        // 3. APPLY HYBRID LOGIC (Rules + AI)
        const analyzedLoans = allLoans.map(loan => {
            // A. Calculate Real EMI
            // Rate is annual, so /12/100
            const r = loan.interestRate / 12 / 100;
            const n = tenureYears * 12;
            
            let emi = 0;
            if (r > 0) {
                // Standard Banking EMI Formula
                emi = Math.round(loanAmount * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
            }

            // B. Calculate FOIR (The Safety Guardrail)
            const totalMonthlyObligation = currentEMIs + emi;
            const foir = (totalMonthlyObligation / monthlyIncome) * 100;

            // C. Determine Status
            let status = "Eligible";
            let reason = "";

            // RULE 1: Knockout Rule (Debt is too high)
            if (foir > 60) {
                status = "Not Eligible";
                reason = `High Debt (${foir.toFixed(1)}% of income)`;
            } 
            // RULE 2: AI Judgment
            else if (approvalProbability < 40) {
                status = "Not Eligible";
                reason = "Risk Profile too high (AI)";
            } 
            else if (approvalProbability < 60) {
                status = "Hard to get";
                reason = "Borderline approval chance";
            }

            return {
                _id: loan._id,
                bankName: loan.bankName,
                interestRate: loan.interestRate,
                processingFee: loan.processingFee,
                link: loan.link,
                monthlyEMI: emi,
                totalAmountPayable: emi * n,
                foir: Math.round(foir), // We send this so Frontend can show "Why"
                approvalProbability: approvalProbability,
                status: status,
                rejectionReason: reason,
                features: loan.features
            };
        });

        // 4. Sort: Eligible first, then Lowest Interest Rate
        analyzedLoans.sort((a, b) => {
            if (a.status === "Eligible" && b.status !== "Eligible") return -1;
            if (a.status !== "Eligible" && b.status === "Eligible") return 1;
            return a.interestRate - b.interestRate;
        });

        res.json(analyzedLoans);

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).send("Server Error");
    }
});

export default router;