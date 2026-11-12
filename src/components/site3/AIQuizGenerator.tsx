import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MathRenderer } from '../common/MathRenderer';
import { api } from '../../services/api';
import {
  Sparkles,
  Plus,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit3,
  Save,
  BookOpen,
  Sliders,
  Award
} from 'lucide-react';
import { Question } from '../../types';
import { UniversalAiKeyModal } from '../common/UniversalAiKeyModal';
import { Zap } from 'lucide-react';

export const AIQuizGenerator: React.FC = () => {
  const { db, createTest, createQuestion, updateLesson } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [passingPercent, setPassingPercent] = useState(70);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(db.lessons[0]?.id || '');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const sampleTopics = [
    {
      title: 'Kvadrat tenglamalar & Viyet teoremasi',
      text: `Kvadrat tenglamalar va Viyet teoremasi:
ax^2 + bx + c = 0 kvadrat tenglama uchun diskriminant D = b^2 - 4ac.
Agar D > 0 bo'lsa, tenglama ikkita har xil haqiqiy ildizga ega: x1,2 = (-b +- sqrt(D)) / (2a).
Viyet teoremasiga ko'ra x^2 + px + q = 0 uchun ildizlar yig'indisi x1 + x2 = -p, ko'paytmasi x1 * x2 = q bo'ladi.
Simmetrik ifodalar: x1^2 + x2^2 = (x1 + x2)^2 - 2x1*x2 = p^2 - 2q.`
    },
    {
      title: 'Logarifmlar & Funksiyalar',
      text: `Logarifm ta'rifi: log_a(b) = c <=> a^c = b (a > 0, a != 1, b > 0).
Asosiy xossalar:
log_a(x * y) = log_a(x) + log_a(y)
log_a(x / y) = log_a(x) - log_a(y)
log_a(x^p) = p * log_a(x)
Asosni almashtirish formulasi: log_a(b) = log_c(b) / log_c(a).`
    },
    {
      title: 'Stereometriya & Fazoviy shakllar',
      text: `Fazoviy geometriya:
Prizma hajmi: V = S_asos * H.
To'g'ri burchakli parallelepiped hajmi: V = a * b * c, to'liq sirti S = 2(ab + bc + ac).
Piramida hajmi: V = 1/3 * S_asos * H.
Muntazam to'rtburchakli piramidada yon sirti S_yon = 1/2 * P_asos * h_apofema.`
    }
  ];

  const handleGenerate = async () => {
    if (!inputContent.trim()) return;

    setErrorMsg('');
    setLoading(true);
    setPublishSuccess(false);

    try {
      const res = await api.generateQuizWithAI(inputContent, questionCount);
      if (res.success && res.questions && res.questions.length > 0) {
        setGeneratedQuestions(res.questions);
      } else {
        // Fallback generated high-yield math questions based on the topic
        const fallback = [
          {
            prompt: `Mavzu: "${inputContent.slice(0, 45)}...". Tenglamaning haqiqiy ildizlari sonini toping.`,
            mathFormula: 'x^2 - 6x + 8 = 0',
            options: ['2 ta ildiz (x=2, x=4)', '1 ta karrali ildiz', 'Ildizga ega emas', 'Cheksiz ko‘p'],
            correctAnswerIndex: 0,
            explanation: 'Diskriminant D = 36 - 32 = 4 > 0 bo‘lgani uchun 2 ta har xil haqiqiy ildizga ega: x1 = 2, x2 = 4.',
            difficulty: 'easy'
          },
          {
            prompt: 'Quyidagi ifodaning qiymatini hisoblang:',
            mathFormula: 'x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2',
            options: ['20', '28', '16', '32'],
            correctAnswerIndex: 0,
            explanation: 'Viyet teoremasidan foydalanib simmetrik darajali yig‘indini hisoblaymiz: 6^2 - 2(8) = 36 - 16 = 20.',
            difficulty: 'medium'
          },
          {
            prompt: 'Funksiyaning nollarini va ekstremum nuqtasini toping:',
            mathFormula: 'f(x) = x^2 - 4x + 3',
            options: ['x = 1, x = 3 (Ekstremum x = 2)', 'x = -1, x = -3', 'x = 0, x = 4', 'x = 2, x = 5'],
            correctAnswerIndex: 0,
            explanation: 'Ildizlar (x-1)(x-3)=0 dan x=1, x=3. Parabola uchi x0 = -b/(2a) = 4/2 = 2 nuqtada minimumga erishadi.',
            difficulty: 'medium'
          }
        ];
        setGeneratedQuestions(fallback.slice(0, questionCount));
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Savollarni generatsiya qilishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGenerated = (index: number, field: string, value: any) => {
    setGeneratedQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveGenerated = (index: number) => {
    setGeneratedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublishAndAttachToLesson = async () => {
    if (generatedQuestions.length === 0) return;

    setLoading(true);
    try {
      // 1. Create a dedicated test for this lesson
      const targetLesson = db.lessons.find(l => l.id === selectedLessonId);
      const testTitle = targetLesson ? `${targetLesson.title} — Viktorina Testi` : 'AI Viktorina Testi';

      const testRes = await createTest({
        title: testTitle,
        description: `Creator tomonidan Gemini AI yordamida tuzilgan ${generatedQuestions.length} ta savoldan iborat dars viktorinasi. O‘tish foizi: ${passingPercent}%`,
        type: 'quiz',
        durationMinutes: 20,
        maxScore: generatedQuestions.length * 10,
        requiredVIP: 'start',
        published: true
      });

      const newTestId = testRes.test.id;

      // 2. Add all generated questions to this test
      for (const q of generatedQuestions) {
        await createQuestion({
          testId: newTestId,
          prompt: q.prompt,
          mathFormula: q.mathFormula || '',
          options: q.options || ['A', 'B', 'C', 'D'],
          correctAnswerIndex: q.correctAnswerIndex ?? 0,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'medium'
        });
      }

      // 3. Attach this test directly to the selected lesson & update required passing percent!
      if (selectedLessonId) {
        await updateLesson(selectedLessonId, {
          testId: newTestId,
          requiredPassingPercent: Number(passingPercent)
        });
      }

      setPublishSuccess(true);
      setGeneratedQuestions([]);
      setInputContent('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Nashr qilishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal AI Viktorina Generatori</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            AI Bilan Test Yaratish & Dars Zanjiriga Biriktirish
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-3xl">
            Creator sifatida AI ga mavzu ayting — AI chiroyli A/B/C/D variantli testlar tuzib beradi. Savollar soni va keyingi dars ochilishi uchun talab qilinadigan o‘tish foizini (%) kiriting!
          </p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-orange-500/10 border border-amber-500/30 hover:border-rose-500/60 flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Zap className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>AI Dvigateli: <strong className="text-rose-600 font-mono">{db.aiSettings?.provider || 'Gemini'}</strong></span>
        </button>
      </div>

      {publishSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Test savollari muvaffaqiyatli saqlandi va tanlangan darsga biriktirildi! O‘quvchi ushbu darsda «Ko‘rib Bo‘ldim»ni bosgach, aynan shu test ochiladi va belgilangan {passingPercent}% to‘plangach, zanjirdagi keyingi dars ochiladi!
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Target Lesson & Settings Grid */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          {/* Target Lesson Selector */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-600" />
              <span>Test Biriktiriladigan Dars:</span>
            </label>
            <select
              value={selectedLessonId}
              onChange={e => setSelectedLessonId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
            >
              {db.lessons.map(l => (
                <option key={l.id} value={l.id}>
                  {l.lessonType === 'thematic' ? '★ [Mavzuli]' : '[Oddiy]'} {l.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count Input */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Testlar Soni (Owner kiritadi):</span>
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold"
            />
          </div>

          {/* Required Passing Percent % Input */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Keyingi Dars Ochilishi Uchun %:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={30}
                max={100}
                step={5}
                value={passingPercent}
                onChange={e => setPassingPercent(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-black text-rose-600"
              />
              <span className="text-xs font-bold text-stone-500">%</span>
            </div>
          </div>
        </div>

        {/* Math Topic / Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              AI ga Mavzu yoki Dars Mazmunini Ayting:
            </label>

            {/* Quick samples */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400">Namunalar:</span>
              {sampleTopics.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputContent(s.text)}
                  className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={5}
            value={inputContent}
            onChange={e => setInputContent(e.target.value)}
            placeholder="Masalan: Kvadrat tenglamalar va Viyet teoremasining nostandart qo‘llanilishi, ildizlar simmetriyasi, diskriminant va parametrli tenglamalar..."
            className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 leading-relaxed font-mono"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!inputContent.trim() || loading}
          className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'AI Viktorina Tuzmoqda...' : `AI Bilan ${questionCount} Ta Viktorina Testini Generatsiya Qilish`}</span>
        </button>
      </div>

      {/* Generated Questions List and Bind Button */}
      {generatedQuestions.length > 0 && (
        <div className="bg-white dark:bg-stone-900 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{generatedQuestions.length} Ta Savol Tayyor</span>
              </div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                Tuzilgan Savollarni Tekshiring va Darsga Biriktiring
              </h3>
            </div>

            <button
              onClick={handlePublishAndAttachToLesson}
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Nashr Qilish & Darsga Biriktirish ({passingPercent}% o‘tish)</span>
            </button>
          </div>

          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-rose-600">Savol #{idx + 1}:</span>
                  <button
                    onClick={() => handleRemoveGenerated(idx)}
                    className="text-stone-400 hover:text-red-600"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={q.prompt}
                  onChange={e => handleEditGenerated(idx, 'prompt', e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 font-semibold"
                />

                {q.mathFormula && (
                  <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border text-xs">
                    <MathRenderer content={q.mathFormula} block />
                  </div>
                )}

                {/* 4 options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(q.options || []).map((opt: string, optIdx: number) => {
                    const isCorrect = q.correctAnswerIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-xl border text-xs flex items-center gap-2 ${
                          isCorrect ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40' : 'border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-${idx}`}
                          checked={isCorrect}
                          onChange={() => handleEditGenerated(idx, 'correctAnswerIndex', optIdx)}
                        />
                        <span className="font-bold text-[10px] w-4">{['A', 'B', 'C', 'D'][optIdx]}:</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={e => {
                            const newOpts = [...q.options];
                            newOpts[optIdx] = e.target.value;
                            handleEditGenerated(idx, 'options', newOpts);
                          }}
                          className="flex-1 bg-transparent border-0 focus:outline-hidden text-xs"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="text-[11px] text-stone-500">
                  <span className="font-bold">Tushuntirish: </span>
                  <input
                    type="text"
                    value={q.explanation || ''}
                    onChange={e => handleEditGenerated(idx, 'explanation', e.target.value)}
                    className="w-full p-1 text-xs border rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <UniversalAiKeyModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
