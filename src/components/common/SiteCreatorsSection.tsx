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
  Cpu,
  Layers,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SiteCreator } from '../../types';

export const SiteCreatorsSection: React.FC = () => {
  const { db } = useApp();
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const creators = db.siteCreators || [];

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Dasturchilar Jamoasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Sayt Yaratuvchilari & Muhandislar
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Fayzullo Matematika Akademiyasi platformasini zamonaviy arxitektura, yuqori tezlikdagi Gemini AI integratsiyasi, interaktiv jonli formulalar va nozik UI/UX dizayn asosida yaratgan 3 nafar yetakchi dasturchi.
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3 Creators Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creators.map((creator: SiteCreator, index: number) => {
          const isPhoneCopied = copiedPhone === creator.phoneNumber;

          return (
            <div
              key={creator.id}
              className="bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative group"
            >
              {/* Creator Card Top */}
              <div>
                {/* Photo & Role Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={creator.photoUrl}
                      alt={creator.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/30 group-hover:border-rose-500 transition-colors shadow-xs"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[10px] text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Muhandis #{index + 1}
                    </span>
                    <h3 className="font-extrabold text-base text-stone-900 dark:text-white leading-snug">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
                      {creator.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
                  {creator.bio}
                </p>

                {/* Tech Skills & Programming Languages */}
                <div className="mb-5">
                  <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-stone-400" />
                    <span>Dasturlash & Texnologiyalar:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {creator.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 border border-stone-200/50 dark:border-stone-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Actions Footer */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
                {/* Telegram Link */}
                <a
                  href={`https://t.me/${creator.telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-sky-500" />
                    <span>Telegram: @{creator.telegramUsername}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-sky-400" />
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
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                    title="Nusxalash"
                  >
                    {isPhoneCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
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
  );
};
