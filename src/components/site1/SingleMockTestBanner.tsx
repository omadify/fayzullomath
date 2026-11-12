import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Clock, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export const SingleMockTestBanner: React.FC<{ onStartTest: (testId: string) => void }> = ({ onStartTest }) => {
  const { db } = useApp();
  const mockTest = db.tests.find(t => t.type === 'mock') || db.tests[0];

  if (!mockTest) return null;

  return (
    <section id="mock-exam" className="py-16 bg-white dark:bg-[#15171a] border-b border-stone-200/60 dark:border-stone-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-800 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">
              <Award className="w-4 h-4" />
              <span>Rasmiy BMB Formati</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
              {mockTest.title}
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
              {mockTest.description}
            </p>

            {/* Test Specs strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stone-700/60 mb-8 text-xs">
              <div>
                <span className="text-stone-400 text-[11px] block">Vaqt Cheklovi:</span>
                <span className="font-bold text-white text-sm">{mockTest.durationMinutes} daqiqa</span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Maksimal Ball:</span>
                <span className="font-bold text-rose-400 text-sm">{mockTest.maxScore} ball</span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Baholash Tizimi:</span>
                <span className="font-bold text-emerald-400 text-sm">A+, A, B, C Reyting</span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Tahlil:</span>
                <span className="font-bold text-white text-sm">To‘liq yechimlar</span>
              </div>
            </div>

            <button
              onClick={() => onStartTest(mockTest.id)}
              className="px-6 py-3.5 text-xs font-semibold rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>Mock Testni Hoziroq Boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
