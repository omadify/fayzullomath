import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Phone, Send, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC<{ onOpenOwnerModal?: () => void }> = ({ onOpenOwnerModal }) => {
  const { db, setActiveSite } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F95738] to-[#E04828] text-white flex items-center justify-center font-bold text-base">
                F
              </div>
              <span className="font-bold text-lg text-white">
                Fayzullo Matematika Akademiyasi
              </span>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm max-w-md leading-relaxed mb-4">
              O‘zbekiston yoshlarini Milliy sertifikat A+, OTM davlat grantlari va nufuzli universitetlar talabaligiga professional tayyorlovchi zamonaviy intellektual matematika platformasi.
            </p>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {db.teacherProfile.phone}
              </span>
              <span>·</span>
              <a
                href={db.teacherProfile.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-stone-400" />
                Telegram Kanal
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Platforma
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveSite('site1_open')}
                  className="hover:text-white transition-colors"
                >
                  Ochiq Platforma va Kurslar
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSite('site2_lms')}
                  className="hover:text-white transition-colors"
                >
                  O‘quvchi Shaxsiy Kabineti (LMS)
                </button>
              </li>
              <li>
                <a href="#vip" className="hover:text-white transition-colors">
                  VIP Tariflar va Imkoniyatlar
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-white transition-colors">
                  O‘quvchilar Natijalari (A+)
                </a>
              </li>
              <li>
                <a href="#mock-exam" className="hover:text-white transition-colors">
                  Milliy Sertifikat Mock Testi
                </a>
              </li>
              <li>
                <a href="#demo-lesson" className="hover:text-white transition-colors">
                  Bepul Demo Dars
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveSite('site2_lms')}
                  className="hover:text-rose-400 text-rose-300 transition-colors font-medium flex items-center gap-1"
                >
                  <span>Sayt Yaratuvchilari (3 Muhandis)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Boshqaruv & Aloqa
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={onOpenOwnerModal}
                  className="hover:text-rose-400 transition-colors flex items-center gap-1 font-medium"
                >
                  <Shield className="w-3 h-3 text-rose-500" />
                  OWNER Kirish (Faqat Ustoz)
                </button>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Savol va Takliflar Yuborish
                </a>
              </li>
              <li>
                <a
                  href="https://bmb.uz"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  BMB Rasmiy Portali
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Fayzullo Matematika Akademiyasi. Barcha huquqlar himoyalangan.</p>
          <p className="text-[11px]">
            O‘zbekiston Respublikasi Davlat Ta’lim Standartlari va Milliy Sertifikat Baholash Mezonlari asosida ishlab chiqilgan.
          </p>
        </div>
      </div>
    </footer>
  );
};
