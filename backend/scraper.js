import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BankLoan from './models/BankLoan.js';
import { scrapeTwoWheelerLoan } from './scrapers/twoWheelerLoan.logic.js';
import { scrapeUsedCarLoan } from './scrapers/usedCarLoan.logic.js';
import { scrapeEducationLoan } from './scrapers/educationLoan.logic.js';

import { scrapePersonalLoan } from './scrapers/personalLoan.logic.js';
import { scrapeHomeLoan } from './scrapers/homeLoan.logic.js';
import { scrapeCarLoan } from './scrapers/carLoan.logic.js';

dotenv.config();

const scrapeBankBazaar = async () => {
  console.log("🚀 Starting BankBazaar Scraper");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Database Connected");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage(); // ✅ page defined ONCE

  try {
    /* ========== PERSONAL LOAN ========== */
    const personalLoanUrl = "https://www.bankbazaar.com/personal-loan.html";
    console.log("🔎 Scraping Personal Loan");

    await page.goto(personalLoanUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    const personalLoans = await scrapePersonalLoan(page);
    console.log(`🎉 Found ${personalLoans.length} Personal Loans`);

    for (const loan of personalLoans) {
      const m = loan.interestRaw.match(/(\d+(\.\d+)?)/);
      if (!m) continue;

      await BankLoan.updateOne(
        { bankName: loan.bankName, loanType: "Personal Loan" },
        {
          $set: {
            bankName: loan.bankName,
            loanType: "Personal Loan",
            interestRate: parseFloat(m[0]),
            processingFee: loan.feeRaw,
            tenureRange: "1 to 5 years",
            link: personalLoanUrl,
            features: ["Instant Approval", "Paperless"]
          }
        },
        { upsert: true }
      );
    }

    /* ========== HOME LOAN ========== */
    const homeLoanUrl = "https://www.bankbazaar.com/home-loan.html";
    console.log("🔎 Scraping Home Loan");

    await page.goto(homeLoanUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    const homeLoans = await scrapeHomeLoan(page);
    console.log(`🎉 Found ${homeLoans.length} Home Loans`);

    for (const loan of homeLoans) {
      const m = loan.interestRaw.match(/(\d+(\.\d+)?)/);
      if (!m) continue;

      await BankLoan.updateOne(
        { bankName: loan.bankName, loanType: "Home Loan" },
        {
          $set: {
            bankName: loan.bankName,
            loanType: "Home Loan",
            interestRate: parseFloat(m[0]),
            processingFee: loan.feeRaw,
            tenureRange: loan.tenureRaw,
            link: homeLoanUrl,
            features: ["Long Tenure"]
          }
        },
        { upsert: true }
      );
    }

    /* ========== CAR LOAN ========== */
    const carLoanUrl = "https://www.bankbazaar.com/car-loan.html";
    console.log("🔎 Scraping Car Loan");

    await page.goto(carLoanUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    const carLoans = await scrapeCarLoan(page);
    console.log(`🎉 Found ${carLoans.length} Car Loans`);

    for (const loan of carLoans) {
      const m = loan.interestRaw.match(/(\d+(\.\d+)?)/);
      if (!m) continue;

      await BankLoan.updateOne(
        { bankName: loan.bankName, loanType: "Car Loan" },
        {
          $set: {
            bankName: loan.bankName,
            loanType: "Car Loan",
            interestRate: parseFloat(m[0]),
            processingFee: "Varies",
            tenureRange: loan.tenureRaw,
            link: carLoanUrl,
            features: ["New & Used Cars"]
          }
        },
        { upsert: true }
      );
    }
    /* ========== TWO WHEELER LOAN ========== */

const twoWheelerLoanUrl = "https://www.bankbazaar.com/two-wheeler-loan.html";
console.log("🔎 Scraping Two Wheeler Loan");

await page.goto(twoWheelerLoanUrl, { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3000));

const twLoans = await scrapeTwoWheelerLoan(page);
console.log(`🎉 Found ${twLoans.length} Two Wheeler Loans`);

for (const loan of twLoans) {
  const match = loan.interestRaw.match(/(\d+(\.\d+)?)/);
  if (!match) continue;

  const cleanRate = parseFloat(match[0]);
  const cleanName = loan.bankName.replace(/Two Wheeler Loan/i, '').trim();

  await BankLoan.updateOne(
    { bankName: cleanName, loanType: "Two Wheeler Loan" },
    {
      $set: {
        bankName: cleanName,
        loanType: "Two Wheeler Loan",
        interestRate: cleanRate,
        processingFee: loan.feeRaw,
        tenureRange: loan.loanAmountRaw,
        link: twoWheelerLoanUrl,
        features: ["Fast Approval", "Low Down Payment"]
      }
    },
    { upsert: true }
  );

  console.log(`✅ Saved/Updated Two Wheeler Loan: ${cleanName}`);
}
/* ========== USED CAR LOAN ========== */

const usedCarLoanUrl = "https://www.bankbazaar.com/used-car-loan.html";
console.log("🔎 Scraping Used Car Loan");

await page.goto(usedCarLoanUrl, { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3000));

const usedCarLoans = await scrapeUsedCarLoan(page);
console.log(`🎉 Found ${usedCarLoans.length} Used Car Loans`);

for (const loan of usedCarLoans) {
  const match = loan.interestRaw.match(/(\d+(\.\d+)?)/);
  if (!match) continue; // skip "Contact the bank"

  const cleanRate = parseFloat(match[0]);
  const cleanName = loan.bankName
    .replace(/Used Car Loan/i, '')
    .trim();

  await BankLoan.updateOne(
    { bankName: cleanName, loanType: "Used Car Loan" },
    {
      $set: {
        bankName: cleanName,
        loanType: "Used Car Loan",
        interestRate: cleanRate,
        processingFee: "Varies",
        tenureRange: loan.tenureRaw,
        link: usedCarLoanUrl,
        features: ["Pre-Owned Vehicles"]
      }
    },
    { upsert: true }
  );

  console.log(`✅ Saved/Updated Used Car Loan: ${cleanName}`);
}
/* ========== EDUCATION LOAN ========== */

const educationLoanUrl = "https://www.bankbazaar.com/education-loan.html";
console.log("🔎 Scraping Education Loan");

await page.goto(educationLoanUrl, { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3000));

const educationLoans = await scrapeEducationLoan(page);
console.log(`🎉 Found ${educationLoans.length} Education Loans`);

for (const loan of educationLoans) {
  const match = loan.interestRaw.match(/(\d+(\.\d+)?)/);
  if (!match) continue; // skip non-numeric cases

  const cleanRate = parseFloat(match[0]);
  const cleanName = loan.bankName
    .replace(/Education Loan/i, '')
    .trim();

  await BankLoan.updateOne(
    { bankName: cleanName, loanType: "Education Loan" },
    {
      $set: {
        bankName: cleanName,
        loanType: "Education Loan",
        interestRate: cleanRate,
        processingFee: loan.processingFee,
        tenureRange: "Up to course + repayment period",
        link: educationLoanUrl,
        features: ["Studies in India & Abroad"]
      }
    },
    { upsert: true }
  );

  console.log(`✅ Saved/Updated Education Loan: ${cleanName}`);
}

  } catch (err) {
    console.error("❌ Scraper Error:", err);
  } finally {
    await browser.close();
    await mongoose.connection.close();
    console.log("👋 Scraper Finished");
  }
};

scrapeBankBazaar();
