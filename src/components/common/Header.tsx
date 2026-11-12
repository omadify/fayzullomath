import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Globe, LogOut, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Language } from '../../types';

interface HeaderProps {
  onOpenAuthModal: (mode: 'login' | 'register' | 'creator') => void;
  onOpenOwnerModal?: () => void;
}

import { AnimatedSticker } from './AnimatedSticker';


export const Header: React.FC<HeaderProps> = ({ onOpenAuthModal, onOpenOwnerModal }) => {
  const {
    activeSite,
    setActiveSite,
    currentUser,
    isOwnerAuth,
    theme,
    toggleTheme,
    language,
    setLanguage,
    logout,
    t
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'uz', label: 'O‘zbekcha' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/75 dark:bg-[#121316]/75 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single element brand wordmark */}
        <div
          onClick={() => setActiveSite('site1_open')}
          className="cursor-pointer flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F95738] to-[#E04828] text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-stone-900 dark:text-stone-100 tracking-tight leading-none flex items-center gap-1">
              <span>Fayzullo</span>
              <AnimatedSticker symbol="🔥" size="sm" />
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
              Matematika Akademiyasi
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-stone-600 dark:text-stone-400">
          <button
            onClick={() => {
              if (isOwnerAuth) setActiveSite('site3_owner');
              else setActiveSite('site2_lms');
            }}
            className="hover:text-[#F95738] dark:hover:text-[#F95738] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-extrabold text-stone-900 dark:text-white cursor-pointer px-2.5 py-1 rounded-lg bg-stone-100/80 dark:bg-stone-800/80"
          >
            <AnimatedSticker symbol="🎯" size="sm" />
            <span>Dashboard</span>
          </button>
          <a
            href="#leaderboard"
            onClick={(e) => {
              if (activeSite !== 'site1_open') {
                e.preventDefault();
                setActiveSite('site1_open');
                setTimeout(() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold"
          >
            <AnimatedSticker symbol="🏆" size="sm" />
            <span>Reyting</span>
          </a>
          <a
            href="#thematic-olympiad"
            onClick={(e) => {
              if (activeSite !== 'site1_open') {
                e.preventDefault();
                setActiveSite('site1_open');
                setTimeout(() => document.getElementById('thematic-olympiad')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold"
          >
            <AnimatedSticker symbol="🔥" size="sm" />
            <span>Mavzumiy Test</span>
          </a>
          <a
            href="#site-creators"
            onClick={(e) => {
              if (activeSite !== 'site1_open') {
                e.preventDefault();
                setActiveSite('site1_open');
                setTimeout(() => document.getElementById('site-creators')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold"
          >
            <AnimatedSticker symbol="💻" size="sm" />
            <span>Dasturchilar</span>
          </a>
          <a
            href="#courses"
            onClick={(e) => {
              if (activeSite !== 'site1_open') {
                e.preventDefault();
                setActiveSite('site1_open');
                setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <AnimatedSticker symbol="✨" size="sm" />
            <span>Kurslar</span>
          </a>
          <a
            href="#results"
            onClick={(e) => {
              if (activeSite !== 'site1_open') {
                e.preventDefault();
                setActiveSite('site1_open');
                setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold"
          >
            <AnimatedSticker symbol="🏅" size="sm" />
            <span>Natijalar</span>
          </a>
          <a
            href="#vip"
            onClick={(e) => {
              if (activeSite !== 'site1_open') {
                e.preventDefault();
                setActiveSite('site1_open');
                setTimeout(() => document.getElementById('vip')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold"
          >
            <AnimatedSticker symbol="👑" size="sm" />
            <span>VIP Tariflar</span>
          </a>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 text-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase text-[11px] font-bold">{language}</span>
            </button>

            {showLangMenu && (
              <div
                className="absolute right-0 mt-1 w-28 bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 py-1 z-50 text-xs"
                onClick={() => setShowLangMenu(false)}
              >
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-stone-50 dark:hover:bg-stone-800 ${
                      language === l.code ? 'font-bold text-rose-600' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* User state */}
          {isOwnerAuth ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSite('site3_owner')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Creator Paneli</span>
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 border border-stone-200 dark:border-stone-800"
                title="Chiqish"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSite('site2_lms')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#F95738] hover:bg-[#E04828] text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Kabinet ({currentUser.name})</span>
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 border border-stone-200 dark:border-stone-800"
                title="Chiqish"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
              >
                {t('btn_login')}
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#F95738] hover:bg-[#E04828] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                {t('btn_register')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
