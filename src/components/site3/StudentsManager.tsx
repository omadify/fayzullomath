import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShieldAlert,
  CheckCircle,
  Ban,
  Award,
  Clock,
  UserCheck,
  Edit2,
  Trash2,
  Plus,
  Sparkles,
  Phone,
  Calendar,
  Save,
  X,
  UserX,
  KeyRound,
  Send,
  Mail,
  Smartphone,
  Wallet,
  ExternalLink
} from 'lucide-react';
import { VIPTier, User } from '../../types';
import { RefreshCw, Database } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SupabaseProfile {
  id: string;
  email: string;
  created_at?: string;
}

export const StudentsManager: React.FC = () => {
  const { db, updateStudentVIP, toggleStudentBlock, updateStudentFull, deleteStudent, refreshDb } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [bonusPointsInput, setBonusPointsInput] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [supabaseProfiles, setSupabaseProfiles] = useState<SupabaseProfile[]>([]);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  // Fetch all registered users directly from Supabase profiles table
  const fetchSupabaseProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && Array.isArray(data)) {
        setSupabaseProfiles(data);
        setSupabaseLoaded(true);
        return;
      }
    } catch (e) {
      console.warn('Direct Supabase profiles fetch error, trying backend proxy:', e);
    }

    // Fallback to backend /api/supabase/profiles proxy
    try {
      const res = await fetch('/api/supabase/profiles');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSupabaseProfiles(json.data);
        setSupabaseLoaded(true);
      }
    } catch (err) {
      console.warn('Fallback profiles fetch error:', err);
    }
  };

  useEffect(() => {
    fetchSupabaseProfiles();
    refreshDb();
    const interval = setInterval(() => {
      fetchSupabaseProfiles();
      refreshDb();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSupabaseProfiles(), refreshDb()]);
    setTimeout(() => setRefreshing(false), 600);
  };

  // Helper to construct a full Student representation from a Supabase profile
  const formatStudentFromProfile = (profile: SupabaseProfile): User => {
    // Check if matched in local db.users by id or email
    const localMatch = (db.users || []).find(
      u => u.id === profile.id || (u.email && u.email.toLowerCase() === profile.email.toLowerCase())
    );

    if (localMatch) {
      return {
        ...localMatch,
        id: profile.id,
        email: profile.email || localMatch.email,
        registeredAt: localMatch.registeredAt || profile.created_at || new Date().toISOString()
      };
    }

    // Extract name and phone from email
    const emailPrefix = (profile.email || '').split('@')[0] || 'O‘quvchi';
    const isDigitsOnly = /^\d+$/.test(emailPrefix);
    const displayName = isDigitsOnly
      ? `O‘quvchi (${emailPrefix})`
      : emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    return {
      id: profile.id,
      name: displayName,
      surname: '',
      phone: isDigitsOnly ? emailPrefix : '+998 90 000 00 00',
      additionalPhone: '',
      email: profile.email,
      telegramUsername: isDigitsOnly ? '' : emailPrefix,
      balance: 0,
      region: 'Toshkent',
      vipTier: 'free',
      vipExpiresAt: undefined,
      isBlocked: false,
      role: 'student',
      registeredAt: profile.created_at || new Date().toISOString(),
      completedLessons: []
    };
  };

  // Merge Supabase profiles + local registered students cleanly (No duplicate IDs or keys)
  const studentsById = new Map<string, User>();
  const emailToStudentId = new Map<string, string>();

  // 1. Add all Supabase profiles first (authoritative auth identities)
  supabaseProfiles.forEach(p => {
    const student = formatStudentFromProfile(p);
    studentsById.set(p.id, student);
    if (p.email) {
      emailToStudentId.set(p.email.trim().toLowerCase(), p.id);
    }
  });

  // 2. Merge local registered students (excluding owner)
  (db.users || []).forEach(u => {
    if (u.role === 'owner') return;
    const uEmail = (u.email || '').trim().toLowerCase();
    const matchId = (uEmail && emailToStudentId.get(uEmail)) || (studentsById.has(u.id) ? u.id : undefined);

    if (matchId && studentsById.has(matchId)) {
      const existing = studentsById.get(matchId)!;
      studentsById.set(matchId, {
        ...existing,
        ...u,
        id: matchId, // canonical unique ID
        email: existing.email || u.email
      });
    } else {
      studentsById.set(u.id, u);
      if (uEmail) {
        emailToStudentId.set(uEmail, u.id);
      }
    }
  });

  // Distinct guaranteed unique students list
  const students = Array.from(studentsById.values());

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (s.name || '').toLowerCase().includes(q) ||
      (s.surname || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q) ||
      (s.additionalPhone || '').includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.telegramUsername || '').toLowerCase().includes(q) ||
      (s.region || '').toLowerCase().includes(q);
    const matchesTier = selectedTierFilter === 'all' || s.vipTier === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  const handleStartEdit = (student: User) => {
    setEditingStudent(student);
    setEditForm({
      id: student.id,
      name: student.name,
      surname: student.surname || '',
      phone: student.phone,
      additionalPhone: student.additionalPhone || '',
      email: student.email || '',
      telegramUsername: student.telegramUsername || '',
      balance: student.balance || 0,
      region: student.region || 'Toshkent',
      vipTier: student.vipTier,
      vipExpiresAt: student.vipExpiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
      isBlocked: !!student.isBlocked
    });
    setBonusPointsInput(0);
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    setSaving(true);
    try {
      await updateStudentFull({
        ...editForm,
        telegramUsername: editForm.telegramUsername?.replace(/^@/, ''),
        balance: Number(editForm.balance) || 0,
        bonusPoints: Number(bonusPointsInput) || 0
      });
      setSuccessMsg(`${editForm.name} ma’lumotlari (Telegram/Hisob/Telefon) muvaffaqiyatli yangilandi!`);
      setEditingStudent(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`${name} ni platformadan o‘chirmoqchimisiz?`)) {
      await deleteStudent(id);
    }
  };

  const handleToggleBlock = async (id: string) => {
    await toggleStudentBlock(id);
  };

  const totalCompletedLessons = students.reduce((acc, s) => acc + (s.completedLessons?.length || 0), 0);
  const totalVipCount = students.filter(s => s.vipTier !== 'start' && s.vipTier !== 'free').length;
  const totalBalances = students.reduce((acc, s) => acc + (s.balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>👥 O‘quvchilar & Balans Boshqaruvi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            Ro‘yxatdan O‘tgan O‘quvchilarni To‘liq Boshqarish
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            O‘quvchilarning Telegram username, telefon, qo‘shimcha raqam, email, VIP tarifi va hamyon balansini to‘liq nazorat qilish.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-rose-500' : ''}`} />
            <span>{refreshing ? 'Yangilanmoqda...' : '🔄 Ro‘yxatni Yangilash'}</span>
          </button>

          {successMsg && (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </span>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">Jami O‘quvchilar</div>
          <div className="text-2xl font-black text-stone-900 dark:text-white mt-1 tabular-nums">
            {students.length} nafar
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">Jami Hamyon Balanslari</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums font-mono">
            {totalBalances.toLocaleString()} so‘m
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">Faol VIP O‘quvchilar</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            {totalVipCount} nafar
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">O‘tilgan Darslar Jami</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {totalCompletedLessons} ta
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Ism, telefon, @telegram, email yoki viloyat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-semibold">Tarif:</span>
          <select
            value={selectedTierFilter}
            onChange={e => setSelectedTierFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
          >
            <option value="all">Barchasi</option>
            <option value="free">FREE</option>
            <option value="start">START</option>
            <option value="gold">GOLD</option>
            <option value="platinum">PLATINUM</option>
            <option value="individual">INDIVIDUAL</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200/80 dark:border-stone-800 text-stone-500">
              <tr>
                <th className="py-3.5 px-4 font-semibold">O‘quvchi</th>
                <th className="py-3.5 px-4 font-semibold">Telegram</th>
                <th className="py-3.5 px-4 font-semibold">Telefonlar & Email</th>
                <th className="py-3.5 px-4 font-semibold">💰 Balans</th>
                <th className="py-3.5 px-4 font-semibold">VIP Tarif</th>
                <th className="py-3.5 px-4 font-semibold">Holat</th>
                <th className="py-3.5 px-4 font-semibold text-right">To‘liq Boshqarish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredStudents.map(student => {
                const isBlocked = student.isBlocked;
                const cleanTg = (student.telegramUsername || '').replace(/^@/, '');

                return (
                  <tr key={student.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {student.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{student.name} {student.surname}</span>
                            {supabaseProfiles.some(p => p.id === student.id || (p.email && student.email && p.email.toLowerCase() === student.email.toLowerCase())) && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                ⚡ Supabase
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 font-normal">
                            {student.region || 'Toshkent'} · {new Date(student.registeredAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {cleanTg ? (
                        <a
                          href={`https://t.me/${cleanTg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>@{cleanTg}</span>
                        </a>
                      ) : (
                        <span className="text-stone-400 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-mono font-bold text-stone-800 dark:text-stone-200">
                        {student.phone}
                      </div>
                      {student.additionalPhone && (
                        <div className="text-[10px] font-mono text-stone-500">
                          📞 {student.additionalPhone}
                        </div>
                      )}
                      {student.email && (
                        <div className="text-[10px] text-stone-500 truncate max-w-[150px]">
                          ✉️ {student.email}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                        {(student.balance || 0).toLocaleString()} so‘m
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                        {student.vipTier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                          <Ban className="w-3 h-3" /> Bloklangan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" /> Faol
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleStartEdit(student)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                        title="Tahrirlash & Boshqarish"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Tahrirlash</span>
                      </button>

                      <button
                        onClick={() => handleToggleBlock(student.id)}
                        className={`p-1.5 rounded-lg border transition-colors inline-flex items-center ${
                          isBlocked
                            ? 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                            : 'border-red-200 text-red-600 hover:bg-red-50'
                        }`}
                        title={isBlocked ? 'Blokdan chiqarish' : 'Bloklash'}
                      >
                        {isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-red-600 hover:border-red-300 transition-colors inline-flex items-center"
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

      {/* Full Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-rose-500" />
                <span>O‘quvchini To‘liq Tahrirlash: {editingStudent.name}</span>
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Ism:</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Familiya:</label>
                  <input
                    type="text"
                    value={editForm.surname}
                    onChange={e => setEditForm({ ...editForm, surname: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    📱 Asosiy Telefon (Login):
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    📞 Qo‘shimcha Telefon (Ixtiyoriy):
                  </label>
                  <input
                    type="text"
                    placeholder="Qo‘shimcha raqam (majburiy emas)"
                    value={editForm.additionalPhone || ''}
                    onChange={e => setEditForm({ ...editForm, additionalPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    ✈️ Telegram Username (@username):
                  </label>
                  <input
                    type="text"
                    placeholder="foydalanuvchi_nomi"
                    value={editForm.telegramUsername || ''}
                    onChange={e => setEditForm({ ...editForm, telegramUsername: e.target.value.replace(/^@/, '') })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-mono text-sky-600 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    ✉️ Email (Ixtiyoriy):
                  </label>
                  <input
                    type="email"
                    placeholder="email@misol.uz (majburiy emas)"
                    value={editForm.email || ''}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40">
                <div>
                  <label className="font-black text-emerald-800 dark:text-emerald-300 block mb-1">
                    💰 Hamyon Balansi (so‘m):
                  </label>
                  <input
                    type="number"
                    value={editForm.balance ?? 0}
                    onChange={e => setEditForm({ ...editForm, balance: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 font-mono font-black text-emerald-700 dark:text-emerald-300 bg-white dark:bg-stone-900"
                  />
                </div>

                <div>
                  <label className="font-black text-amber-800 dark:text-amber-300 block mb-1">
                    ⭐ Bonus Ball Qo‘shish:
                  </label>
                  <input
                    type="number"
                    placeholder="+100 ball"
                    value={bonusPointsInput || ''}
                    onChange={e => setBonusPointsInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 font-mono font-bold text-amber-600 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Viloyat / Hudud:</label>
                  <input
                    type="text"
                    value={editForm.region}
                    onChange={e => setEditForm({ ...editForm, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">VIP Tarif:</label>
                  <select
                    value={editForm.vipTier}
                    onChange={e => setEditForm({ ...editForm, vipTier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-bold uppercase text-rose-600"
                  >
                    <option value="free">FREE</option>
                    <option value="start">START</option>
                    <option value="gold">GOLD</option>
                    <option value="platinum">PLATINUM</option>
                    <option value="individual">INDIVIDUAL</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Foydalanuvchi Holati:
                </span>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isBlocked: !editForm.isBlocked })}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    editForm.isBlocked
                      ? 'bg-red-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {editForm.isBlocked ? 'Bloklangan' : 'Faol (Ruxsat etilgan)'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-500 cursor-pointer"
                >
                  Bekor Qilish
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
                >
                  {saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni Saqlash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
