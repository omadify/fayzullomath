import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, Lock, X, AlertCircle, ArrowRight, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose
}) => {
  const { unifiedLogin, registerStudent } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  // Register fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [region, setRegion] = useState('Toshkent');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginInput.trim()) {
      setErrorMsg('Iltimos, telefon raqam yoki e-mail kiriting');
      return;
    }
    setLoading(true);

    try {
      const res = await unifiedLogin(loginInput.trim(), password.trim());
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Kirishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

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
        onClose();
      } else {
        setErrorMsg(res.message || 'Ro‘yxatdan o‘tishda xatolik');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switch */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 mb-6">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-xs font-bold transition-colors ${
              mode === 'login'
                ? 'text-[#F95738] border-b-2 border-[#F95738]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Kirish (O‘quvchi / Creator)
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-xs font-bold transition-colors ${
              mode === 'register'
                ? 'text-[#F95738] border-b-2 border-[#F95738]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Ro‘yxatdan O‘tish
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                Telefon Raqamingiz (yoki Creator kodi)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67 (yoki fayzullo)"
                  value={loginInput}
                  onChange={e => {
                    const val = e.target.value;
                    setLoginInput(val);
                    if (val.trim() === 'fayzullo' || val.trim() === 'creator') {
                      setIsCreatorMode(true);
                    } else if (isCreatorMode && val.trim() !== 'fayzullo' && val.trim() !== 'creator') {
                      setIsCreatorMode(false);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>

            {/* If Creator code entered or Creator toggle active, show password field */}
            {(isCreatorMode || loginInput.trim() === 'fayzullo') && (
              <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Creator / Owner Kirish</span>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                    Admin Paroli *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="Maxfiy parolni kiriting..."
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {!isCreatorMode && (
              <div className="text-[11px] text-stone-400">
                💡 O‘quvchi sifatida ro‘yxatdan o‘tgan telefon raqamingizni kiritib kirishingiz mumkin.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Tekshirilmoqda...' : 'Kirish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Creator fast toggle for convenience */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginInput('fayzullo');
                  setIsCreatorMode(true);
                }}
                className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Shield className="w-3 h-3" />
                <span>Creator (Fayzullo) sifatida kirish</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
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
              <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">Viloyat / Hudud</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
              >
                <option value="Toshkent">Toshkent shahri</option>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Ro‘yxatdan o‘tkazilmoqda...' : 'Ro‘yxatdan O‘tish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
