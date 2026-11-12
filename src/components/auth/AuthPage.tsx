import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Phone,
  User,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  KeyRound,
  MapPin,
  Lock,
  ArrowLeft,
  Flame,
  Check
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'creator';
  onBackToHome?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onBackToHome
}) => {
  const {
    db,
    unifiedLogin,
    registerStudent,
    setActiveSite,
    theme,
    toggleTheme
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'creator'>(initialMode);
  const [loginInput, setLoginInput] = useState('+998 90 777 11 22');
  const [loginPassword, setLoginPassword] = useState('');
  const [creatorCode, setCreatorCode] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [region, setRegion] = useState('Toshkent shahri');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imageLoaded, setImageLoaded] = useState(true);

  const teacher = db.teacherProfile;
  const teacherPhoto = teacher.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80';

  const regionsList = [
    'Toshkent shahri',
    'Toshkent viloyati',
    'Samarqand viloyati',
    'Farg‘ona viloyati',
    'Andijon viloyati',
    'Namangan viloyati',
    'Buxoro viloyati',
    'Xorazm viloyati',
    'Qashqadaryo viloyati',
    'Surxondaryo viloyati',
    'Jizzax viloyati',
    'Sirdaryo viloyati',
    'Navoiy viloyati',
    'Qoraqalpog‘iston Respublikasi'
  ];

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginInput.trim()) {
      setErrorMsg('Iltimos, telefon raqam yoki e-mail kiriting');
      return;
    }

    setLoading(true);
    try {
      const res = await unifiedLogin(loginInput, loginPassword);
      if (res.success) {
        setSuccessMsg(res.role === 'owner' ? 'Ustoz sifatida muvaffaqiyatli kirdingiz!' : 'Kabinetga muvaffaqiyatli kirdingiz!');
        setTimeout(() => {
          if (res.role === 'owner') {
            setActiveSite('site3_owner');
          } else {
            setActiveSite('site2_lms');
          }
        }, 500);
      } else {
        setErrorMsg(res.message || 'Kirishda xatolik yuz berdi. Parol yoki telefon/e-mailni tekshiring.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login handler
  const handleQuickDemoLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await unifiedLogin('+998 90 777 11 22');
      if (res.success) {
        setSuccessMsg('Jasurbek (Demo O‘quvchi) hisobiga kirdingiz!');
        setTimeout(() => {
          setActiveSite('site2_lms');
        }, 400);
      } else {
        setErrorMsg(res.message || 'Demo kirishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi');
    } finally {
      setLoading(false);
    }
  };

  // Creator handler
  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!creatorCode.trim()) {
      setErrorMsg('Iltimos, maxfiy kodni kiriting');
      return;
    }

    setLoading(true);
    try {
      const res = await unifiedLogin(creatorCode);
      if (res.success && res.role === 'owner') {
        setSuccessMsg('Platforma egasi (Fayzullo Omanullayev) sifatida kirdingiz!');
        setTimeout(() => {
          setActiveSite('site3_owner');
        }, 500);
      } else {
        setErrorMsg(res.message || 'Maxfiy kod noto‘g‘ri');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Iltimos, ismingizni kiriting');
      return;
    }
    if (!identifier.trim()) {
      setErrorMsg('Iltimos, telefon raqam yoki e-mail kiriting');
      return;
    }
    if (!registerPassword || registerPassword.length < 8) {
      setErrorMsg('Parol kamida 8 ta belgidan iborat bo‘lishi shart');
      return;
    }

    setLoading(true);
    try {
      const res = await registerStudent({
        name: name.trim(),
        surname: surname.trim(),
        identifier: identifier.trim(),
        password: registerPassword,
        region
      });
      if (res.success) {
        setSuccessMsg('Muvaffaqiyatli ro‘yxatdan o‘tdingiz! Boshqaruv paneliga yo‘naltirilmoqdasiz...');
        setTimeout(() => {
          setActiveSite('site2_lms');
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

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#121316] text-stone-900 dark:text-stone-100 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 selection:bg-rose-500/20 selection:text-rose-900 transition-colors">
      {/* Top Bar for Auth Page */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            if (onBackToHome) onBackToHome();
            else setActiveSite('site1_open');
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors py-2 px-3 rounded-xl hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Rejimni almashtirish"
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors shadow-xs"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>
        </div>
      </div>

      {/* Main Card Split in Two Columns */}
      <div className="max-w-6xl mx-auto w-full bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Ustoz Fayzullo Omanullayev's portrait & Credentials */}
        <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-stone-800">
          {/* Subtle math geometry watermark (no books!) */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Header on teacher panel */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold tracking-wide mb-6">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Bosh Pedagog & Akademiya Asoschisi</span>
            </div>

            {/* Teacher Image Presentation */}
            <div className="relative mb-6">
              <div className="w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-3xl bg-gradient-to-tr from-[#F95738] via-amber-500 to-rose-600 p-1 shadow-2xl relative overflow-hidden group">
                {imageLoaded ? (
                  <img
                    src={teacherPhoto}
                    alt={teacher.name}
                    onError={() => setImageLoaded(false)}
                    className="w-full h-full object-cover object-top rounded-[22px] transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-950 rounded-[22px] flex flex-col items-center justify-center text-white">
                    <span className="text-4xl font-black text-amber-200">FO</span>
                    <span className="text-[10px] text-rose-300 font-bold uppercase mt-1">Ustoz</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/20 pointer-events-none" />
              </div>

              {/* Verified Badge pill */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Milliy Sertifikat Eksperti</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
                {teacher.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium">
                {teacher.title}
              </p>
            </div>
          </div>

          {/* Teacher's Methodology & Metric Counters */}
          <div className="relative z-10 my-6 space-y-4">
            {/* Key stats row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-rose-400 tabular-nums">
                  {teacher.nationalCertCount}+
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                  A+ & A Sertifikatlar
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                  {teacher.experienceYears} Yil
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                  Pedagogik Tajriba
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                  {teacher.studentsCount}+
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                  Muvaffaqiyatli O‘quvchi
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 tabular-nums">
                  91.5%
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                  Davlat Granti
                </div>
              </div>
            </div>

            {/* Inspiring quote box */}
            <div className="bg-stone-800/80 border border-stone-700/80 p-4 rounded-2xl">
              <p className="text-xs text-stone-300 italic leading-relaxed">
                “{teacher.methodology}”
              </p>
              <div className="mt-2 text-[10px] font-bold text-rose-400 uppercase tracking-wider text-right">
                — Fayzullo Omanullayev
              </div>
            </div>
          </div>

          {/* Footer note inside left panel */}
          <div className="relative z-10 pt-4 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rasmiy Davlat Standarti</span>
            </span>
            <span className="font-mono text-stone-500">2026 Season</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication & Registration Screen */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Academy Wordmark */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F95738] to-[#E04828] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                F
              </div>
              <div>
                <h3 className="font-black text-lg text-stone-900 dark:text-white tracking-tight leading-none">
                  Fayzullo Matematika Akademiyasi
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Talabalar va Abituriyentlar uchun Yopiq LMS
                </span>
              </div>
            </div>

            {/* Guard Notice Banner */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-amber-900 dark:text-amber-200 font-medium">
                  <span className="font-bold">Eslatma:</span> O‘quvchi boshqaruv paneli (dashboard) faqat ro‘yxatdan o‘tgan foydalanuvchilar uchun ochiladi. Shaxsiy darslar, Milliy sertifikat testlari va AI yordamchisidan foydalanish uchun tizimga kiring yoki yangi hisob oching.
                </div>
              </div>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Kirish
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Ro‘yxatdan o‘tish
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('creator');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'creator'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Ustoz / Creator
              </button>
            </div>

            {/* Error & Success Feedback */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                    Telefon Raqami yoki E-mail
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="+998 90 123 45 67 yoki e-mail"
                      className="w-full pl-11 pr-4 py-3.5 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F95738] text-stone-900 dark:text-white transition-all font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5">
                    Platformada ro‘yxatdan o‘tgan telefon raqamingiz yoki e-mail manzilingizni kiriting.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                    Maxfiy Parol <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="******"
                      className="w-full pl-11 pr-4 py-3.5 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F95738] text-stone-900 dark:text-white transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-sm font-bold text-white bg-[#F95738] hover:bg-[#E04828] active:scale-[0.99] rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Kirish va Dashboardga O‘tish</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant 1-Click Demo Button */}
                <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 text-center">
                  <div className="text-xs text-stone-500 mb-2 font-medium">
                    Saytni tezda sinab ko‘rmoqchimisiz?
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    disabled={loading}
                    className="w-full py-3 px-4 text-xs font-semibold rounded-2xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Jasurbek (Demo O‘quvchi) sifatida 1 marta bosishda kirish</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                      Ismingiz <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masalan: Sardor"
                        className="w-full pl-11 pr-4 py-3 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F95738] text-stone-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                      Familiyangiz
                    </label>
                    <input
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Masalan: Aliyev"
                      className="w-full px-4 py-3 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F95738] text-stone-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                    Telefon raqam yoki Username / E-mail <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="+998 90 123 45 67 yoki e-mail / username"
                      className="w-full pl-11 pr-4 py-3 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F95738] text-stone-900 dark:text-white transition-all font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Telefon raqamingiz, username yoki e-mail manzilingizni kiriting.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                    Maxfiy Parol <span className="text-rose-500">*</span> <span className="text-[10px] text-stone-400 font-normal">(kamida 8 ta belgi)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Kamida 8 ta belgi (harf va raqam)"
                      className="w-full pl-11 pr-4 py-3 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F95738] text-stone-900 dark:text-white transition-all font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Parol xavfsizligi uchun kamida 8 ta belgidan iborat bo‘lishi shart.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                    Viloyatingiz
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F95738] text-stone-900 dark:text-white transition-all appearance-none cursor-pointer"
                    >
                      {regionsList.map((r) => (
                        <option key={r} value={r} className="bg-white dark:bg-stone-900">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-sm font-bold text-white bg-[#F95738] hover:bg-[#E04828] active:scale-[0.99] rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Ro‘yxatdan O‘tish va Dashboardga Kirish</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: CREATOR / USTOZ LOGIN */}
            {mode === 'creator' && (
              <form onSubmit={handleCreatorSubmit} className="space-y-4">
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 p-4 rounded-2xl mb-4">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold mb-1">
                    <KeyRound className="w-4 h-4" />
                    <span>Fayzullo Omanullayev (Boshqaruv Markazi)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Platforma egasining super-admin boshqaruvi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                    Creator Maxfiy Kodi
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={creatorCode}
                      onChange={(e) => setCreatorCode(e.target.value)}
                      placeholder="Maxfiy parolni kiriting..."
                      className="w-full pl-11 pr-4 py-3.5 text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-900 dark:text-white transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.99] rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Creator Paneliga Kirish</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Bottom Security Trust Seal */}
          <div className="pt-8 border-t border-stone-200/80 dark:border-stone-800 mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Xavfsiz 256-bit shifrlangan tizim</span>
            </div>
            <div>
              Savollar bo‘yicha: <span className="font-bold text-stone-800 dark:text-stone-200">{teacher.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
