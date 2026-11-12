import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  Send,
  Phone,
  Sparkles,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';
import { SiteCreator } from '../../types';

export const PublicSiteCreatorsSection: React.FC = () => {
  const { db } = useApp();
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const creators = db.siteCreators || [];

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <section id="site-creators" className="py-20 bg-stone-50/70 dark:bg-stone-900/50 border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AnimatedSticker symbol="💻" size="sm" />
            <span>Platforma Arxitektorlari & Muhandislar</span>
            <AnimatedSticker symbol="✨" size="sm" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight flex items-center justify-center gap-2 flex-wrap">
            <span>Sayt Yaratuvchilari Bilan Tanishing</span>
            <AnimatedSticker symbol="🚀" size="md" />
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
            Fayzullo Matematika Akademiyasi platformasini zamonaviy arxitektura, yuqori tezlikdagi Gemini AI integratsiyasi, interaktiv jonli formulalar va nozik UI/UX dizayn asosida yaratgan 3 nafar iqtidorli dasturchi.
          </p>
        </div>

        {/* 3 Creators Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creators.map((creator: SiteCreator, index: number) => {
            const isPhoneCopied = copiedPhone === creator.phoneNumber;

            return (
              <div
                key={creator.id}
                className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-rose-300 dark:hover:border-rose-900/60 transition-all relative group"
              >
                <div>
                  {/* Photo & Role Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative shrink-0">
                      <img
                        src={creator.photoUrl}
                        alt={creator.name}
                        className="w-18 h-18 rounded-2xl object-cover border-2 border-rose-500/30 group-hover:border-rose-500 transition-colors shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900 flex items-center justify-center text-xs text-white shadow-xs">
                        ✓
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Muhandis #{index + 1}
                      </span>
                      <h3 className="font-extrabold text-lg text-stone-900 dark:text-white leading-tight">
                        {creator.name}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium leading-snug">
                        {creator.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-5">
                    {creator.bio}
                  </p>

                  {/* Tech Skills & Programming Languages */}
                  <div className="mb-6">
                    <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-rose-500" />
                      <span>Dasturlash & Texnologiyalar:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {creator.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/50 dark:border-stone-700/50 group-hover:border-rose-200 dark:group-hover:border-rose-900/40 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Actions Footer */}
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
                  {/* Telegram Direct Link */}
                  <a
                    href={`https://t.me/${creator.telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-sky-500" />
                      <span>Telegram: @{creator.telegramUsername}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  </a>

                  {/* Phone Call / Copy */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${creator.phoneNumber.replace(/[^+\d]/g, '')}`}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span className="truncate">{creator.phoneNumber}</span>
                    </a>

                    <button
                      onClick={() => handleCopyPhone(creator.phoneNumber)}
                      title="Raqamdan nusxa olish"
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {isPhoneCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
