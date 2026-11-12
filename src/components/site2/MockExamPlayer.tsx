import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MathRenderer } from '../common/MathRenderer';
import { Clock, Flag, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockExamPlayerProps {
  testId: string;
  onClose: () => void;
}

export const MockExamPlayer: React.FC<MockExamPlayerProps> = ({ testId, onClose }) => {
  const { db, currentUser, submitTestAttempt } = useApp();
  const test = db.tests.find(t => t.id === testId) || db.tests[0];
  const questions = db.questions.filter(q => q.testId === test.id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState((test.durationMinutes || 45) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resultAttempt, setResultAttempt] = useState<any>(null);

  // Timer
  useEffect(() => {
    if (resultAttempt) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resultAttempt]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optIdx: number) => {
    if (resultAttempt) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const timeSpent = (test.durationMinutes * 60) - secondsRemaining;
    try {
      const res = await submitTestAttempt(test.id, answers, Math.max(timeSpent, 10));
      if (res.success && res.attempt) {
        setResultAttempt(res.attempt);
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!test || questions.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center">
        <p className="text-stone-500 text-sm mb-4">Ushbu test uchun hozircha savollar topilmadi.</p>
        <button onClick={onClose} className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-100 text-stone-800">
          Ortga Qaytish
        </button>
      </div>
    );
  }

  // Result Analysis Screen
  if (resultAttempt) {
    const isPassing = (resultAttempt.score / resultAttempt.maxScore) >= 0.7;

    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/30 text-[#F95738] flex items-center justify-center mx-auto mb-4">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white mb-2">
            Imtihon Natijalari
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            {test.title} · Natijangiz muvaffaqiyatli saqlandi
          </p>

          <div className="grid grid-cols-3 gap-4 bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 mb-6">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
                {resultAttempt.score}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">To‘plangan Ball</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums">
                {resultAttempt.correctCount} / {resultAttempt.totalQuestions}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">To‘g‘ri Javoblar</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums">
                {Math.round(resultAttempt.timeSpentSeconds / 60)} daq
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">Sarflangan Vaqt</div>
            </div>
          </div>
        </div>

        {/* Detailed Question by Question Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 pb-2">
            Batafsil Savollar Tahlili va To‘g‘ri Yechimlar
          </h3>

          {questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswerIndex;
            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border text-xs sm:text-sm ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/10'
                    : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-stone-900 dark:text-white">
                    {idx + 1}-Savol
                  </span>
                  <span className={`font-semibold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isCorrect ? 'To‘g‘ri (+Ball)' : 'Xato'}
                  </span>
                </div>

                <div className="font-medium text-stone-900 dark:text-white mb-2">
                  <MathRenderer content={q.prompt} />
                </div>

                {q.mathFormula && (
                  <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl my-2 text-center border border-stone-200/60 dark:border-stone-700">
                    <MathRenderer content={q.mathFormula} block />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswer === oIdx;
                    const isRightOption = q.correctAnswerIndex === oIdx;
                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          isRightOption
                            ? 'border-emerald-500 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 font-semibold'
                            : isSelected
                            ? 'border-rose-500 bg-rose-100/60 text-rose-900 font-medium'
                            : 'border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-[10px]">
                          {['A', 'B', 'C', 'D'][oIdx]}
                        </span>
                        <MathRenderer content={opt} />
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="p-3 bg-white dark:bg-stone-800/80 rounded-xl text-xs text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-0.5">
                      Fayzullo ustoz yechimi:
                    </span>
                    <MathRenderer content={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 transition-colors shadow-xs"
          >
            Natijani Saqlash va Kabinetga Qaytish
          </button>
        </div>
      </div>
    );
  }

  // Active Exam Taking Screen
  return (
    <div className="space-y-6">
      {/* Top Test Banner with Real-time Clock */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">
            {test.title}
          </h2>
          <span className="text-xs text-stone-500">
            Jami savollar: {questions.length} ta · Maksimal ball: {test.maxScore}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3.5 py-2 rounded-xl text-stone-900 dark:text-white font-mono font-bold text-sm">
            <Clock className={`w-4 h-4 ${secondsRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-stone-500'}`} />
            <span className={secondsRemaining < 300 ? 'text-red-500' : ''}>
              {formatTime(secondsRemaining)}
            </span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
          >
            Testni Yakunlash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Question Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {currentIndex + 1}-Savol
              </span>

              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  flagged[currentQ.id]
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQ.id] ? 'Belgilangan (Flag)' : 'Keyinroqqa belgilash'}</span>
              </button>
            </div>

            {/* Prompt */}
            <div className="text-base sm:text-lg font-semibold text-stone-900 dark:text-white leading-relaxed mb-4">
              <MathRenderer content={currentQ.prompt} />
            </div>

            {/* Formula block if exists */}
            {currentQ.mathFormula && (
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl my-4 text-center border border-stone-200/60 dark:border-stone-700">
                <MathRenderer content={currentQ.mathFormula} block />
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 mt-6">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ.id] === oIdx;
                const letter = ['A', 'B', 'C', 'D'][oIdx];

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 font-medium'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
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

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-stone-100 dark:border-stone-800 mt-8">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="px-4 py-2.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Oldingisi</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 flex items-center gap-1.5 shadow-xs"
                >
                  <span>Keyingi Savol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-xs"
                >
                  <span>Yakunlash</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Question Map Navigator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-4">
              Savollar Xaritasi ({Object.keys(answers).length}/{questions.length} yechildi)
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-bold relative transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-stone-900 font-extrabold'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mt-4 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                <span>Javob berilgan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-stone-200 dark:bg-stone-700" />
                <span>Javob berilmagan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Keyinroqqa belgilangan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
              Testni rostdan ham yakunlaysizmi?
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Jami {questions.length} ta savoldan {Object.keys(answers).length} tasiga javob berdingiz.
              Yakunlagach, qayta o‘zgartirib bo‘lmaydi.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 text-xs font-medium rounded-xl border border-stone-200 text-stone-700 dark:text-stone-300"
              >
                Davom Etish
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isSubmitting ? 'Yakunlanmoqda...' : 'Ha, Yakunlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
