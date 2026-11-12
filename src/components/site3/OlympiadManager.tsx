import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Save,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import { ThematicOlympiad, OlympiadWinner } from '../../types';

export const OlympiadManager: React.FC = () => {
  const { db, updateThematicOlympiad } = useApp();
  const current = db.thematicOlympiad;

  const [title, setTitle] = useState(current?.title || '');
  const [season, setSeason] = useState(current?.season || '');
  const [description, setDescription] = useState(current?.description || '');

  // 3 Winners state
  const [winners, setWinners] = useState<OlympiadWinner[]>(current?.winners || [
    { rank: 1, name: 'Shohjahon Abdullayev', score: '99.2 ball', region: 'Toshkent shahri', award: '🥇 1-darajali Oltin Diplom + 100% Grant' },
    { rank: 2, name: 'Madinabonu Karimova', score: '97.8 ball', region: 'Samarqand viloyati', award: '🥈 2-darajali Kumush Diplom' },
    { rank: 3, name: 'Diyorbek Rustamov', score: '96.5 ball', region: 'Farg‘ona viloyati', award: '🥉 3-darajali Bronza Diplom' }
  ]);

  // Next Test State
  const [nextTitle, setNextTitle] = useState(current?.nextTest?.title || 'Bahorgi Katta Matematika Saralash Testi');
  const [nextDate, setNextDate] = useState(current?.nextTest?.targetDate ? current.nextTest.targetDate.slice(0, 16) : '');
  const [nextRules, setNextRules] = useState(current?.nextTest?.rules || '');
  const [nextQuestions, setNextQuestions] = useState(current?.nextTest?.questionsCount || 35);
  const [nextDuration, setNextDuration] = useState(current?.nextTest?.durationMinutes || 120);
  const [nextPrize, setNextPrize] = useState(current?.nextTest?.prizePool || '15 000 000 so‘m');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateWinner = (index: number, field: keyof OlympiadWinner, value: any) => {
    const copy = [...winners];
    copy[index] = { ...copy[index], [field]: value };
    setWinners(copy);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: ThematicOlympiad = {
        id: current?.id || 'olymp-' + Date.now(),
        title,
        season,
        description,
        winners,
        nextTest: {
          title: nextTitle,
          targetDate: new Date(nextDate || Date.now() + 4 * 86400000).toISOString(),
          rules: nextRules,
          questionsCount: Number(nextQuestions),
          durationMinutes: Number(nextDuration),
          prizePool: nextPrize,
          isRegistrationOpen: true
        }
      };

      await updateThematicOlympiad(payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Mavzumiy Testlar & Musobaqalar Sozlamasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            Olimpiada G‘oliblari & Teskari Sanoq Soati
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Kuzgi/bahorgi test g‘oliblari (3 nafar o‘quvchi natijalari) va keyingi bo‘ladigan testning teskari sanoq soatini tahrirlang.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-center"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-white" />
              <span>Muvaffaqiyatli Saqlandi!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni Saqlash'}</span>
            </>
          )}
        </button>
      </div>

      {/* 1. O‘tgan Saralash Testi va 3 G‘olib */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>O‘tgan Mavzumiy Test Natijalari (3 nafar g‘olib)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Musobaqa Nomi:
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Mavsum / Fasl:
            </label>
            <input
              type="text"
              value={season}
              onChange={e => setSeason(e.target.value)}
              placeholder="Masalan: Kuzgi Saralash Testi"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700"
            />
          </div>
        </div>

        {/* 3 Winners Edit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {winners.map((w, idx) => (
            <div
              key={w.rank}
              className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-3"
            >
              <div className="font-black text-xs text-amber-600 uppercase">
                {w.rank === 1 ? '🥇 1-O‘rin (Oltin)' : w.rank === 2 ? '🥈 2-O‘rin (Kumush)' : '🥉 3-O‘rin (Bronza)'}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-0.5">Ism-Familiyasi:</label>
                <input
                  type="text"
                  value={w.name}
                  onChange={e => handleUpdateWinner(idx, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-0.5">To‘plagan Bali:</label>
                <input
                  type="text"
                  value={w.score}
                  onChange={e => handleUpdateWinner(idx, 'score', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 font-bold text-rose-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-0.5">Viloyati:</label>
                <input
                  type="text"
                  value={w.region}
                  onChange={e => handleUpdateWinner(idx, 'region', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-0.5">Mukofot & Diplom:</label>
                <input
                  type="text"
                  value={w.award}
                  onChange={e => handleUpdateWinner(idx, 'award', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Keyingi Bo‘ladigan Test & Teskari Sanoq Soati */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-600" />
          <span>Keyingi Bo‘ladigan Test va Jonli Teskari Sanoq Soati Sozlamasi</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Test Nomi:
            </label>
            <input
              type="text"
              value={nextTitle}
              onChange={e => setNextTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Boshlanish Sanasi va Vaqti (Teskari sanoq shu vaqtgacha ishlaydi):
            </label>
            <input
              type="datetime-local"
              value={nextDate}
              onChange={e => setNextDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
            Qoidalari va Tavsifi:
          </label>
          <textarea
            rows={2}
            value={nextRules}
            onChange={e => setNextRules(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Savollar Soni:
            </label>
            <input
              type="number"
              value={nextQuestions}
              onChange={e => setNextQuestions(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Davomiyligi (Daqiqa):
            </label>
            <input
              type="number"
              value={nextDuration}
              onChange={e => setNextDuration(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Sovrin Jamg‘armasi:
            </label>
            <input
              type="text"
              value={nextPrize}
              onChange={e => setNextPrize(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-amber-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
