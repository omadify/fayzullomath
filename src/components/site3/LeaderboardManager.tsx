import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  Flame,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Search
} from 'lucide-react';
import { StudentLeaderboardEntry } from '../../types';

export const LeaderboardManager: React.FC = () => {
  const { db, updateLeaderboard } = useApp();
  const [leaderboard, setLeaderboard] = useState<StudentLeaderboardEntry[]>(db.studentLeaderboard || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<StudentLeaderboardEntry>>({});
  const [search, setSearch] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Student modal / state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newRegion, setNewRegion] = useState('Toshkent shahri');
  const [newPoints, setNewPoints] = useState(2000);
  const [newBadge, setNewBadge] = useState('Faol O‘quvchi');

  const handleStartEdit = (entry: StudentLeaderboardEntry) => {
    setEditingId(entry.id);
    setEditForm({ ...entry });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const updated = leaderboard.map(item => {
      if (item.id === editingId) {
        return { ...item, ...editForm } as StudentLeaderboardEntry;
      }
      return item;
    });

    // Auto sort by points descending and re-assign ranks
    updated.sort((a, b) => b.points - a.points);
    updated.forEach((item, idx) => {
      item.rank = idx + 1;
      item.tier = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : 'top10';
    });

    setLeaderboard(updated);
    setEditingId(null);
    await updateLeaderboard(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAdjustPoints = async (id: string, delta: number) => {
    const updated = leaderboard.map(item => {
      if (item.id === id) {
        return { ...item, points: Math.max(0, item.points + delta) };
      }
      return item;
    });

    updated.sort((a, b) => b.points - a.points);
    updated.forEach((item, idx) => {
      item.rank = idx + 1;
      item.tier = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : 'top10';
    });

    setLeaderboard(updated);
    await updateLeaderboard(updated);
  };

  const handleDeleteEntry = async (id: string) => {
    const updated = leaderboard.filter(l => l.id !== id);
    updated.forEach((item, idx) => {
      item.rank = idx + 1;
    });
    setLeaderboard(updated);
    await updateLeaderboard(updated);
  };

  const handleAddNewStudent = async () => {
    if (!newStudentName.trim()) return;
    const newEntry: StudentLeaderboardEntry = {
      id: 'lead-' + Date.now(),
      studentName: newStudentName.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      region: newRegion,
      points: Number(newPoints),
      solvedTestsCount: 15,
      streakDays: 10,
      completedLessonsCount: 12,
      nationalCertScore: '90.0 (A)',
      badge: newBadge,
      rank: leaderboard.length + 1,
      tier: 'top10'
    };

    const updated = [...leaderboard, newEntry];
    updated.sort((a, b) => b.points - a.points);
    updated.forEach((item, idx) => {
      item.rank = idx + 1;
      item.tier = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : 'top10';
    });

    setLeaderboard(updated);
    setShowAddModal(false);
    setNewStudentName('');
    await updateLeaderboard(updated);
  };

  const filtered = leaderboard.filter(item =>
    item.studentName.toLowerCase().includes(search.toLowerCase()) ||
    item.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard Boshqaruvi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            O‘quvchilar Reytingini Boshqarish
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Leaderboard faqat o‘quvchilar uchun bo‘lib, Creator o‘quvchilarning ballarini, o‘rinlarini, unvonlarini va yangi o‘quvchilarni to‘liq tahrir qilishi mumkin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Saqlandi
            </span>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>O‘quvchi Qo‘shish</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="O‘quvchini qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 text-xs bg-stone-50/50 dark:bg-stone-800/40">
                <th className="py-3 px-4 font-semibold w-16">O‘rin</th>
                <th className="py-3 px-4 font-semibold">O‘quvchi</th>
                <th className="py-3 px-4 font-semibold">Viloyat</th>
                <th className="py-3 px-4 font-semibold">Ball</th>
                <th className="py-3 px-4 font-semibold">Streak</th>
                <th className="py-3 px-4 font-semibold">Unvon</th>
                <th className="py-3 px-4 font-semibold text-right">Tezkor Ball / Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map(entry => {
                const isEditing = editingId === entry.id;

                if (isEditing) {
                  return (
                    <tr key={entry.id} className="bg-rose-50/40 dark:bg-rose-950/20">
                      <td className="py-3 px-4 font-bold">#{entry.rank}</td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.studentName || ''}
                          onChange={e => setEditForm({ ...editForm, studentName: e.target.value })}
                          className="px-2 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 w-full font-bold"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.region || ''}
                          onChange={e => setEditForm({ ...editForm, region: e.target.value })}
                          className="px-2 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 w-full"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editForm.points || 0}
                          onChange={e => setEditForm({ ...editForm, points: Number(e.target.value) })}
                          className="px-2 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 w-24 font-bold"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editForm.streakDays || 0}
                          onChange={e => setEditForm({ ...editForm, streakDays: Number(e.target.value) })}
                          className="px-2 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 w-16"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.badge || ''}
                          onChange={e => setEditForm({ ...editForm, badge: e.target.value })}
                          className="px-2 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 w-full"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold mr-2"
                        >
                          Saqlash
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-stone-500 text-xs"
                        >
                          Bekor
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={entry.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold">
                      {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                      <img
                        src={entry.avatar}
                        alt={entry.studentName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{entry.studentName}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{entry.region}</td>
                    <td className="py-3 px-4 font-black text-rose-600 dark:text-rose-400 tabular-nums">
                      {entry.points} ball
                    </td>
                    <td className="py-3 px-4 text-amber-600 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{entry.streakDays} kun</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
                        {entry.badge}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {/* Quick point adjustment buttons */}
                      <button
                        onClick={() => handleAdjustPoints(entry.id, 50)}
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        title="+50 ball qo‘shish"
                      >
                        +50
                      </button>
                      <button
                        onClick={() => handleAdjustPoints(entry.id, 100)}
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        title="+100 ball qo‘shish"
                      >
                        +100
                      </button>
                      <button
                        onClick={() => handleAdjustPoints(entry.id, -50)}
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-800 hover:bg-red-200"
                        title="-50 ball ayirish"
                      >
                        -50
                      </button>
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className="p-1 rounded text-stone-400 hover:text-stone-900"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 rounded text-red-400 hover:text-red-600"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              Reytingga Yangi O‘quvchi Qo‘shish
            </h3>
            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">
                Ism-Familiyasi:
              </label>
              <input
                type="text"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                placeholder="Masalan: Sardor Komilov"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Viloyat:</label>
              <input
                type="text"
                value={newRegion}
                onChange={e => setNewRegion(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Boshlang‘ich Ball:</label>
              <input
                type="number"
                value={newPoints}
                onChange={e => setNewPoints(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Unvon / Badge:</label>
              <input
                type="text"
                value={newBadge}
                onChange={e => setNewBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-500"
              >
                Bekor Qilish
              </button>
              <button
                onClick={handleAddNewStudent}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white"
              >
                Qo‘shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
