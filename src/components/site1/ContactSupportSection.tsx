import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Phone, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

export const ContactSupportSection: React.FC = () => {
  const { db, createSupportTicket } = useApp();
  const section = db.siteSections.find(s => s.key === 'contact');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'kurs' | 'tolov' | 'texnik' | 'boshqa'>('kurs');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (section && !section.isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setIsSubmitting(true);
    try {
      await createSupportTicket({
        userName: name,
        userPhone: phone,
        category,
        message
      });
      setIsSuccess(true);
      setName('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white dark:bg-[#15171a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FBF9F5] dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Direct Info */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                  Biz Bilan Bog‘laning
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-4">
                  {section?.title || 'Savolingiz Bormi? Bizga Yozing'}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                  {section?.subtitle || 'Kurslar, to‘lovlar, shaxsiy konsultatsiya yoki metodika bo‘yicha har qanday savolingizga mamnuniyat bilan javob beramiz.'}
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                    <div className="w-9 h-9 rounded-xl bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-stone-400">Telefon / Call Center:</div>
                      <div className="font-semibold text-stone-900 dark:text-white">{db.teacherProfile.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-stone-400">Telegram Rasmiy Kanal:</div>
                      <a
                        href={db.teacherProfile.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        @fayzullo_math (Kanalga O‘tish)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-200/60 dark:border-stone-800 text-xs text-stone-500">
                Murojaatingiz to‘g‘ridan-to‘g‘ri OWNER paneliga yetib boradi va 24 soat ichida javob beriladi.
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-800/60 p-6 sm:p-8 rounded-2xl border border-stone-200/80 dark:border-stone-700/60">
              {isSuccess ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">
                    Murojaatingiz Qabul Qilindi!
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                    Tez orada ko‘rsatilgan telefon raqamingiz orqali siz bilan bog‘lanamiz.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                  >
                    Yangi Savol Yuborish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Ismingiz *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Masalan, Alisher"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Telefon Raqamingiz *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Murojaat Mavzusi
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    >
                      <option value="kurs">Kurslar va dars jadvali bo‘yicha</option>
                      <option value="tolov">VIP to‘lov va tariflar haqida</option>
                      <option value="texnik">Platforma yoki video pleyer masalasi</option>
                      <option value="boshqa">Boshqa savol / Taklif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Savolingiz Matni *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Savolingizni batafsil yozing..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-xs font-semibold rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Yuborilmoqda...' : 'Savol Yuborish'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
