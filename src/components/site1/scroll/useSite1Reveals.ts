import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Site 1 only. Each child wrapped in [data-scene] reveals as a scene:
 * heading -> paragraphs -> images -> cards (grid children) one by one.
 * Works on the existing section components without changing them.
 */
export function useSite1Reveals(root: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-scene]', el).forEach((scene) => {
        const heads = scene.querySelectorAll('h2, h3:not(.grid h3)');
        const texts = Array.from(scene.querySelectorAll('p')).slice(0, 4);
        const images = scene.querySelectorAll('img');
        const cards = Array.from(scene.querySelectorAll('.grid > *')).slice(0, 24);
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: scene, start: 'top 80%', once: true } });
        if (heads.length) tl.from(heads, { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }, 0);
        if (texts.length) tl.from(texts, { y: 22, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.2);
        if (images.length) tl.from(images, { scale: 1.06, opacity: 0, duration: 1.2, stagger: 0.05, ease: 'expo.out' }, 0.3);
        if (cards.length) tl.from(cards, { y: 48, opacity: 0, scale: 0.98, duration: 0.9, stagger: 0.1, clearProps: 'transform' }, 0.35);
      });
    }, el);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(t); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
