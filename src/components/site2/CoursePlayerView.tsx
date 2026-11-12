import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MathRenderer } from '../common/MathRenderer';
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Lock,
  Award,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Check,
  X,
  RotateCcw,
  BookOpen,
  Filter,
  Crown
} from 'lucide-react';
import { Course, Lesson, Question } from '../../types';

const getEmbedUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return trimmed;
};

interface CoursePlayerViewProps {
  courseId: string;
  onBack: () => void;
  onOpenTest: (testId: string) => void;
  onGoToVIP?: () => void;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({
  courseId,
  onBack,
  onOpenTest,
  onGoToVIP
}) => {
  const { db, currentUser, isOwnerAuth, setActiveSite, toggleLessonCompletion } = useApp();
  const course = db.courses.find(c => c.id === courseId) || db.courses[0];
  const allLessons = db.lessons.filter(l => l.courseId === course.id);

  const [lessonFilter, setLessonFilter] = useState<'all' | 'thematic' | 'regular'>('all');
  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || '');

  // Filtered lessons
  const filteredLessons = allLessons.filter(l => {
    if (lessonFilter === 'thematic') return l.lessonType === 'thematic';
    if (lessonFilter === 'regular') return l.lessonType === 'regular';
    return true;
  });

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const activeIndex = allLessons.findIndex(l => l.id === activeLesson?.id);

  // Zanjir Tizimi (Chained Unlock logic):
  // Lesson 0 is unlocked. Subsequent lesson i is unlocked if lesson i-1 is completed.
  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    const prevLesson = allLessons[lessonIndex - 1];
    return currentUser?.completedLessons.includes(prevLesson.id);
  };

  const isCurrentLessonUnlocked = isLessonUnlocked(activeIndex);

  // VIP tekshiruvi (Demo darsdan tashqari darslarda):
  const VIP_TIER_RANK: Record<string, number> = {
    none: 0,
    free: 0,
    start: 1,
    gold: 2,
    platinum: 3,
    individual: 4
  };

  const userVipTier = currentUser?.vipTier || 'none';
  const requiredVipTier = course?.requiredVIP || 'start';
  const userRank = VIP_TIER_RANK[userVipTier] || 0;
  const courseRank = VIP_TIER_RANK[requiredVipTier] || 1;

  // Demo dars har kimga bepul, owner uchun ham cheklov yo'q:
  const isDemoLesson = activeLesson?.isDemo === true;
  const isUserVipNone = !currentUser?.vipTier || currentUser.vipTier === 'none' || currentUser.vipTier === 'free';
  const hasVipAccess = isOwnerAuth || (isDemoLesson ? true : (!isUserVipNone && userRank >= courseRank));

  // "Ko'rib Bo'ldim" State for the active lesson
  const [markedWatchedMap, setMarkedWatchedMap] = useState<Record<string, boolean>>({});
  const hasClickedWatched = markedWatchedMap[activeLesson?.id || ''] || currentUser?.completedLessons.includes(activeLesson?.id || '');

  // Quiz state for the active lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState<number | null>(null);

  // Find questions for the active lesson's test (Faqat activeTestId bo'yicha savol topilmagandagina fallback)
  const activeTestId = activeLesson?.testId;
  let questions: Question[] = activeTestId ? db.questions.filter(q => q.testId === activeTestId) : [];
  if (questions.length === 0) {
    questions = db.questions.filter(q => q.testId === 'test-milliy-1').slice(0, 4);
  }

  const requiredPassingPercent = activeLesson?.requiredPassingPercent || 70;
  const isPassed = scorePercent !== null && scorePercent >= requiredPassingPercent;

  const handleMarkWatched = () => {
    if (!activeLesson) return;
    setMarkedWatchedMap(prev => ({ ...prev, [activeLesson.id]: true }));
    // Scroll down smoothly to the test
    setTimeout(() => {
      document.getElementById('lesson-quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (questions.length === 0) return;
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const percent = Math.round((correct / questions.length) * 100);
    setScorePercent(percent);
    setQuizSubmitted(true);

    if (percent >= requiredPassingPercent) {
      // Mark as completed and unlock next chained lesson!
      if (!currentUser?.completedLessons.includes(activeLesson.id)) {
        await toggleLessonCompletion(activeLesson.id);
      }
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScorePercent(null);
  };

  const handleGoToNextLesson = () => {
    if (activeIndex < allLessons.length - 1) {
      const nextL = allLessons[activeIndex + 1];
      setActiveLessonId(nextL.id);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setScorePercent(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors mb-1 flex items-center gap-1 font-medium"
          >
            ← Barcha kurslarga qaytish
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {course.title}
            </h2>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              Zanjir Tizimi Faol
            </span>
          </div>
        </div>

        {/* Filter buttons for lessons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setLessonFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              lessonFilter === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Barchasi ({allLessons.length})
          </button>
          <button
            onClick={() => setLessonFilter('thematic')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              lessonFilter === 'thematic'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Mavzulashtirilgan
          </button>
          <button
            onClick={() => setLessonFilter('regular')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              lessonFilter === 'regular'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Oddiy Darslar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Stage */}
        <div className="lg:col-span-8 space-y-6">
          {!hasVipAccess ? (
            /* VIP Paywall Screen */
            <div className="bg-white dark:bg-stone-900 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-amber-600 text-white flex items-center justify-center mb-4 shadow-md shadow-amber-500/20">
                <Lock className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-3 border border-amber-300/60">
                <Crown className="w-3.5 h-3.5" />
                <span>VIP Tarif Talab Qilinadi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mb-2">
                Ushbu darsni ko‘rish uchun VIP tarifga o‘ting
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto mb-6 leading-relaxed">
                "<span className="font-bold text-stone-900 dark:text-white">{course.title}</span>" kursi darslarini tomosha qilish uchun kamida{' '}
                <span className="font-extrabold text-amber-600 dark:text-amber-400 uppercase">{requiredVipTier}</span> tarifi talab etiladi.
                Sizning hozirgi tarifingiz:{' '}
                <span className="font-extrabold text-rose-500 uppercase">{userVipTier === 'none' ? 'Mavjud emas (Oddiy)' : userVipTier}</span>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    if (onGoToVIP) {
                      onGoToVIP();
                    } else {
                      setActiveSite('site1_open');
                      setTimeout(() => {
                        document.getElementById('vip-plans')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }
                  }}
                  className="px-6 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white hover:brightness-110 shadow-md transition-all flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>VIP Tariflarni Ko‘rish va Xarid Qilish</span>
                </button>
                <button
                  onClick={onBack}
                  className="px-5 py-3 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors"
                >
                  Kurslar Ro‘yxatiga Qaytish
                </button>
              </div>
            </div>
          ) : !isCurrentLessonUnlocked ? (
            /* Locked State Screen */
            <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                Ushbu Dars Hozircha Qulflangan
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
                Platformadagi zanjir tizimiga muvofiq, keyingi darsni ochish uchun oldingi darsni to‘liq ko‘rib, unga biriktirilgan testdan kamida{' '}
                <span className="font-bold text-rose-600">{allLessons[activeIndex - 1]?.requiredPassingPercent || 70}%</span> to‘plashingiz zarur.
              </p>
              <button
                onClick={() => {
                  const prevId = allLessons[activeIndex - 1]?.id;
                  if (prevId) setActiveLessonId(prevId);
                }}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 transition-colors"
              >
                ← Oldingi Darsga O‘tish va Testni Topshirish
              </button>
            </div>
          ) : activeLesson ? (
            <>
              {/* Video Player */}
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-lg border border-stone-800 relative">
                <iframe
                  src={getEmbedUrl(activeLesson.videoUrl)}
                  title={activeLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Lesson Control & "Ko'rib Bo'ldim" Section */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          activeLesson.lessonType === 'thematic'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {activeLesson.lessonType === 'thematic' ? '★ Mavzulashtirilgan Dars' : 'Oddiy Standart Dars'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        O‘tish foizi: kamida {requiredPassingPercent}%
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {activeLesson.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Davomiyligi: {activeLesson.durationMinutes} daqiqa · Tartib: #{activeLesson.orderIndex}
                    </p>
                  </div>

                  {/* "Ko'rib Bo'ldim" BUTTON */}
                  <button
                    onClick={handleMarkWatched}
                    className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs shrink-0 ${
                      hasClickedWatched
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#F95738] hover:bg-[#E04828] text-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{hasClickedWatched ? 'Ko‘rib Bo‘ldim ✓' : 'Ko‘rib Bo‘ldim'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                  {activeLesson.description}
                </p>

                {/* Mathematical Formula Highlight */}
                {activeLesson.mathFormula && (
                  <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 p-4 rounded-xl mb-6">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Mavzuning Asosiy Formulalari (KaTeX)
                    </div>
                    <MathRenderer content={activeLesson.mathFormula} block />
                  </div>
                )}

                {/* Notes Markdown */}
                {activeLesson.notesMarkdown && (
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl mb-6 text-xs text-stone-700 dark:text-stone-300 leading-relaxed border border-stone-200/60 dark:border-stone-800">
                    <MathRenderer content={activeLesson.notesMarkdown} />
                  </div>
                )}
              </div>

              {/* PASTDA: CREATOR JOYLAGAN TEST / VIKTORINA (Ko'rib Bo'lgach Chiqadi) */}
              <div id="lesson-quiz-section">
                {hasClickedWatched ? (
                  <div className="bg-white dark:bg-stone-900 border-2 border-rose-500/30 dark:border-rose-500/20 rounded-3xl p-6 sm:p-8 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Dars Viktorinasi & Zanjirli Sinov</span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                          Ushbu Dars Bo‘yicha Bilimni Tekshirish
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Keyingi dars ochilishi uchun kamida{' '}
                          <span className="font-bold text-rose-600 dark:text-rose-400">{requiredPassingPercent}%</span> to‘plashingiz zarur.
                        </p>
                      </div>

                      {quizSubmitted && (
                        <div className="text-right">
                          <span
                            className={`text-sm font-black px-3 py-1 rounded-xl uppercase ${
                              isPassed
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            }`}
                          >
                            Natija: {scorePercent}% {isPassed ? '✓ O‘tdingiz' : '✗ Qayta topshiring'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Questions List */}
                    <div className="space-y-6">
                      {questions.map((q, qIndex) => {
                        const selected = selectedAnswers[q.id];
                        const isAnswered = selected !== undefined;
                        const isCorrect = selected === q.correctAnswerIndex;

                        return (
                          <div
                            key={q.id}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                              quizSubmitted
                                ? isCorrect
                                  ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20'
                                  : 'border-red-300 bg-red-50/30 dark:border-red-800 dark:bg-red-950/20'
                                : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <h5 className="font-bold text-sm text-stone-900 dark:text-white leading-snug">
                                {qIndex + 1}. <MathRenderer content={q.prompt} />
                              </h5>
                              {quizSubmitted && (
                                <span className="shrink-0">
                                  {isCorrect ? (
                                    <Check className="w-4 h-4 text-emerald-600 font-bold" />
                                  ) : (
                                    <X className="w-4 h-4 text-red-600 font-bold" />
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Math Formula if present */}
                            {q.mathFormula && (
                              <div className="mb-3 px-3 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 text-xs">
                                <MathRenderer content={q.mathFormula} block />
                              </div>
                            )}

                            {/* 4 Options Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {q.options.map((opt, optIdx) => {
                                const optionLetter = ['A', 'B', 'C', 'D'][optIdx];
                                const isSelected = selected === optIdx;
                                const isOptionCorrect = q.correctAnswerIndex === optIdx;

                                let btnStyle = 'border-stone-200 dark:border-stone-800 hover:border-stone-300 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200';

                                if (quizSubmitted) {
                                  if (isOptionCorrect) {
                                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                                  } else if (isSelected && !isOptionCorrect) {
                                    btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200 line-through';
                                  }
                                } else if (isSelected) {
                                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold ring-1 ring-rose-500';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSelectAnswer(q.id, optIdx)}
                                    disabled={quizSubmitted}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${btnStyle}`}
                                  >
                                    <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                                      {optionLetter}
                                    </span>
                                    <span className="flex-1">
                                      <MathRenderer content={opt} />
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation when submitted */}
                            {quizSubmitted && q.explanation && (
                              <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
                                <span className="font-bold text-stone-700 dark:text-stone-300">Izoh: </span>
                                <MathRenderer content={q.explanation} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Action Footer */}
                    <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {!quizSubmitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(selectedAnswers).length === 0}
                          className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Testni Yakunlash & Tekshirish
                        </button>
                      ) : (
                        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            {isPassed ? (
                              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                                🎉 Tabriklaymiz! Siz {scorePercent}% to‘pladingiz (Kerakli: {requiredPassingPercent}%). Keyingi dars muvaffaqiyatli ochildi!
                              </div>
                            ) : (
                              <div className="text-xs text-red-600 dark:text-red-400 font-bold">
                                Afsuski, siz {scorePercent}% to‘pladingiz. Keyingi dars ochilishi uchun kamida {requiredPassingPercent}% kerak.
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {!isPassed && (
                              <button
                                onClick={handleRetakeQuiz}
                                className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Qaytadan Topshirish</span>
                              </button>
                            )}

                            {isPassed && activeIndex < allLessons.length - 1 && (
                              <button
                                onClick={handleGoToNextLesson}
                                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                              >
                                <span>Keyingi Darsga O‘tish</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Prompt to click "Ko'rib Bo'ldim" */
                  <div className="bg-stone-100 dark:bg-stone-800/40 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-6 text-center">
                    <HelpCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <h5 className="font-bold text-xs sm:text-sm text-stone-700 dark:text-stone-300 mb-1">
                      Ushbu Dars Testi Qulflangan
                    </h5>
                    <p className="text-[11px] text-stone-500 max-w-md mx-auto mb-3">
                      Videoni ko‘rib bo‘lgach, yuqoridagi <strong>«Ko‘rib Bo‘ldim»</strong> tugmasini bosing. Shunda pastda Creator tomonidan tayyorlangan test viktorinasi ochiladi.
                    </p>
                    <button
                      onClick={handleMarkWatched}
                      className="px-4 py-1.5 text-xs font-bold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800"
                    >
                      Darsni Ko‘rib Bo‘ldim
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Sidebar: Course Curriculum with Chain Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Kurs Darslari ({filteredLessons.length} ta)
              </h3>
              <span className="text-[10px] font-bold text-stone-400 uppercase">
                Zanjir tartibi
              </span>
            </div>

            <div className="space-y-2">
              {filteredLessons.map((lesson) => {
                const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                const isUnlocked = isLessonUnlocked(globalIndex);
                const isCurrent = lesson.id === activeLessonId;
                const isDone = currentUser?.completedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setActiveLessonId(lesson.id);
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                        setScorePercent(null);
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start gap-3 ${
                      !isUnlocked
                        ? 'opacity-60 bg-stone-50 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800 cursor-not-allowed'
                        : isCurrent
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-stone-900 dark:text-white font-medium shadow-2xs'
                        : 'border-stone-200/80 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {!isUnlocked ? (
                        <Lock className="w-4 h-4 text-stone-400" />
                      ) : isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <PlayCircle className={`w-4 h-4 ${isCurrent ? 'text-rose-600' : 'text-stone-400'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                            lesson.lessonType === 'thematic'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {lesson.lessonType === 'thematic' ? 'Mavzulashtirilgan' : 'Oddiy'}
                        </span>
                      </div>
                      <div className="line-clamp-2 leading-snug">
                        {globalIndex + 1}. {lesson.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                        <span>{lesson.durationMinutes} daqiqa</span>
                        <span>O‘tish: {lesson.requiredPassingPercent || 70}%</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
