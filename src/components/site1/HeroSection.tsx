import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BarChart3, GraduationCap, Play, Star, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './scroll/site1-scroll.css';

interface HeroSectionProps {
  onOpenDiagnostic: () => void;
}

const VIDEO_DESKTOP = '/site1/formula_scroll_desktop.mp4';
const VIDEO_MOBILE = '/site1/formula_scroll_mobile.mp4';
const RIBBON = '/site1/hero-ribbon.jpg';

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const QUICK = [
  { icon: GraduationCap, title: 'Kurslar', text: 'Barcha mavzular bo‘yicha sifatli kurslar', href: '#courses' },
  { icon: Trophy, title: 'Yutuqlar', text: 'A+ natijalarga erishing', href: '#results' },
  { icon: BarChart3, title: 'Reyting', text: 'Eng yaxshi o‘quvchilar', href: '#leaderboard' },
  { icon: Star, title: 'Olimpiada', text: 'Bilimingizni sinang', href: '#thematic-olympiad' },
];

/**
 * Site 1 hero. Scroll position drives video.currentTime (GSAP ScrollTrigger, pinned, scrubbed),
 * so the formula on the right is drawn forwards on scroll down and backwards on scroll up.
 * At the top of the page the right-hand area is empty.
 */
export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { db } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const formulaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const heroSection = db.siteSections.find((s) => s.key === 'hero');
  const hidden = !!heroSection && !heroSection.isVisible;

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (hidden || !section || !video) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 1023px)').matches;
    const headerH = () => (document.querySelector('header') as HTMLElement | null)?.offsetHeight ?? 0;
    const setTop = () => section.style.setProperty('--s1x-top', `${headerH()}px`);
    setTop();
    window.addEventListener('resize', setTop);
    const src = compact ? VIDEO_MOBILE : VIDEO_DESKTOP;
    let duration = 14.85;
    let target = 0;
    let raf = 0;
    let blobUrl: string | null = null;
    let disposed = false;

    const onMeta = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) duration = video.duration - 0.06;
      video.currentTime = Math.min(target, duration);
    };
    video.addEventListener('loadedmetadata', onMeta);
    video.src = src;

    const ctrl = new AbortController();
    const idleId = window.setTimeout(() => {
      fetch(src, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('video'))))
        .then((b) => {
          if (disposed) return;
          blobUrl = URL.createObjectURL(b);
          video.src = blobUrl;
        })
        .catch(() => {});
    }, 150);

    const unlock = () => {
      const p = video.play();
      if (p) p.then(() => video.pause()).catch(() => {});
    };
    window.addEventListener('touchstart', unlock, { once: true, passive: true });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (video.readyState < 1 || video.seeking) return;
      const t = Math.min(Math.max(target, 0), duration);
      if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
    };

    const ctx = gsap.context(() => {
      if (reduce) {
        target = 4.2;
        gsap.set(formulaRef.current, { opacity: 1 });
        return;
      }
      const state = { p: 0 };
      gsap.set(formulaRef.current, { opacity: 0 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        // CSS sticky stage instead of a GSAP pin: the app wraps pages in a transformed
        // container (SiteTransitionWrapper), which breaks position:fixed pinning.
        scrollTrigger: {
          trigger: section,
          start: () => `top top+=${headerH()}`,
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      tl.to(state, { p: 1, duration: 1, onUpdate: () => void (target = state.p * duration) }, 0)
        .to(formulaRef.current, { opacity: 1, duration: 0.04 }, 0.006)
        .to(cueRef.current, { opacity: 0, y: 12, duration: 0.05 }, 0)
        .fromTo(formulaRef.current, { scale: 1 }, { scale: 1.05, duration: 0.6 }, 0.35)
        .to(copyRef.current, { y: -70, opacity: 0, duration: 0.13, ease: 'power2.in' }, 0.84)
        .to(cardsRef.current, { y: 50, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0.84);
    }, section);

    raf = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      ctrl.abort();
      window.clearTimeout(idleId);
      cancelAnimationFrame(raf);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('resize', setTop);
      video.removeEventListener('loadedmetadata', onMeta);
      ctx.revert();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <section ref={sectionRef} className={`relative w-full ${reduceMotion() ? '' : 'h-[360svh] lg:h-[420svh]'}`}>
      <div className="s1x-hero sticky top-[var(--s1x-top,64px)] h-[calc(100svh-var(--s1x-top,64px))] min-h-[560px] w-full overflow-hidden">
      <div className="s1x-ribbon" aria-hidden>
        <img src={RIBBON} alt="" width={1920} height={1088} fetchPriority="high" />
        <div className="s1x-fade" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[46%] justify-center lg:inset-y-0 lg:left-auto lg:right-[2vw] lg:h-auto lg:w-[52vw] lg:items-center lg:justify-end lg:pb-28 lg:pt-16"
        aria-hidden
      >
        <div ref={formulaRef} className="s1x-formula aspect-[3/4] h-full max-w-full opacity-0 lg:h-[min(100%,58vw)]">
          <video ref={videoRef} muted playsInline preload="metadata" disablePictureInPicture tabIndex={-1} />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div ref={copyRef} className="max-w-[36rem] lg:max-w-[44vw] lg:pt-[6vh] xl:max-w-[40rem]">
          <div className="s1x-intro mb-5 flex items-center gap-3" style={{ animationDelay: '0.05s' }}>
            <span className="s1x-glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm text-stone-600">
              <span className="w-2 h-2 rounded-full bg-[#F95738]" />
              Matematika — bu imkoniyat!
            </span>
            <svg viewBox="0 0 120 30" className="hidden h-7 w-28 text-[#F95738] sm:block" fill="none" aria-hidden>
              <path className="s1x-wave" d="M2 18 C 14 18, 18 6, 30 10 S 46 26, 58 16 S 74 2, 86 14 S 104 20, 118 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-[clamp(2.7rem,6.6vw,6.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#141210]">
            {[{ t: 'Fayzullo' }, { t: 'Matematika', brand: true }, { t: 'Akademiyasi' }].map((w, i) => (
              <span key={w.t} className="block overflow-hidden pb-[0.06em]">
                <span className={`s1x-word inline-block ${w.brand ? 's1x-brand' : ''}`} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                  {w.t}
                </span>
              </span>
            ))}
          </h1>
          <p className="s1x-intro mt-5 max-w-md text-base leading-relaxed text-stone-700 sm:text-xl" style={{ animationDelay: '0.55s' }}>
            Matematika — kelajak kaliti. Biz bilan bilimingizni yangi bosqichga olib chiqing!
          </p>
          <div className="s1x-intro mt-7 flex flex-wrap gap-3 sm:gap-4" style={{ animationDelay: '0.7s' }}>
            <a href="#demo-lesson" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#F95738] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(249,87,56,0.6)] transition hover:-translate-y-0.5 hover:bg-[#E04828] sm:h-14 sm:px-7 sm:text-base">
              <Play className="w-4 h-4 fill-current" /> Bepul Demo Dars
            </a>
            <a href="#courses" className="inline-flex h-12 items-center gap-2 rounded-full border border-stone-800/70 bg-white/40 px-5 text-sm font-semibold text-stone-900 backdrop-blur-sm transition hover:bg-white sm:h-14 sm:px-7 sm:text-base">
              Kurslar haqida <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div ref={cardsRef} className="mt-auto hidden grid-cols-4 gap-5 pb-8 lg:grid">
          {QUICK.map((q, i) => {
            const Icon = q.icon;
            return (
              <a key={q.title} href={q.href} className="s1x-intro s1x-glass group flex items-center gap-4 rounded-3xl p-5 transition-transform duration-500 hover:-translate-y-1" style={{ animationDelay: `${0.85 + i * 0.08}s` }}>
                <span className="grid w-12 h-12 shrink-0 place-items-center rounded-2xl bg-white text-[#F95738] shadow-sm"><Icon className="w-6 h-6" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-stone-900">{q.title}</span>
                  <span className="block text-sm leading-snug text-stone-500">{q.text}</span>
                </span>
                <span className="grid w-9 h-9 shrink-0 place-items-center rounded-full bg-white text-[#F95738] transition-transform duration-500 group-hover:translate-x-1"><ArrowRight className="w-4 h-4" /></span>
              </a>
            );
          })}
        </div>
      </div>

      <div ref={cueRef} className="s1x-cue pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-wide text-stone-500 lg:bottom-auto lg:left-auto lg:right-12 lg:top-1/2 lg:translate-x-0" aria-hidden>
        <span className="block h-5 w-px bg-[#F95738]" />
        Aylantiring
      </div>
      </div>
    </section>
  );
};
