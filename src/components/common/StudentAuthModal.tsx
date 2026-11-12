import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, X, AlertCircle, ArrowRight, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'creator';
  onClose: () => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose
}) => {
  const { unifiedLogin, registerStudent, db } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'creator'>(initialMode);
  const [loginInput, setLoginInput] = useState('+998 90 777 11 22');
  const [creatorCode, setCreatorCode] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [region, setRegion] = useState('Toshkent');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!loginInput.trim()) {
      setErrorMsg('Iltimos, telefon raqam yoki e-mail kiriting');
      setLoading(false);
      return;
    }

    try {
      const res = await unifiedLogin(loginInput);
      if (res.success) {
        setSuccessMsg(res.role === 'owner' ? 'Creator sifatida muvaffaqiyatli kirdingiz!' : 'Kabinetga muvaffaqiyatli kirdingiz!');
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setErrorMsg(res.message || 'Kirishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await unifiedLogin(creatorCode);
      if (res.success && res.role === 'owner') {
        setSuccessMsg('Creator sifatida muvaffaqiyatli kirdingiz!');
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setErrorMsg(res.message || 'Creator kodi noto‘g‘ri');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!name.trim()) {
      setErrorMsg('Iltimos, ismingizni kiriting');
      setLoading(false);
      return;
    }
    if (!identifier.trim()) {
      setErrorMsg('Iltimos, telefon raqam yoki e-mail kiriting');
      setLoading(false);
      return;
    }
    if (!registerPassword || registerPassword.length < 8) {
      setErrorMsg('Parol kamida 8 ta belgidan iborat bo‘lishi shart');
      setLoading(false);
      return;
    }

    try {
      const res = await registerStudent({
        name: name.trim(),
        surname: surname.trim(),
        identifier: identifier.trim(),
        password: registerPassword,
        region
      });
      if (res.success) {
        setSuccessMsg('Muvaffaqiyatli ro‘yxatdan o‘tdingiz!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudentLogin = async (phoneVal: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await unifiedLogin(phoneVal);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Kirishda xatolik');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCreatorLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await unifiedLogin('norintumanim');
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Creator kirishda xatolik');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F95738] to-[#E04828] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              F
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white leading-none">
                Fayzullo Matematika Akademiyasi
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {mode === 'login' ? 'O‘quvchi yoki Creator hisobiga kirish' : mode === 'register' ? 'Yangi o‘quvchi ro‘yxatdan o‘tishi' : 'Creator Super Admin maxfiy kodi'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 mb-6 bg-stone-50 dark:bg-stone-800/50 p-1 rounded-2xl">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Kirish
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Ro‘yxatdan O‘tish
          </button>
          <button
            onClick={() => { setMode('creator'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              mode === 'creator'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Creator</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Regular Login (Supports student phone OR typing creator code directly) */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                Telefon Raqami yoki Creator Kodi *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67 yoki Creator kodi"
                  value={loginInput}
                  onChange={e => setLoginInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white focus:outline-rose-500"
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                O‘quvchilar telefon raqamini, Ustoz esa o‘z maxfiy kodini kiritishi mumkin.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Kirilmoqda...' : 'Tizimga Kirish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Student Registration */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Ism *</label>
                <input
                  type="text"
                  required
                  placeholder="Ismingiz"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Familiya</label>
                <input
                  type="text"
                  placeholder="Familiyangiz"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                Telefon raqam yoki Username / E-mail *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67 yoki e-mail / username"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                Maxfiy Parol * <span className="text-[10px] text-stone-400 font-normal">(kamida 8 ta belgi)</span>
              </label>
              <input
                type="password"
                required
                placeholder="Kamida 8 ta belgi"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Viloyat / Shahar</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Toshkent">Toshkent shahri & viloyati</option>
                <option value="Farg‘ona">Farg‘ona viloyati</option>
                <option value="Samarqand">Samarqand viloyati</option>
                <option value="Namangan">Namangan viloyati</option>
                <option value="Andijon">Andijon viloyati</option>
                <option value="Buxoro">Buxoro viloyati</option>
                <option value="Qashqadaryo">Qashqadaryo viloyati</option>
                <option value="Surxondaryo">Surxondaryo viloyati</option>
                <option value="Xorazm">Xorazm viloyati</option>
                <option value="Navoiy">Navoiy viloyati</option>
                <option value="Jizzax">Jizzax viloyati</option>
                <option value="Sirdaryo">Sirdaryo viloyati</option>
                <option value="Qoraqalpog‘iston">Qoraqalpog‘iston Respublikasi</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Ro‘yxatdan o‘tkazilmoqda...' : 'Ro‘yxatdan O‘tish va Kabinetga Kirish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 3: Creator Secret Code */}
        {mode === 'creator' && (
          <form onSubmit={handleCreatorSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-2xl text-[11px] text-amber-800 dark:text-amber-300">
              <span className="font-bold block mb-0.5">Ustoz & Creator Kirishi</span>
              Fayzullo ustoz uchun maxsus Super Admin boshqaruv paneli. Maxfiy kodni kiriting.
            </div>

            <div>
              <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                Creator Maxfiy Kodi *
              </label>
              <input
                type="password"
                required
                placeholder="Maxfiy parolni kiriting..."
                value={creatorCode}
                onChange={e => setCreatorCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white focus:outline-rose-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>{loading ? 'Tekshirilmoqda...' : 'Creator Sifatida Kirish'}</span>
            </button>
          </form>
        )}

        {/* Quick Test Demo Chips */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-stone-400 font-medium">
              Tezkor sinov uchun tayyor profillar:
            </span>
            <button
              type="button"
              onClick={handleQuickCreatorLogin}
              className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Creator Kirish
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {db.users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickStudentLogin(u.phone)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
              >
                {u.name} ({u.vipTier.toUpperCase()})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
