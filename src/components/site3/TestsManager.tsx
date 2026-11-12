import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MathRenderer } from '../common/MathRenderer';
import { Test, Question, TestType, VIPTier } from '../../types';
import { Plus, Trash2, Edit3, Award, CheckCircle, X, HelpCircle } from 'lucide-react';

export const TestsManager: React.FC = () => {
  const { db, createTest, updateTest, deleteTest, createQuestion, deleteQuestion } = useApp();

  const [selectedTestId, setSelectedTestId] = useState<string>(db.tests[0]?.id || '');
  const [showTestModal, setShowTestModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // New Test form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<TestType>('quiz');
  const [duration, setDuration] = useState(45);
  const [maxScore, setMaxScore] = useState(100);
  const [vipTier, setVipTier] = useState<VIPTier>('start');

  // New Question form
  const [prompt, setPrompt] = useState('');
  const [formula, setFormula] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  const activeTest = db.tests.find(t => t.id === selectedTestId) || db.tests[0];
  const activeQuestions = db.questions.filter(q => q.testId === activeTest?.id);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await createTest({
      title,
      description: desc,
      type,
      durationMinutes: duration,
      maxScore,
      requiredVIP: vipTier,
      published: true
    });
    setShowTestModal(false);
    setTitle('');
    setDesc('');
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTest || !prompt || !optA || !optB) return;

    await createQuestion({
      testId: activeTest.id,
      prompt,
      mathFormula: formula,
      options: [optA, optB, optC || 'Variant C', optD || 'Variant D'],
      correctAnswerIndex: correctIdx,
      explanation,
      difficulty: 'medium'
    });

    setShowQuestionModal(false);
    setPrompt('');
    setFormula('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanation('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
            Testlar va Sinovlar Konstruktori
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Milliy sertifikat mock imtihonlari va mavzuli quizlarni qo‘shish, tahrirlash hamda savollar banki
          </p>
        </div>

        <button
          onClick={() => setShowTestModal(true)}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 transition-colors shadow-xs flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Test Qo‘shish</span>
        </button>
      </div>

      {/* Test Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {db.tests.map(test => (
          <div
            key={test.id}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all border ${
              test.id === activeTest?.id
                ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
            }`}
          >
            <button
              onClick={() => setSelectedTestId(test.id)}
              className="hover:underline"
            >
              {test.title}
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (confirm(`"${test.title}" testini rostdan ham o‘chirasizmi?`)) {
                  await deleteTest(test.id);
                  const remaining = db.tests.filter(t => t.id !== test.id);
                  if (remaining.length > 0) {
                    setSelectedTestId(remaining[0].id);
                  }
                }
              }}
              title="O‘chirish"
              className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {activeTest ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <span className="font-bold text-rose-600 uppercase">{activeTest.type}</span>
                <span>·</span>
                <span>{activeTest.durationMinutes} daqiqa</span>
                <span>·</span>
                <span>Maks: {activeTest.maxScore} ball</span>
                <span>·</span>
                <span>VIP: {activeTest.requiredVIP.toUpperCase()}</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                {activeTest.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                {activeTest.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuestionModal(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#F95738] hover:bg-[#E04828] text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Savol Qo‘shish</span>
              </button>
              <button
                onClick={async () => {
                  if (confirm('Ushbu test va uning savollarini rostdan ham o‘chirasizmi?')) {
                    await deleteTest(activeTest.id);
                    const remaining = db.tests.filter(t => t.id !== activeTest.id);
                    if (remaining.length > 0) {
                      setSelectedTestId(remaining[0].id);
                    }
                  }
                }}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 border border-stone-200 dark:border-stone-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Questions Bank List */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
              Savollar Banki ({activeQuestions.length} ta savol)
            </h4>

            {activeQuestions.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">
                Bu test uchun hozircha savollar kiritilmagan. Yuqoridagi "+ Savol Qo‘shish" yoki "AI Test Yaratish" bo‘limidan foydalaning.
              </p>
            ) : (
              activeQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-800/40 text-xs sm:text-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-white">
                      {idx + 1}-Savol
                    </span>
                    <button
                      onClick={async () => {
                        if (confirm('Ushbu savolni o‘chirasizmi?')) {
                          await deleteQuestion(q.id);
                        }
                      }}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="font-semibold text-stone-900 dark:text-white">
                    <MathRenderer content={q.prompt} />
                  </div>

                  {q.mathFormula && (
                    <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl text-center border border-stone-200/60 dark:border-stone-700">
                      <MathRenderer content={q.mathFormula} block />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = q.correctAnswerIndex === oIdx;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{['A', 'B', 'C', 'D'][oIdx]}.</span>
                            <MathRenderer content={opt} />
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase">
                              To‘g‘ri ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="text-xs text-stone-500 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200/60 dark:border-stone-800">
                      <span className="font-bold text-rose-600">Yechim:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 text-center text-xs text-stone-500">
          Hozircha testlar yo‘q. Yuqoridagi "Yangi Test Qo‘shish" tugmasini bosing.
        </div>
      )}

      {/* Add Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button onClick={() => setShowTestModal(false)} className="absolute top-4 right-4 text-stone-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Yangi Test Sinovi Yaratish
            </h3>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Test Nomi *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Masalan, Milliy Sertifikat Mock Test №2"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Tavsifi</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Test formati va mezonlari..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Test Turi</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    <option value="mock">Milliy Sertifikat Mock</option>
                    <option value="quiz">Mavzuli Quiz</option>
                    <option value="diagnostic">Diagnostik Test</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Talab Etiladigan VIP</label>
                  <select
                    value={vipTier}
                    onChange={e => setVipTier(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    <option value="free">Hamma uchun ochiq</option>
                    <option value="start">START</option>
                    <option value="gold">GOLD</option>
                    <option value="platinum">PLATINUM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Vaqt (Daqiqa)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Maksimal Ball</label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={e => setMaxScore(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-semibold mt-2"
              >
                Testni Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowQuestionModal(false)} className="absolute top-4 right-4 text-stone-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Yangi Savol Qo‘shish
            </h3>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Savol Matni *</label>
                <textarea
                  rows={2}
                  required
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Savolni yozing..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Matematik Formula (LaTeX / KaTeX)</label>
                <input
                  type="text"
                  value={formula}
                  onChange={e => setFormula(e.target.value)}
                  placeholder="x^2 - 7x + 10 = 0"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-stone-700 dark:text-stone-300">Javob Variantlari *</label>
                <input
                  type="text"
                  required
                  placeholder="Variant A"
                  value={optA}
                  onChange={e => setOptA(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent"
                />
                <input
                  type="text"
                  required
                  placeholder="Variant B"
                  value={optB}
                  onChange={e => setOptB(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent"
                />
                <input
                  type="text"
                  placeholder="Variant C"
                  value={optC}
                  onChange={e => setOptC(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent"
                />
                <input
                  type="text"
                  placeholder="Variant D"
                  value={optD}
                  onChange={e => setOptD(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">To‘g‘ri Javob Indeksi</label>
                <select
                  value={correctIdx}
                  onChange={e => setCorrectIdx(parseInt(e.target.value, 10))}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                >
                  <option value={0}>A varianti to‘g‘ri</option>
                  <option value={1}>B varianti to‘g‘ri</option>
                  <option value={2}>C varianti to‘g‘ri</option>
                  <option value={3}>D varianti to‘g‘ri</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Yechim Tushuntirishi</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="O‘quvchilar xatosini tushunishi uchun yechim..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] font-semibold mt-2"
              >
                Savolni Saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
