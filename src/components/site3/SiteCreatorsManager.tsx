import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  Terminal,
  Send,
  Phone,
  Image as ImageIcon,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SiteCreator } from '../../types';

export const SiteCreatorsManager: React.FC = () => {
  const { db, updateSiteCreators } = useApp();
  const [creators, setCreators] = useState<SiteCreator[]>(db.siteCreators || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTechInput, setNewTechInput] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Avatar presets for quick photo selection
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80'
  ];

  const handleFieldChange = (id: string, field: keyof SiteCreator, val: any) => {
    setCreators(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const handleAddTech = (id: string) => {
    const tech = (newTechInput[id] || '').trim();
    if (!tech) return;
    setCreators(prev => prev.map(c => {
      if (c.id === id && !c.technologies.includes(tech)) {
        return { ...c, technologies: [...c.technologies, tech] };
      }
      return c;
    }));
    setNewTechInput(prev => ({ ...prev, [id]: '' }));
  };

  const handleRemoveTech = (id: string, techToRemove: string) => {
    setCreators(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, technologies: c.technologies.filter(t => t !== techToRemove) };
      }
      return c;
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await updateSiteCreators(creators);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      setEditingId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>Sayt Yaratuvchilari & Muhandislar Boshqaruvi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            3 Nafar Dasturchi Profilini Tahrirlash
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Platformani yasagan 3 nafar dasturchining fotosurati, lavozimi, dasturlash tillari, Telegram username va telefon raqamlarini to‘g‘ridan-to‘g‘ri boshqaring.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
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
              <span>{saving ? 'Saqlanmoqda...' : 'Barcha O‘zgarishlarni Saqlash'}</span>
            </>
          )}
        </button>
      </div>

      {/* Creators Cards List */}
      <div className="grid grid-cols-1 gap-8">
        {creators.map((creator, index) => {
          const isEditing = editingId === creator.id || editingId === 'all';

          return (
            <div
              key={creator.id}
              className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-4">
                  <img
                    src={creator.photoUrl}
                    alt={creator.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/30 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Dasturchi #{index + 1}
                    </span>
                    <h3 className="text-lg font-black text-stone-900 dark:text-white">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-stone-500">{creator.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setEditingId(isEditing ? null : creator.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>{isEditing ? 'Yopish' : 'Tahrirlash'}</span>
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Dasturchi Ism-Familiyasi
                  </label>
                  <input
                    type="text"
                    value={creator.name}
                    onChange={(e) => handleFieldChange(creator.id, 'name', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Platformadagi Vazifasi / Roli
                  </label>
                  <input
                    type="text"
                    value={creator.role}
                    onChange={(e) => handleFieldChange(creator.id, 'role', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* Photo URL & Quick presets */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                    <span>Fotosurat Havolasi (URL)</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={creator.photoUrl}
                      onChange={(e) => handleFieldChange(creator.id, 'photoUrl', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-400">Tezkor tanlov:</span>
                    <div className="flex gap-1.5 overflow-x-auto py-1">
                      {avatarPresets.map((preset, pIdx) => (
                        <img
                          key={pIdx}
                          src={preset}
                          alt="preset"
                          onClick={() => handleFieldChange(creator.id, 'photoUrl', preset)}
                          className={`w-7 h-7 rounded-lg object-cover cursor-pointer border-2 transition-transform hover:scale-110 ${
                            creator.photoUrl === preset ? 'border-rose-500' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Telegram Username */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-sky-500" />
                    <span>Telegram Username (belgisiz, masalan: azizbek_dev)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">@</span>
                    <input
                      type="text"
                      value={creator.telegramUsername.replace(/^@/, '')}
                      onChange={(e) => handleFieldChange(creator.id, 'telegramUsername', e.target.value.replace(/^@/, ''))}
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Telefon Raqami (masalan: +998 90 123 45 67)</span>
                  </label>
                  <input
                    type="text"
                    value={creator.phoneNumber}
                    onChange={(e) => handleFieldChange(creator.id, 'phoneNumber', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Muallif Haqida Qisqacha Tavsif (Bio)
                  </label>
                  <textarea
                    rows={2}
                    value={creator.bio}
                    onChange={(e) => handleFieldChange(creator.id, 'bio', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* Technologies / Programming languages */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-rose-500" />
                    <span>Dasturlash Tillari va Texnologiyalar (Taglar)</span>
                  </label>

                  {/* Badges list */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {creator.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium border border-stone-200 dark:border-stone-700"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(creator.id, tech)}
                          className="hover:text-red-500 transition-colors ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add tech tag */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Yangi dasturlash tili yoki texnologiya (masalan: Python, Next.js, Go)..."
                      value={newTechInput[creator.id] || ''}
                      onChange={(e) => setNewTechInput(prev => ({ ...prev, [creator.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech(creator.id);
                        }
                      }}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTech(creator.id)}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Qo‘shish</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
