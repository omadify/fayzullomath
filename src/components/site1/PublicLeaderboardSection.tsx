import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';
import { StudentLeaderboardEntry } from '../../types';

interface PublicLeaderboardSectionProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const PublicLeaderboardSection: React.FC<PublicLeaderboardSectionProps> = ({ onOpenAuth }) => {
  const { db, setActiveSite } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const leaderboard = db.studentLeaderboard || [];
  const regions = ['all', ...Array.from(new Set(leaderboard.map(e => e.region)))];

  const filtered = leaderboard.filter(item => {
    const matchSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRegion = selectedRegion === 'all' || item.region === selectedRegion;
    return matchSearch && matchRegion;
  });

  const top3 = leaderboard.slice(0, 3);
  const others = filtered.filter(item => item.rank > 3);

  return (
    <section id="leaderboard" className="py-20 bg-transparent border-b border-stone-200/40 dark:border-stone-800/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title & Description */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AnimatedSticker symbol="🏆" size="sm" />
            <span>Respublika Yetakchilari Shoxsupasi</span>
            <AnimatedSticker symbol="🔥" size="sm" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight flex items-center justify-center gap-2 flex-wrap">
            <span>Akademiya O‘quvchilari Milliy Reytingi</span>
            <AnimatedSticker symbol="🔥" size="md" />
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
            Darslarni ko‘rish, testlarni a’lo darajada topshirish va muntazamlik (streak) evaziga to‘plangan haqiqiy ballar reytingi. Top-3 o‘quvchi har oy OTM grantlari va maxsus sovg‘alar bilan taqdirlanadi!
          </p>
        </div>

        {/* TOP 3 PODIUM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          {/* 2nd Place - Silver */}
          {top3[1] && (
            <div className="order-2 md:order-1 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative group hover:border-slate-400 transition-all">
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-600 text-stone-900 dark:text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white dark:border-stone-800">
                2
              </div>
              <img
                src={top3[1].avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                alt={top3[1].studentName}
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600 shadow-sm mb-3"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <AnimatedSticker symbol="🥈" size="sm" />
                <span>{top3[1].badge}</span>
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                {top3[1].studentName}
              </h3>
              <p className="text-xs text-stone-500 mb-3">{top3[1].region}</p>

              <div className="w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 mb-2 flex items-center justify-between">
                <span className="text-xs text-stone-500">Umumiy Ball:</span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                  {top3[1].points.toLocaleString()} ball
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-stone-500">
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <AnimatedSticker symbol="🔥" size="sm" /> {top3[1].streakDays} kun
                </span>
                <span>·</span>
                <span>Sertifikat: {top3[1].nationalCertScore}</span>
              </div>
            </div>
          )}

          {/* 1st Place - Gold (Hero Podium) */}
          {top3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/15 via-white/90 dark:via-stone-900/90 to-white/90 dark:to-stone-900/90 backdrop-blur-md border-2 border-amber-400 dark:border-amber-500 rounded-3xl p-7 shadow-lg flex flex-col items-center text-center relative group scale-100 md:-translate-y-4">
              <div className="absolute -top-5 w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 font-black text-base flex items-center justify-center shadow-lg border-2 border-white dark:border-stone-900">
                <AnimatedSticker symbol="🏆" size="md" />
              </div>
              <div className="relative mt-2 mb-3">
                <img
                  src={top3[0].avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'}
                  alt={top3[0].studentName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-stone-900">
                  1
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1">
                <AnimatedSticker symbol="👑" size="sm" />
                <span>{top3[0].badge}</span>
              </span>
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                {top3[0].studentName}
              </h3>
              <p className="text-xs text-stone-500 mb-3">{top3[0].region}</p>

              <div className="w-full bg-amber-50/80 dark:bg-amber-950/40 rounded-xl p-3 mb-2 flex items-center justify-between border border-amber-200/50 dark:border-amber-800/40">
                <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">To‘plangan Ball:</span>
                <span className="text-base font-black text-amber-600 dark:text-amber-400">
                  {top3[0].points.toLocaleString()} ball
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 font-semibold">
                <span className="flex items-center gap-1 text-rose-500">
                  <AnimatedSticker symbol="🔥" size="sm" /> {top3[0].streakDays} kun ketma-ket
                </span>
                <span>·</span>
                <span>Sertifikat: {top3[0].nationalCertScore}</span>
              </div>
            </div>
          )}


          {/* 3rd Place - Bronze */}
          {top3[2] && (
            <div className="order-3 bg-white dark:bg-stone-900 border-2 border-amber-700/30 dark:border-amber-800/40 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative group hover:border-amber-700/50 transition-all">
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 font-black text-sm flex items-center justify-center shadow-md border-2 border-white dark:border-stone-800">
                3
              </div>
              <img
                src={top3[2].avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                alt={top3[2].studentName}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-700/30 dark:border-amber-800/40 shadow-sm mb-3"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-1">
                {top3[2].badge}
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                {top3[2].studentName}
              </h3>
              <p className="text-xs text-stone-500 mb-3">{top3[2].region}</p>

              <div className="w-full bg-stone-50 dark:bg-stone-800/40 rounded-xl p-3 mb-2 flex items-center justify-between">
                <span className="text-xs text-stone-500">Umumiy Ball:</span>
                <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                  {top3[2].points.toLocaleString()} ball
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-stone-500">
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" /> {top3[2].streakDays} kun
                </span>
                <span>·</span>
                <span>Sertifikat: {top3[2].nationalCertScore}</span>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH, FILTER & FULL LEADERBOARD TABLE */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Barcha O‘quvchilar Ro‘yxati
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Viloyatlar va ismlar bo‘yicha qidiring yoki saralang
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Ism yoki viloyat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 w-48 sm:w-56"
                />
              </div>

              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                {regions.map(r => (
                  <option key={r} value={r}>
                    {r === 'all' ? 'Barcha Viloyatlar' : r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">O‘rin</th>
                  <th className="py-3 px-3">O‘quvchi</th>
                  <th className="py-3 px-3">Viloyat</th>
                  <th className="py-3 px-3 text-center">Yechilgan Test</th>
                  <th className="py-3 px-3 text-center">Streak</th>
                  <th className="py-3 px-3">Sertifikat</th>
                  <th className="py-3 px-3 text-right">Ball</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map(entry => {
                  const isTop3 = entry.rank <= 3;
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <span
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-black text-xs ${
                            entry.rank === 1
                              ? 'bg-amber-400 text-amber-950'
                              : entry.rank === 2
                              ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                              : entry.rank === 3
                              ? 'bg-amber-700/20 text-amber-800 dark:text-amber-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={entry.studentName}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                              {entry.studentName}
                              {isTop3 && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                            </div>
                            <div className="text-[11px] text-stone-400 font-medium">
                              {entry.badge}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-stone-600 dark:text-stone-300">
                        {entry.region}
                      </td>

                      <td className="py-3.5 px-3 text-center text-stone-600 dark:text-stone-300 font-semibold">
                        {entry.solvedTestsCount} ta
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                          <AnimatedSticker symbol="🔥" size="sm" />
                          <span>{entry.streakDays} kun</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-rose-600 dark:text-rose-400">
                        {entry.nationalCertScore || '90+'}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span className="font-black text-sm text-stone-900 dark:text-white">
                          {entry.points.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-400 block">ball</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action CTA Box at Bottom */}
          <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-stone-900 dark:text-white">
                Siz ham reytingda qatnashib, sovrinlarni yutishni xohlaysizmi?
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Ro‘yxatdan o‘ting, video darslarni ko‘ring va testlarni topshirib o‘z balingizni oshiring!
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenAuth ? onOpenAuth('register') : setActiveSite('site2_lms')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F95738] to-[#E04828] text-white text-xs font-bold hover:shadow-md transition-all flex items-center gap-2"
              >
                <span>Reytingga Qo‘shilish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
