import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  Send,
  MapPin,
  Shield,
  LogOut,
  CheckCircle,
  Wallet,
  Sparkles,
  ExternalLink,
  Smartphone,
  HelpCircle
} from 'lucide-react';

interface StudentProfileViewProps {
  onNavigateToWallet?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ onNavigateToWallet }) => {
  const { currentUser, updateStudentProfile, logout, db } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [surname, setSurname] = useState(currentUser?.surname || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [additionalPhone, setAdditionalPhone] = useState(currentUser?.additionalPhone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [telegramUsername, setTelegramUsername] = useState(currentUser?.telegramUsername || '');
  const [region, setRegion] = useState(currentUser?.region || 'Toshkent');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const cleanTg = telegramUsername.replace(/^@/, '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      await updateStudentProfile({
        name,
        surname,
        phone,
        additionalPhone,
        email,
        telegramUsername: cleanTg,
        region
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const botUsername = db.telegramBotSettings?.botUsername || 'fayzullo_matematika_bot';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
          <User className="w-3.5 h-3.5" />
          <span>👤 Shaxsiy Kabinet Sozlamalari</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
          Profil, Telegram va Aloqa Sozlamalari
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Telegram username, qo‘shimcha telefon raqami va email manzilingizni boshqaring.
        </p>
      </div>

      {/* Hisob & Hamyon Mini Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">
              💰 Hamyon & Depozit Balansi
            </div>
            <div className="text-2xl sm:text-3xl font-black tabular-nums mt-0.5">
              {(currentUser?.balance || 0).toLocaleString()} <span className="text-sm font-bold">so‘m</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToWallet && (
            <button
              type="button"
              onClick={onNavigateToWallet}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>⚡ Depozit Qilish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={`https://t.me/${botUsername}?start=profile_${currentUser?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Bot</span>
          </a>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        {isSaved && (
          <div className="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-bold">Profilingiz va Telegram sozlamalari muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Section: Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                👤 Ism <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-semibold text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                👤 Familiya <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={surname}
                onChange={e => setSurname(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-semibold text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          {/* Section: Primary Phone */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              📱 Asosiy Telefon Raqam (Kirish Logini) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-mono font-bold text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Section: Telegram Username & Connected info */}
          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-sky-500" />
                <span>✈️ Telegram Username (@foydalanuvchi)</span>
              </label>
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                Bot bilan bog‘lash
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-sky-500">@</span>
              <input
                type="text"
                placeholder="masalan: jasur_matematika"
                value={cleanTg}
                onChange={e => setTelegramUsername(e.target.value.replace(/^@/, ''))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-stone-900 text-xs font-mono font-bold text-stone-900 dark:text-white focus:outline-hidden focus:border-sky-500"
              />
            </div>

            {cleanTg && (
              <div className="flex items-center gap-2 text-[11px] text-sky-700 dark:text-sky-300">
                <span>Havola:</span>
                <a
                  href={`https://t.me/${cleanTg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline font-bold flex items-center gap-0.5"
                >
                  t.me/{cleanTg}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            <p className="text-[10px] text-stone-500 dark:text-stone-400">
              Ushbu Telegram profilingiz bot orqali depozit to‘ldirishda kvitansiya qabul qilish va test natijalari xabarnomasini olish uchun ishlatiladi.
            </p>
          </div>

          {/* Section: Optional Additional Phone & Optional Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                  <span>📞 Qo‘shimcha Telefon Raqami</span>
                </label>
                <span className="text-[10px] text-stone-400 font-medium bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                  Ixtiyoriy
                </span>
              </div>
              <input
                type="tel"
                placeholder="+998 90 000 00 00 (Majburiy emas)"
                value={additionalPhone}
                onChange={e => setAdditionalPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-mono text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Agar asosiy raqamingiz band bo‘lsa, ushbu raqam orqali bog‘lanish uchun.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>✉️ Elektron Pochta (Email)</span>
                </label>
                <span className="text-[10px] text-stone-400 font-medium bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                  Ixtiyoriy
                </span>
              </div>
              <input
                type="email"
                placeholder="misol@gmail.com (Majburiy emas)"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Sertifikat nusxasi va kvitansiyalarni emailga jo‘natish uchun.
              </span>
            </div>
          </div>

          {/* Section: Region */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>📍 Viloyat / Hudud</span>
            </label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
            >
              <option value="Toshkent">Toshkent shahri</option>
              <option value="Toshkent viloyati">Toshkent viloyati</option>
              <option value="Farg‘ona">Farg‘ona viloyati</option>
              <option value="Samarqand">Samarqand viloyati</option>
              <option value="Andijon">Andijon viloyati</option>
              <option value="Namangan">Namangan viloyati</option>
              <option value="Buxoro">Buxoro viloyati</option>
              <option value="Xorazm">Xorazm viloyati</option>
              <option value="Qashqadaryo">Qashqadaryo viloyati</option>
              <option value="Surxondaryo">Surxondaryo viloyati</option>
              <option value="Navoiy">Navoiy viloyati</option>
              <option value="Jizzax">Jizzax viloyati</option>
              <option value="Sirdaryo">Sirdaryo viloyati</option>
              <option value="Qoraqalpog‘iston">Qoraqalpog‘iston Respublikasi</option>
            </select>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={logout}
              className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Kabinetdan Chiqish</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saqlanmoqda...' : '💾 O‘zgarishlarni Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
