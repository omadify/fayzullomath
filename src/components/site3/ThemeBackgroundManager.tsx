import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Palette,
  CheckCircle2,
  Sparkles,
  Eye,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { AnimatedSticker, AnimatedText } from '../common/AnimatedSticker';
import { BackgroundThemeId } from '../../types';

export const ThemeBackgroundManager: React.FC = () => {
  const { db, updateSiteTheme, setActiveSite } = useApp();
  const currentBg = db.siteTheme?.activeBackground || 'formula_live';

  const [saving, setSaving] = useState(false);
  const [savedThemeName, setSavedThemeName] = useState<string | null>(null);

  const themeOptions: {
    id: BackgroundThemeId;
    number: number;
    title: string;
    description: string;
    badge: string;
    previewGradient: string;
    stickerSymbol: string;
    isLive?: boolean;
    tagColor: string;
  }[] = [
    {
      id: 'minimal',
      number: 1,
      title: '1-Fon: Zamonaviy Minimalist Klassik',
      description: 'Toza, nozik va ortiqcha bezaklarsiz klassik ilmiy muhit. Oddiy foydalanuvchilar uchun yorug‘/qorong‘u rejim.',
      badge: 'Minimal Klassik',
      previewGradient: 'from-stone-200 via-stone-300 to-stone-400 dark:from-stone-900 dark:via-stone-800 dark:to-stone-950',
      stickerSymbol: '✨',
      tagColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
    },
    {
      id: 'cosmic',
      number: 2,
      title: '2-Fon: Koinot & Kosmik Matematika',
      description: 'Chuqur fazoviy moviy-binafsharang koinot foni. Cheksiz fazo, yulduzlar va matematik qonuniyatlar uyg‘unligi.',
      badge: 'Kosmik Fazo',
      previewGradient: 'from-indigo-950 via-slate-900 to-blue-950 text-white',
      stickerSymbol: '🚀',
      tagColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
    },
    {
      id: 'emerald',
      number: 3,
      title: '3-Fon: Zumrad & Kiber Matematika',
      description: 'Yashil zumrad va kiber-texnologiya uslubidagi intellektual energiya foni. Matritsa uslubidagi yorqin formulalar.',
      badge: 'Kiber Zumrad',
      previewGradient: 'from-emerald-950 via-teal-900 to-green-950 text-white',
      stickerSymbol: '💎',
      tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
    },
    {
      id: 'gold',
      number: 4,
      title: '4-Fon: Qirollik Oltin & Akademik',
      description: 'Oliy toifali oltin va qahrabo ranglaridagi nufuzli akademiya atmosferasi. Oltin zarrachalar va qadimiy teoremalar.',
      badge: 'Qirollik Oltin',
      previewGradient: 'from-amber-950 via-stone-900 to-yellow-950 text-white',
      stickerSymbol: '👑',
      tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      id: 'formula_live',
      number: 5,
      title: '5-Fon: Jonli Formula & Olovli Fon (Animatsiyali)',
      description: 'Orqada haqiqiy matematik formulalar, integrallar, Viyet teoremasi, hosilalar va geometriya doimiy harakatlanib, butun ekranda suzib yuradi!',
      badge: '★ 5-chi Jonli Olov Fon',
      previewGradient: 'from-rose-950 via-stone-900 to-amber-950 text-white',
      stickerSymbol: '🔥',
      isLive: true,
      tagColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
    }
  ];

  const currentThemeObj = themeOptions.find(t => t.id === currentBg) || themeOptions[4];

  const handleApplyTheme = async (themeId: BackgroundThemeId, title: string) => {
    setSaving(true);
    setSavedThemeName(title);
    try {
      await updateSiteTheme({
        activeBackground: themeId,
        allowUserThemeOverride: true
      });
      setTimeout(() => setSavedThemeName(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Platforma Dizayni & 5 Ta Jonli Fon</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>Orqa Fon va Dizaynni Boshqarish</span>
            <AnimatedSticker symbol="🎨" size="md" />
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Creator sifatida butun sayt uchun 5 ta orqa fondan birini tanlang. 5-chi fon — butun ekran bo‘ylab doimo harakatlanuvchi jonli matematik formulalar va olovli energiya foni hisoblanadi.
          </p>
        </div>

        <button
          onClick={() => setActiveSite('site1_open')}
          className="px-5 py-3 rounded-2xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-105 shrink-0 shadow-sm"
        >
          <Eye className="w-4 h-4 text-rose-500" />
          <span>Saytda Jonli Ko‘rish</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      {/* Active Theme Highlight Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <AnimatedSticker symbol={currentThemeObj.stickerSymbol} size="md" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Hozir Butun Saytda Faol Fon:
            </div>
            <div className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <span>{currentThemeObj.title}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-600 text-white font-mono">
                #{currentThemeObj.number}
              </span>
            </div>
          </div>
        </div>

        {/* Quick 1-click switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-stone-500 mr-1">Tezkor:</span>
          {themeOptions.map(t => (
            <button
              key={`quick-${t.id}`}
              onClick={() => handleApplyTheme(t.id, t.title)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentBg === t.id
                  ? 'bg-rose-600 text-white shadow-xs scale-105 ring-2 ring-rose-400'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <AnimatedSticker symbol={t.stickerSymbol} size="sm" />
              <span>#{t.number}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Success alert */}
      {savedThemeName && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>«{savedThemeName}» muvaffaqiyatli saqlandi va butun saytda bir zumda faollashdi!</span>
          </div>
          <button
            onClick={() => setActiveSite('site1_open')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shrink-0"
          >
            Saytni tekshirish →
          </button>
        </div>
      )}

      {/* 5 Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {themeOptions.map(opt => {
          const isActive = currentBg === opt.id;

          return (
            <div
              key={opt.id}
              className={`rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative group ${
                isActive
                  ? 'border-rose-500 bg-white/95 dark:bg-stone-900/95 shadow-xl scale-[1.02] backdrop-blur-md ring-2 ring-rose-500/30'
                  : 'border-stone-200/90 dark:border-stone-800 bg-white/75 dark:bg-stone-900/75 backdrop-blur-md hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-md'
              }`}
            >
              <div>
                {/* Visual Preview Box */}
                <div
                  className={`h-32 rounded-2xl bg-gradient-to-br ${opt.previewGradient} p-4 mb-4 flex flex-col justify-between relative overflow-hidden shadow-inner border border-white/10`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/50 text-white backdrop-blur-xs flex items-center gap-1.5">
                      <AnimatedSticker symbol={opt.stickerSymbol} size="sm" />
                      <span>{opt.badge}</span>
                    </span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Faol</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-white/60">
                        #{opt.number}
                      </span>
                    )}
                  </div>

                  {opt.isLive ? (
                    <div className="text-[11px] font-mono text-rose-300 flex items-center gap-1.5 animate-pulse bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs w-fit">
                      <AnimatedSticker symbol="🔥" size="sm" />
                      <span>∫ e^(-x²) dx · e^(iπ)+1=0 · Viyet</span>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-white/80 bg-black/30 px-2 py-0.5 rounded w-fit">
                      f(x) = ax² + bx + c · a² + b² = c²
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <AnimatedSticker symbol={opt.stickerSymbol} size="md" />
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                    {opt.title}
                  </h3>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                  {opt.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleApplyTheme(opt.id, opt.title)}
                disabled={saving}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-stone-800 dark:text-stone-200'
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Joriy Faol Fon (O‘rnatilgan) ✓</span>
                  </>
                ) : (
                  <>
                    <AnimatedSticker symbol={opt.stickerSymbol} size="sm" />
                    <span>#{opt.number}-Fonga O‘zgartirish & Qo‘llash</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
