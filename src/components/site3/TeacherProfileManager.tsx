import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Save,
  CheckCircle,
  Sparkles,
  RefreshCw,
  User,
  Award,
  Phone,
  Send,
  Image as ImageIcon
} from 'lucide-react';

export const TeacherProfileManager: React.FC = () => {
  const { db, updateTeacherProfile } = useApp();
  const current = db.teacherProfile;

  const [name, setName] = useState(current?.name || 'Fayzullo Omanullayev');
  const [title, setTitle] = useState(current?.title || 'Matematika fani bo‘yicha Milliy sertifikat eksperti & Pedagog');
  const [photoUrl, setPhotoUrl] = useState(current?.photoUrl || '');
  const [bio, setBio] = useState(current?.bio || '');
  const [phone, setPhone] = useState(current?.phone || '+998 (90) 123-45-67');
  const [telegram, setTelegram] = useState(current?.telegram || 'https://t.me/fayzullo_math');
  const [experienceYears, setExperienceYears] = useState(current?.experienceYears || 8);
  const [studentsCount, setStudentsCount] = useState(current?.studentsCount || 1450);
  const [nationalCertCount, setNationalCertCount] = useState(current?.nationalCertCount || 215);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (current) {
      if (current.name) setName(current.name);
      if (current.title) setTitle(current.title);
      if (current.photoUrl) setPhotoUrl(current.photoUrl);
      if (current.bio !== undefined) setBio(current.bio);
      if (current.phone) setPhone(current.phone);
      if (current.telegram) setTelegram(current.telegram);
      if (current.experienceYears) setExperienceYears(current.experienceYears);
      if (current.studentsCount) setStudentsCount(current.studentsCount);
      if (current.nationalCertCount) setNationalCertCount(current.nationalCertCount);
    }
  }, [current]);

  // High-definition preset educator portraits for quick selection
  const photoPresets = [
    {
      label: 'Fayzullo Ustoz (Yangi Rasmiy Rasm)',
      url: 'https://i.postimg.cc/GtPm4K25/photo-2026-11-09-19-50-01.jpg'
    },
    {
      label: 'Klassik Kostyumda',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Nafis Ilmiy Pedagog',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Zamonaviy Matematik Ustoz',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Auditoriyada Dars Beruvchi',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateTeacherProfile({
        name,
        title,
        photoUrl,
        bio,
        phone,
        telegram,
        experienceYears: Number(experienceYears),
        studentsCount: Number(studentsCount),
        nationalCertCount: Number(nationalCertCount)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
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
            <Camera className="w-3.5 h-3.5" />
            <span>Ustoz Rasmi & Profil Sozlamasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            Ustozning Rasmi va Ma’lumotlarini O‘zgartirish
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Bu yerdagi o‘zgarishlar darhol butun saytda (kirish sahifasi, ochiq platforma, LMS va sertifikatlar) yangilanadi.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Photo Settings & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-rose-600" />
              <span>Ustozning Fotosurati (Jonli Ko‘rinish)</span>
            </h3>

            {/* Live Portrait Display */}
            <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border-2 border-dashed border-stone-300 dark:border-stone-700 mb-4 group">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                  <User className="w-16 h-16 mb-2" />
                  <span className="text-xs">Rasm kiritilmagan</span>
                </div>
              )}

              {/* Verified badge watermark */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow-sm">
                <span>Rasmiy Ustoz ✓</span>
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-3 mb-5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                Fotosurat URL havolasi:
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 font-mono"
              />
            </div>

            {/* Local file upload */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Yoki kompyuterdan rasm yuklash:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 dark:file:bg-rose-950/40 dark:file:text-rose-300 hover:file:bg-rose-100"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Tayyor professional suratlar:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {photoPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoUrl(preset.url)}
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-rose-500 text-left text-[11px] font-medium transition-colors flex items-center gap-2"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Personal and Academic Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-600" />
              <span>Asosiy Ma’lumotlar</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Ustozning Ism-Familiyasi:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Kasbiy Maqomi / Unvoni:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Biografiya & Tavsif:
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Tajriba (Yil):
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  O‘quvchilar Soni:
                </label>
                <input
                  type="number"
                  value={studentsCount}
                  onChange={e => setStudentsCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Milliy Sertifikat A+:
                </label>
                <input
                  type="number"
                  value={nationalCertCount}
                  onChange={e => setNationalCertCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Telefon Raqami:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Telegram Manzili:
                </label>
                <input
                  type="text"
                  value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
