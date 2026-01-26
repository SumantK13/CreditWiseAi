import mongoose from 'mongoose';

const BankLoanSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true
    },
    loanType: {
        type: String,
        required: true
    },
    interestRate: {
        type: Number, 
        required: true
    },
    processingFee: {
        type: String 
    },
    tenureRange: {
        type: String 
    },
    features: [String], 
    link: {
        type: String,
        required: true 
    }
});

const BankLoan = mongoose.model('BankLoan', BankLoanSchema);
export default BankLoan;