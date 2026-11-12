import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Calendar,
  Clock,
  Sparkles,
  Award,
  CheckCircle,
  Bell,
  ArrowRight,
  ShieldAlert,
  Flame,
  HelpCircle
} from 'lucide-react';
import { ThematicOlympiad } from '../../types';

export const ThematicOlympiadsSection: React.FC = () => {
  const { db } = useApp();
  const [reminderSet, setReminderSet] = useState(false);

  const olympiad = db.thematicOlympiad;

  // Countdown timer logic
  const targetDateStr = olympiad?.nextTest?.targetDate || new Date(Date.now() + 4 * 86400000).toISOString();

  const calculateTimeLeft = () => {
    const difference = new Date(targetDateStr).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  if (!olympiad) return null;

  return (
    <div className="space-y-8">
      {/* SECTION 1: O‘TGAN MAVZUMIY TEST NATIJALARI (3 NAFAR G‘OLIB) */}
      <div className="bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{olympiad.season}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {olympiad.title} — G‘oliblar Shoxsupasi
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
              {olympiad.description} Faqatgina eng yuqori ball to‘plagan 3 nafar g‘olib rasmiy natijalari:
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0 self-start sm:self-center">
            ✓ Natijalar Tasdiqlangan
          </span>
        </div>

        {/* 3 WINNERS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {olympiad.winners.map(winner => {
            const isGold = winner.rank === 1;
            const isSilver = winner.rank === 2;
            const isBronze = winner.rank === 3;

            return (
              <div
                key={winner.rank}
                className={`rounded-2xl p-6 border flex flex-col justify-between transition-all relative ${
                  isGold
                    ? 'bg-gradient-to-b from-amber-500/15 via-white dark:via-stone-900 to-white dark:to-stone-900 border-amber-400 shadow-md scale-100 md:-translate-y-1'
                    : isSilver
                    ? 'bg-white dark:bg-stone-900/90 border-slate-300 dark:border-slate-700 shadow-xs'
                    : 'bg-white dark:bg-stone-900/90 border-amber-700/30 dark:border-amber-800/40 shadow-xs'
                }`}
              >
                {/* Rank Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isGold
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : isSilver
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {isGold ? '🥇 1-O‘rin (Oltin)' : isSilver ? '🥈 2-O‘rin (Kumush)' : '🥉 3-O‘rin (Bronza)'}
                  </span>
                  <div className="text-lg font-black text-stone-900 dark:text-white tabular-nums">
                    {winner.score}
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={winner.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={winner.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-200 dark:border-stone-700 shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                      {winner.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">{winner.region}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block leading-snug">
                    {winner.award}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: KEYINGI BO‘LADIGAN TEST & JONLI TESKARI SANOQ SOATI */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Info Side */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Keyingi Bo‘ladigan Musobaqa</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {olympiad.nextTest.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
              {olympiad.nextTest.rules}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>{new Date(olympiad.nextTest.targetDate).toLocaleDateString('uz-UZ', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              <span>·</span>
              <span>{olympiad.nextTest.questionsCount} ta savol</span>
              <span>·</span>
              <span>{olympiad.nextTest.durationMinutes} daqiqa</span>
              <span>·</span>
              <span className="font-bold text-amber-400">{olympiad.nextTest.prizePool}</span>
            </div>
          </div>

          {/* Countdown Clock Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0 flex flex-col items-center">
            <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-3">
              Boshlanishiga Qoldi:
            </span>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
              {/* Days */}
              <div className="bg-black/30 rounded-xl p-3 min-w-[58px] sm:min-w-[68px]">
                <div className="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-stone-400 font-bold uppercase mt-1">Kun</div>
              </div>
              {/* Hours */}
              <div className="bg-black/30 rounded-xl p-3 min-w-[58px] sm:min-w-[68px]">
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-stone-400 font-bold uppercase mt-1">Soat</div>
              </div>
              {/* Minutes */}
              <div className="bg-black/30 rounded-xl p-3 min-w-[58px] sm:min-w-[68px]">
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-stone-400 font-bold uppercase mt-1">Daqiqa</div>
              </div>
              {/* Seconds */}
              <div className="bg-black/30 rounded-xl p-3 min-w-[58px] sm:min-w-[68px]">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-stone-400 font-bold uppercase mt-1">Soniya</div>
              </div>
            </div>

            <button
              onClick={() => setReminderSet(!reminderSet)}
              className={`mt-4 w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs ${
                reminderSet
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#F95738] hover:bg-[#E04828] text-white'
              }`}
            >
              {reminderSet ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Eslatma Qo‘yildi ✓</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Ishtirok Etish / Eslatma Qo‘yish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
