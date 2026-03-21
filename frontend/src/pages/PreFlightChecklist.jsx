import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckSquare, Square, RefreshCcw, ArrowRight } from 'lucide-react';

const CHECKLIST_STORAGE_KEY = 'firstTimeBorrowerChecklist';

const CHECKLIST_ITEMS = [
  'PAN card',
  'Aadhaar card',
  'Last 3 months bank statements',
  'Latest 3 salary slips',
  'Form 16 or Income Tax Returns',
  'Address proof',
  'Passport-sized photo',
];

const PreFlightChecklist = () => {
  const [checkedMap, setCheckedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Could not read checklist state from localStorage:', error);
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedMap));
    } catch (error) {
      console.error('Could not save checklist state to localStorage:', error);
    }
  }, [checkedMap]);

  const completedCount = useMemo(
    () => CHECKLIST_ITEMS.filter((item) => checkedMap[item]).length,
    [checkedMap]
  );

  const progress = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  const toggleItem = (item) => {
    setCheckedMap((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const resetChecklist = () => {
    setCheckedMap({});
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <section className="text-center max-w-3xl mx-auto mb-10">
          <p className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-violet-300">
            First-Time Borrower Hub
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Pre-Flight Document Checklist
          </h1>
          <p className="mt-4 text-neutral-300 leading-relaxed">
            Tick items as you collect them. Your progress is auto-saved and stays
            checked even after refresh.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-neutral-950 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-neutral-400">Completion</p>
              <p className="text-2xl font-bold">
                {completedCount}/{CHECKLIST_ITEMS.length} documents
              </p>
            </div>
            <button
              onClick={resetChecklist}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <RefreshCcw size={14} />
              Reset checklist
            </button>
          </div>

          <div className="h-3 w-full rounded-full bg-neutral-800 overflow-hidden mb-8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = Boolean(checkedMap[item]);
              return (
                <li key={item}>
                  <button
                    onClick={() => toggleItem(item)}
                    className={`w-full rounded-xl border p-4 text-left flex items-center justify-between gap-3 transition-colors ${
                      isChecked
                        ? 'border-emerald-400/40 bg-emerald-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className={`font-medium ${isChecked ? 'text-emerald-200' : 'text-white'}`}>
                      {item}
                    </span>
                    {isChecked ? (
                      <CheckSquare size={20} className="text-emerald-300 shrink-0" />
                    ) : (
                      <Square size={20} className="text-neutral-400 shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-10 flex flex-col md:flex-row gap-4">
          <Link
            to="/first-time-borrower/roadmap"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold hover:bg-white/10 transition-colors"
          >
            View Loan Roadmap
          </Link>
          <Link
            to="/check-eligibility"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-black font-semibold hover:bg-neutral-200 transition-colors"
          >
            Start Eligibility Check <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PreFlightChecklist;
