import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteSection } from '../../types';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, CheckCircle, Edit3 } from 'lucide-react';

export const SiteBuilderManager: React.FC = () => {
  const { db, updateSiteSections } = useApp();
  const [sections, setSections] = useState<SiteSection[]>(
    [...db.siteSections]
      .filter(s => s.key !== 'books' && s.key !== 'calendar' && s.key !== 'news' && s.key !== 'achievements')
      .sort((a, b) => a.orderIndex - b.orderIndex)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleVisible = (id: string) => {
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, isVisible: !s.isVisible } : s))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // re-assign orderIndex
    copy.forEach((s, i) => (s.orderIndex = i + 1));
    setSections(copy);
  };

  const handleEditChange = (id: string, field: 'title' | 'subtitle' | 'ctaText', value: string) => {
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveAll = async () => {
    await updateSiteSections(sections);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
            Sayt Konstruktori (No-Code Visual Site Builder)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Sayt 1 (Ochiq sayt) bloklarini qo‘shish, yashirish, qayta tartiblash va matnlarini tahrirlash
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>O‘zgarishlarni Saytda Nashr Qilish</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Bo‘limlar tartibi va matnlari Sayt 1 da darhol yangilandi!</span>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, idx) => {
          const isEditing = editingId === section.id;

          return (
            <div
              key={section.id}
              className={`bg-white dark:bg-stone-900 border rounded-2xl p-5 shadow-xs transition-all ${
                section.isVisible
                  ? 'border-stone-200/80 dark:border-stone-800'
                  : 'border-dashed border-stone-300 dark:border-stone-800 opacity-60 bg-stone-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Order control buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-20 text-stone-500"
                      title="Yuqoriga surish"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-20 text-stone-500"
                      title="Pastga surish"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-400">
                        #{idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        {section.title}
                      </h4>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                        {section.key}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(isEditing ? null : section.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditing ? 'Yopish' : 'Tahrirlash'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleVisible(section.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                      section.isVisible
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    {section.isVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ko‘rinmoqda</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Yashirilgan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Inline Editor Form */}
              {isEditing && (
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Bo‘lim Sarlavhasi
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={e => handleEditChange(section.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Quyi Izoh (Subtitle)
                    </label>
                    <input
                      type="text"
                      value={section.subtitle}
                      onChange={e => handleEditChange(section.id, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  {section.ctaText !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Tugma Matni (CTA)
                      </label>
                      <input
                        type="text"
                        value={section.ctaText}
                        onChange={e => handleEditChange(section.id, 'ctaText', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
