import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Search,
  Filter,
  CheckCircle,
  PlayCircle,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Star
} from 'lucide-react';
import { StudentLeaderboardEntry } from '../../types';

export const StudentLeaderboardView: React.FC = () => {
  const { db, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const leaderboard = db.studentLeaderboard || [];

  // Regions list for filter
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

  // Find current user in leaderboard or assign a simulated rank
  const myEntry = leaderboard.find(
    e => currentUser && e.studentName.toLowerCase().includes(currentUser.name.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 dark:border-amber-400/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>O‘quvchilar Milliy Reytingi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Akademiya Yetakchilari Shoxsupasi
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
            Darslarni ko‘rish, testlarni a’lo darajada topshirish va muntazamlik (streak) evaziga to‘plangan umumiy ballar reytingi. Top-3 o‘quvchi har oy qimmatbaho sovg‘alar va OTM grantlari bilan taqdirlanadi!
          </p>
        </div>

        {/* My Rank Highlight Card */}
        <div className="mt-6 pt-6 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
              #{myEntry ? myEntry.rank : '4'}
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-white">
                Sizning O‘rningiz: #{myEntry ? myEntry.rank : '4-o‘rin'} ({currentUser?.name || 'Jasurbek'})
              </div>
              <div className="text-[11px] text-stone-500">
                To‘plagan balingiz: <span className="font-bold text-rose-600 dark:text-rose-400">{myEntry ? myEntry.points : 2590} ball</span> · Keyingi pog‘onagacha: +120 ball
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              {myEntry ? myEntry.streakDays : 28} kunlik muntazamlik
            </span>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* 2nd Place (Silver) */}
        {top3[1] && (
          <div className="order-2 md:order-1 bg-white dark:bg-stone-900/90 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative group hover:border-stone-400 transition-all md:mt-6">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-600 text-stone-900 dark:text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white dark:border-stone-800">
              2
            </div>
            <img
              src={top3[1].avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
              alt={top3[1].studentName}
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600 shadow-sm mb-3"
            />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-1">
              🥈 Kumush Pog‘ona
            </span>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              {top3[1].studentName}
            </h3>
            <p className="text-xs text-stone-500 mb-3">{top3[1].region}</p>
            <div className="text-xl font-black text-slate-700 dark:text-slate-200 tabular-nums">
              {top3[1].points} ball
            </div>
            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 w-full flex items-center justify-around text-[11px] text-stone-500">
              <span>{top3[1].solvedTestsCount} test</span>
              <span>·</span>
              <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                <Flame className="w-3 h-3" /> {top3[1].streakDays} kun
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (Gold Champion) */}
        {top3[0] && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-white dark:via-stone-900 to-white dark:to-stone-900 border-2 border-amber-400 dark:border-amber-500/60 rounded-3xl p-7 shadow-lg flex flex-col items-center text-center relative group hover:shadow-xl transition-all scale-100 md:-translate-y-2">
            <div className="absolute -top-6 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950 font-black text-lg flex items-center justify-center shadow-lg border-2 border-white dark:border-stone-800 animate-bounce">
              👑
            </div>
            <img
              src={top3[0].avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'}
              alt={top3[0].studentName}
              className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-md mb-3"
            />
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1">
              🥇 #1 Mutlaq Chempion
            </span>
            <h3 className="font-extrabold text-lg text-stone-900 dark:text-white">
              {top3[0].studentName}
            </h3>
            <p className="text-xs text-stone-500 mb-3">{top3[0].region}</p>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {top3[0].points} ball
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 dark:border-stone-800 w-full flex items-center justify-around text-xs text-stone-600 dark:text-stone-300 font-medium">
              <span>{top3[0].solvedTestsCount} ta test</span>
              <span>·</span>
              <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> {top3[0].streakDays} kun streak
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {top3[2] && (
          <div className="order-3 bg-white dark:bg-stone-900/90 border-2 border-amber-600/30 dark:border-amber-700/40 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative group hover:border-amber-600/50 transition-all md:mt-8">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white dark:border-stone-800">
              3
            </div>
            <img
              src={top3[2].avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
              alt={top3[2].studentName}
              className="w-20 h-20 rounded-full object-cover border-4 border-amber-700/50 shadow-sm mb-3"
            />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 mb-1">
              🥉 Bronza Pog‘ona
            </span>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              {top3[2].studentName}
            </h3>
            <p className="text-xs text-stone-500 mb-3">{top3[2].region}</p>
            <div className="text-xl font-black text-amber-700 dark:text-amber-500 tabular-nums">
              {top3[2].points} ball
            </div>
            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 w-full flex items-center justify-around text-[11px] text-stone-500">
              <span>{top3[2].solvedTestsCount} test</span>
              <span>·</span>
              <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                <Flame className="w-3 h-3" /> {top3[2].streakDays} kun
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRegion === r
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-300'
              }`}
            >
              {r === 'all' ? 'Barcha Viloyatlar' : r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="O‘quvchini qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
          />
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 text-xs bg-stone-50/50 dark:bg-stone-800/40">
                <th className="py-3.5 px-4 font-semibold w-16">O‘rin</th>
                <th className="py-3.5 px-4 font-semibold">O‘quvchi</th>
                <th className="py-3.5 px-4 font-semibold">Hudud</th>
                <th className="py-3.5 px-4 font-semibold">Darslar</th>
                <th className="py-3.5 px-4 font-semibold">Testlar</th>
                <th className="py-3.5 px-4 font-semibold">Streak</th>
                <th className="py-3.5 px-4 font-semibold">Unvon</th>
                <th className="py-3.5 px-4 font-semibold text-right">Umumiy Ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map(student => {
                const isMe = currentUser && student.studentName.toLowerCase().includes(currentUser.name.toLowerCase());

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors ${
                      isMe ? 'bg-rose-50/60 dark:bg-rose-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      {student.rank === 1 && (
                        <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xs shadow-xs">
                          1
                        </span>
                      )}
                      {student.rank === 2 && (
                        <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600 text-stone-900 dark:text-white font-black flex items-center justify-center text-xs shadow-xs">
                          2
                        </span>
                      )}
                      {student.rank === 3 && (
                        <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          3
                        </span>
                      )}
                      {student.rank > 3 && (
                        <span className="font-bold text-stone-500 px-2">#{student.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={student.studentName}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                        />
                        <div>
                          <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                            <span>{student.studentName}</span>
                            {isMe && (
                              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                                SIZ
                              </span>
                            )}
                          </div>
                          {student.nationalCertScore && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              Sertifikat: {student.nationalCertScore}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-xs">
                      {student.region}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      {student.completedLessonsCount} dars
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      {student.solvedTestsCount} test
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-xs">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        {student.streakDays} kun
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {student.badge}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-sm text-stone-900 dark:text-white tabular-nums">
                      {student.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
