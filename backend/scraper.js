import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BankLoan from './models/BankLoan.js'; 

dotenv.config();

const scrapeBankBazaar = async () => {
    console.log("-------------------------------------");
    console.log("🚀 Starting Scraper V2 (Fixing Names)...");
    
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected");
        
        // 1. CLEAR OLD DATA (To remove the "Messed Up" entries)
        await BankLoan.deleteMany({});
        console.log("🧹 Old data cleared.");

    } catch (err) {
        console.error("❌ DB Error:", err);
        return;
    }

    const browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: null,
        args: ['--start-maximized'] 
    });
    
    const page = await browser.newPage();
    const url = '';
    
    try {
        console.log("Navigating to BankBazaar...");
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 3000));

        // --- IMPROVED SCRAPING LOGIC ---
        const scrapedLoans = await page.evaluate(() => {
            const results = [];
            
            // Find all loan cards
            const cards = Array.from(document.querySelectorAll('div')).filter(div => 
                div.className.includes('shadow-lg') && 
                div.className.includes('border-slate-300') &&
                div.className.includes('p-3')
            );

            cards.forEach(card => {
                // FIX: Look for the h4 with 'inline' class, OR fall back to the second h4
                let bankName = "Unknown Bank";
                
                // Try finding the specific class used for names
                const nameElement = card.querySelector('h4.inline');
                
                if (nameElement) {
                    bankName = nameElement.innerText.trim();
                } else {
                    // Fallback: If there are 2 headers, take the second one (usually the name)
                    const headers = card.querySelectorAll('h4');
                    if (headers.length > 1) {
                        bankName = headers[1].innerText.trim();
                    } else if (headers.length === 1) {
                        bankName = headers[0].innerText.trim();
                    }
                }

                // Get Rates & Fees
                const dataBlocks = card.querySelectorAll('.inline-block.mr-1');
                let interestRaw = "0";
                let feeRaw = "0";

                dataBlocks.forEach(block => {
                    const label = block.innerText.toLowerCase();
                    const valueElement = block.querySelectorAll('p')[1]; 
                    const valueText = valueElement ? valueElement.innerText.trim() : "";

                    if (label.includes('fixed') || label.includes('floating')) {
                        interestRaw = valueText;
                    }
                    if (label.includes('processing fee')) {
                        feeRaw = valueText;
                    }
                });

                if (bankName !== "Unknown Bank" && interestRaw !== "0") {
                    results.push({
                        bankName,
                        interestRaw,
                        feeRaw
                    });
                }
            });

            return results;
        });

        console.log(`🎉 Found ${scrapedLoans.length} loans!`);

        // --- SAVE TO DB ---
        for (const loan of scrapedLoans) {
            let cleanRate = 0;
            const match = loan.interestRaw.match(/(\d+\.\d+)/); 
            if (match) cleanRate = parseFloat(match[0]);

            if (cleanRate === 0) continue;

            // Remove "Personal Loan" from name to keep it clean (Optional)
            // e.g. "HDFC Bank Personal Loan" -> "HDFC Bank"
            const cleanName = loan.bankName.replace(/Personal Loan/i, '').trim();

            const loanEntry = {
                bankName: cleanName,
                loanType: "Personal Loan",
                interestRate: cleanRate,
                processingFee: loan.feeRaw,
                tenureRange: "1 to 5 years", 
                link: url,
                features: ["Instant Approval", "Paperless"]
            };

            await BankLoan.create(loanEntry);
            console.log(`   Saved: ${loanEntry.bankName} @ ${loanEntry.interestRate}%`);
        }

    } catch (error) {
        console.error("Scraping Failed:", error);
    } finally {
        await browser.close();
        await mongoose.connection.close();
        console.log("👋 Scraper Finished.");
    }
};

scrapeBankBazaar();