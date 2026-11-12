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
  HelpCircle,
  Gift,
  ShieldCheck
} from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';

interface PublicThematicOlympiadSectionProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const PublicThematicOlympiadSection: React.FC<PublicThematicOlympiadSectionProps> = ({ onOpenAuth }) => {
  const { db, setActiveSite } = useApp();
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
    <section id="thematic-olympiad" className="py-20 bg-transparent border-b border-stone-200/40 dark:border-stone-800/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AnimatedSticker symbol="🏆" size="sm" />
            <span>Mavsumiy Testlar & Rasmiy Olimpiada</span>
            <AnimatedSticker symbol="🔥" size="sm" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight flex items-center justify-center gap-2 flex-wrap">
            <span>Mavzumiy Saralash Testi & Jonli Sanoq Soati</span>
            <AnimatedSticker symbol="⏳" size="sm" />
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
            {olympiad.description} Quyida o‘tgan mavsumiy saralashning 3 nafar mutlaq g‘oliblari va navbatdagi katta musobaqaga qolgan aniq vaqt ko‘rsatilgan.
          </p>
        </div>

        {/* 1. O‘TGAN TEST G‘OLIBLARI (3 NAFAR G‘OLIB SHOXSUPASI) */}
        <div className="bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                {olympiad.season}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1.5">
                {olympiad.title} — 3 Nafar G‘olib Natijasi
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Rasmiy Tasdiqlangan Natijalar</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {olympiad.winners.map((winner) => {
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
                      ? 'bg-white dark:bg-stone-900 border-slate-300 dark:border-slate-700 shadow-xs'
                      : 'bg-white dark:bg-stone-900 border-amber-700/30 dark:border-amber-800/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                        isGold
                          ? 'bg-amber-400 text-amber-950'
                          : isSilver
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      <AnimatedSticker symbol={isGold ? '🥇' : isSilver ? '🥈' : '🥉'} size="sm" />
                      <span>{winner.rank}-o‘rin</span>
                    </span>
                    <Award
                      className={`w-5 h-5 ${
                        isGold
                          ? 'text-amber-500'
                          : isSilver
                          ? 'text-slate-400'
                          : 'text-amber-700'
                      }`}
                    />
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-stone-900 dark:text-white mb-1">
                      {winner.name}
                    </h4>
                    <p className="text-xs text-stone-500 mb-3">{winner.region}</p>

                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-3 mb-3 flex items-center justify-between">
                      <span className="text-xs text-stone-500">To‘plagan Bali:</span>
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                        {winner.score}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/70 p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-700/50 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{winner.award}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. KEYINGI TEST VA JONLI TESKARI SANOQ SOATI */}
        {olympiad.nextTest && (
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-800 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Details */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Navbatdagi Katta Sinov</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {olympiad.nextTest.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                  {olympiad.nextTest.rules}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                    <div className="text-base sm:text-lg font-black text-amber-400">
                      {olympiad.nextTest.prizePool}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">
                      Sovrin Jamg‘armasi
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                    <div className="text-base sm:text-lg font-black text-white">
                      {olympiad.nextTest.questionsCount} ta
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">
                      Savollar Soni
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                    <div className="text-base sm:text-lg font-black text-white">
                      {olympiad.nextTest.durationMinutes} daqiqa
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">
                      Rasmiy Vaqt
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => onOpenAuth ? onOpenAuth('register') : setActiveSite('site2_lms')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Testga Ro‘yxatdan O‘tish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setReminderSet(true)}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>{reminderSet ? '✓ Eslatma Saqlandi' : 'Eslatma Qo‘yish'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Countdown Clock */}
              <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xs flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Clock className="w-4 h-4 animate-spin text-rose-400" />
                  <span>Jonli Teskari Sanoq Soati</span>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full mb-4">
                  <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold mt-1">Kun</span>
                  </div>

                  <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold mt-1">Soat</span>
                  </div>

                  <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold mt-1">Daqiqa</span>
                  </div>

                  <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 flex flex-col items-center bg-rose-950/30 border-rose-900/40">
                    <span className="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums animate-pulse">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-rose-300 uppercase font-semibold mt-1">Sekund</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Imtihon Sanasi: {new Date(targetDateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            {/* Ambient background blur */}
            <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}
      </div>
    </section>
  );
};
