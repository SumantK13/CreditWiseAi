import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BadgeCheck,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Banknote,
  ArrowRight,
} from 'lucide-react';

const LOAN_STEPS = [
  {
    title: 'Eligibility Check',
    description:
      'Share basic profile details to understand your loan approval chances before applying.',
    icon: BadgeCheck,
    accent: 'from-cyan-500/25 to-cyan-500/5 border-cyan-400/40',
  },
  {
    title: 'Document Submission',
    description:
      'Upload KYC and income documents so lenders can validate your identity and repayment strength.',
    icon: FileText,
    accent: 'from-violet-500/25 to-violet-500/5 border-violet-400/40',
  },
  {
    title: 'Verification',
    description:
      'Banks verify employment, credit history, and submitted documents to reduce fraud risk.',
    icon: ShieldCheck,
    accent: 'from-amber-500/25 to-amber-500/5 border-amber-400/40',
  },
  {
    title: 'Sanction',
    description:
      'You receive a sanction letter that confirms approved amount, tenure, and interest rate.',
    icon: CheckCircle2,
    accent: 'from-emerald-500/25 to-emerald-500/5 border-emerald-400/40',
  },
  {
    title: 'Disbursement',
    description:
      'After acceptance and final checks, the loan amount is released to your bank account.',
    icon: Banknote,
    accent: 'from-fuchsia-500/25 to-fuchsia-500/5 border-fuchsia-400/40',
  },
];

const FirstTimeBorrowerRoadmap = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <section className="text-center max-w-3xl mx-auto mb-14">
          <p className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-300">
            First-Time Borrower Hub
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Loan Process Roadmap
          </h1>
          <p className="mt-4 text-neutral-300 leading-relaxed">
            A clear, visual timeline of what happens from your first eligibility check
            to final disbursement.
          </p>
        </section>

        <section className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-[2px] bg-gradient-to-b from-cyan-400/60 via-violet-400/50 to-fuchsia-500/60 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-6">
            {LOAN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={step.title}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 ${
                    isLeft ? '' : 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1'
                  }`}
                >
                  <article
                    className={`rounded-2xl border ${step.accent} bg-gradient-to-br p-5 md:p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.25)]`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl border border-white/15 bg-black/40 p-3">
                        <Icon className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                          Step {idx + 1}
                        </p>
                        <h2 className="text-xl font-semibold mt-1">{step.title}</h2>
                        <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </article>

                  <div className="hidden md:block" />

                  <span className="absolute left-5 top-8 -translate-x-1/2 size-4 rounded-full border-2 border-black bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)] md:left-1/2" />
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-r from-neutral-900 to-neutral-950 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h3 className="text-2xl font-semibold">Ready to apply?</h3>
            <p className="mt-2 text-neutral-300">
              Complete your document checklist before you start the application.
            </p>
          </div>
          <Link
            to="/first-time-borrower/checklist"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-black font-semibold hover:bg-neutral-200 transition-colors"
          >
            Open Pre-Flight Checklist <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FirstTimeBorrowerRoadmap;
