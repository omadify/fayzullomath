import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MathRenderer } from '../common/MathRenderer';
import { X, CheckCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosticQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticQuizModal: React.FC<DiagnosticQuizModalProps> = ({ isOpen, onClose }) => {
  const { db, setActiveSite } = useApp();
  const diagTest = db.tests.find(t => t.type === 'diagnostic') || db.tests[0];
  const questions = db.questions.filter(q => q.testId === diagTest?.id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !diagTest || questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  let score = 0;
  questions.forEach(q => {
    if (selectedAnswers[q.id] === q.correctAnswerIndex) {
      score += 10;
    }
  });
  const maxPossible = questions.length * 10;
  const percentage = Math.round((score / maxPossible) * 100);

  let recommendation = 'Boshlang‘ich daraja: Maktab asoslari va algebraik ifodalar kursidan boshlashingizni tavsiya qilamiz.';
  if (percentage >= 80) {
    recommendation = 'Ajoyib natija! Milliy Sertifikat A+ Maxsus Kursi va Mock Imtihonlarimiz siz uchun ayni muddao!';
  } else if (percentage >= 50) {
    recommendation = 'Yaxshi baza! OTM Kirish Imtihonlari kursi va geometriya teoremalarini kuchaytirsangiz, tez orada 90+ ballga chiqasiz.';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Tezkor Diagnostika
              </span>
              <span>
                Savol: {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-white mb-2">
                <MathRenderer content={currentQ.prompt} />
              </h3>
              {currentQ.mathFormula && (
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl my-3 text-center">
                  <MathRenderer content={currentQ.mathFormula} block />
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                const letter = ['A', 'B', 'C', 'D'][idx];
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 font-medium'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {letter}
                    </span>
                    <MathRenderer content={opt} />
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="px-4 py-2 text-xs text-stone-500 hover:text-stone-900 disabled:opacity-40"
              >
                ← Oldingisi
              </button>
              <button
                disabled={selectedAnswers[currentQ.id] === undefined}
                onClick={handleNext}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>{currentIndex === questions.length - 1 ? 'Natijani Ko‘rish' : 'Keyingisi'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-1">
              Diagnostika Yakunlandi!
            </h3>
            <p className="text-stone-500 text-xs mb-4">
              Matematika bo‘yicha tezkor bilimingiz tahlil qilindi
            </p>

            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl mb-4">
              <div className="text-3xl font-extrabold text-stone-900 dark:text-white mb-1">
                {percentage}%
              </div>
              <div className="text-xs text-stone-500">
                To‘plangan ball: <span className="font-semibold text-stone-800 dark:text-stone-200">{score}</span> / {maxPossible}
              </div>
            </div>

            <p className="text-sm text-stone-700 dark:text-stone-300 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3.5 rounded-xl text-left leading-relaxed mb-6">
              💡 <span className="font-semibold">Tavsiya:</span> {recommendation}
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 text-xs font-medium border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-1.5 text-stone-700 dark:text-stone-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Qayta Urinish
              </button>
              <button
                onClick={() => {
                  onClose();
                  setActiveSite('site2_lms');
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                O‘quvchi Kabinetida Kursni Boshlash →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
