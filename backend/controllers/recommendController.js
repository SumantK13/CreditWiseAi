import axios from 'axios';
import BankLoan from '../models/BankLoan.js';

export const getLoanRecommendations = async (req, res) => {
    try {
        // 1. SAFE INPUT EXTRACTION
        const monthlyIncome = req.body.monthlyIncome || req.body.monthly_income;
        const currentEMIs = req.body.currentEMIs || req.body.current_emis || 0;
        const employmentType = req.body.employmentType || req.body.employment_type;
        const creditScore = req.body.creditScore || req.body.credit_score;
        const loanAmount = req.body.loanAmount || req.body.loan_amount;
        const tenureYears = req.body.tenureYears || req.body.tenure_years;
        const age = req.body.age || 30; // Default

        // Check if critical data is missing
        if (!monthlyIncome || !loanAmount || !tenureYears) {
             return res.status(400).json({ 
                 message: "Missing required fields: monthlyIncome, loanAmount, or tenureYears" 
             });
        }

        // 2. FETCH LIVE BANK DATA
        const allLoans = await BankLoan.find({});
        
        // 3. PROCESS EACH BANK (Parallel AI Calls)
        const analyzedLoans = await Promise.all(allLoans.map(async (loan) => {
            
            // --- A. DATA CLEANING (The Fix) ---
            // Fix "Processing Fee" which might be "3.00%" or "₹ 4,999"
            let feeValue = 1.0; // Default fallback (1%)
            
            if (loan.processingFee) {
                // 1. Convert to string and remove everything except numbers and dots
                // "Up to 3.00%" -> "3.00"
                // "₹ 4,999" -> "4999"
                const cleanedFee = loan.processingFee.toString().replace(/[^0-9.]/g, '');
                const parsed = parseFloat(cleanedFee);
                
                if (!isNaN(parsed)) {
                    feeValue = parsed;
                    
                    // 2. Normalize logic: 
                    // If fee is > 100, it's likely a Rupee amount (e.g. 4999), not a percentage.
                    // The AI expects a percentage (0-5). Let's treat fixed fees as ~2% for the model.
                    if (feeValue > 100) {
                        feeValue = 2.0; 
                    }
                }
            }

            // --- B. Calculate Physics (EMI & FOIR) ---
            const r = loan.interestRate / 12 / 100;
            const n = tenureYears * 12;
            let emi = 0;
            if (r > 0) {
                emi = Math.round(loanAmount * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
            } else {
                emi = Math.round(loanAmount / n);
            }

            const totalMonthlyObligation = currentEMIs + emi;
            const foir = (totalMonthlyObligation / monthlyIncome) * 100;

            // --- C. CALL PYTHON MODEL ---
            let approvalProbability = 0;
            try {
                const mlResponse = await axios.post('http://localhost:5001/predict', {
                    // User Details
                    monthly_income: monthlyIncome,
                    current_emis: currentEMIs,
                    employment_type: employmentType,
                    credit_score: creditScore,
                    loan_amount: loanAmount,
                    tenure_years: tenureYears,
                    age: age, 
                    
                    // Bank Specifics (Using the CLEANED feeValue)
                    bank_interest_rate: loan.interestRate,
                    processing_fee: feeValue,     // <--- Sending the clean number
                    min_tenure: loan.minTenure || 1,
                    max_tenure: loan.maxTenure || 30
                });
                
                approvalProbability = mlResponse.data.approval_probability;

            } catch (mlError) {
                // Improved Error Logging: Prints the REAL reason from Python
                const reason = mlError.response ? JSON.stringify(mlError.response.data) : mlError.message;
                console.error(`⚠️ ML Fail for ${loan.bankName}:`, reason);
                approvalProbability = 0; 
            }

            // --- D. Determine Status ---
            let status = "Eligible";
            let reason = "";

            if (approvalProbability < 30) {
                status = "Not Eligible";
                reason = "High Risk / Criteria Mismatch";
            } 
            else if (approvalProbability < 65) {
                status = "Hard to get";
                reason = "Low Approval Chance";
            }
            
            // Safety Guard: If Debt > 65% of income, force reject
            if (foir > 65) {
                status = "Not Eligible";
                reason = `Debt too high (${foir.toFixed(1)}%)`;
                approvalProbability = 10; 
            }

            return {
                _id: loan._id,
                bankName: loan.bankName,
                interestRate: loan.interestRate,
                processingFee: loan.processingFee, // Send original string to Frontend for display
                link: loan.link,
                monthlyEMI: emi,
                totalAmountPayable: emi * n,
                foir: Math.round(foir),
                approvalProbability: approvalProbability,
                status: status,
                rejectionReason: reason,
                features: loan.features
            };
        }));

        // 4. SORT RESULTS
        analyzedLoans.sort((a, b) => {
            // Priority 1: Eligible first
            if (a.status === "Eligible" && b.status !== "Eligible") return -1;
            if (a.status !== "Eligible" && b.status === "Eligible") return 1;
            
            // Priority 2: Higher Probability is better
            if (b.approvalProbability !== a.approvalProbability) {
                return b.approvalProbability - a.approvalProbability;
            }
            
            // Priority 3: Lower Interest Rate is better
            return a.interestRate - b.interestRate;
        });

        // 5. SEND RESPONSE
        res.status(200).json(analyzedLoans);

    } catch (error) {
        console.error("Server Error in recommendController:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};