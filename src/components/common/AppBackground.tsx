import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const AppBackground: React.FC = () => {
  const { db, theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active theme background ID from database or fallback to formula_live (theme 5)
  const activeBg = db.siteTheme?.activeBackground || 'formula_live';
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };
    window.addEventListener('resize', handleResize);

    // Dynamic Math formulas and symbols for live mathematical background
    const mathFormulas = [
      '∫ e^(-x²) dx = √π / 2',
      'e^(iπ) + 1 = 0',
      '∑ (1/n²) = π² / 6',
      'lim (sin x / x) = 1',
      'x = (-b ± √(b² - 4ac)) / 2a',
      'sin²θ + cos²θ = 1',
      'log_a(xy) = log_a x + log_a y',
      'a² + b² = c²',
      'E = mc²',
      '∫ x^n dx = x^(n+1)/(n+1) + C',
      'S_n = (a₁ + a_n) · n / 2',
      'cos(2α) = cos²α - sin²α',
      'x₁ + x₂ = -p,  x₁·x₂ = q',
      'det(A - λI) = 0',
      'f\'(x) = lim Δy/Δx',
      'C_n^k = n! / (k!(n-k)!)',
      'V = 1/3 S_asos · H',
      'lim (1 + 1/n)^n = e',
      'P(A) = m / n',
      '∇ × E = -∂B / ∂t',
      'A = π r²',
      'tan(α+β) = (tan α + tan β)/(1-tan α tan β)'
    ];

    const mathSymbols = ['π', '∑', '∫', '√', '∞', 'α', 'β', 'θ', 'λ', '∂', 'Δ', 'Ω', 'μ', 'φ', '≠', '≈', '≤', '≥'];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      text: string;
      size: number;
      opacity: number;
      baseOpacity: number;
      rotation: number;
      vRot: number;
      isSymbol: boolean;
      sparklePhase: number;
    }

    const particles: Particle[] = [];
    const count = Math.min(50, Math.max(24, Math.floor(width / 35)));

    for (let i = 0; i < count; i++) {
      const isSymbol = Math.random() > 0.55;
      const text = isSymbol
        ? mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
        : mathFormulas[Math.floor(Math.random() * mathFormulas.length)];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.45, // upward floating drift
        text,
        size: isSymbol ? 20 + Math.random() * 16 : 14 + Math.random() * 9,
        opacity: 0.35 + Math.random() * 0.45,
        baseOpacity: 0.35 + Math.random() * 0.45,
        rotation: (Math.random() - 0.5) * 0.15,
        vRot: (Math.random() - 0.5) * 0.003,
        isSymbol,
        sparklePhase: Math.random() * Math.PI * 2
      });
    }

    // Interactive mouse parallax & glow
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.sparklePhase += 0.02;

        // Wrap around borders smoothly
        if (p.y < -60) {
          p.y = height + 60;
          p.x = Math.random() * width;
        }
        if (p.x < -120) p.x = width + 120;
        if (p.x > width + 120) p.x = -120;

        // Mouse proximity reaction
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let extraOpacity = 0;
        if (dist < 260) {
          extraOpacity = (1 - dist / 260) * 0.4;
        }

        const sparkle = Math.sin(p.sparklePhase) * 0.15;
        const currentOpacity = Math.min(0.95, Math.max(0.2, p.opacity + extraOpacity + sparkle));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.font = p.isSymbol
          ? `bold ${p.size}px "Times New Roman", "KaTeX_Main", serif`
          : `600 ${p.size}px "Plus Jakarta Sans", "DM Sans", monospace`;

        // THEME-SPECIFIC PALETTES & GLOW
        if (activeBg === 'formula_live') {
          // 5-chi Fon: Olovli & Jonli Formula
          if (isDark) {
            ctx.fillStyle = p.isSymbol
              ? `rgba(251, 146, 60, ${currentOpacity})`
              : `rgba(244, 63, 94, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(249, 87, 56, 0.7)';
            ctx.shadowBlur = p.isSymbol ? 14 : 8;
          } else {
            ctx.fillStyle = p.isSymbol
              ? `rgba(217, 83, 79, ${currentOpacity})`
              : `rgba(225, 29, 72, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(249, 87, 56, 0.4)';
            ctx.shadowBlur = 6;
          }
        } else if (activeBg === 'cosmic') {
          // 2-chi Fon: Kosmik Fazo
          if (isDark) {
            ctx.fillStyle = p.isSymbol
              ? `rgba(192, 132, 252, ${currentOpacity})`
              : `rgba(129, 140, 248, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
            ctx.shadowBlur = p.isSymbol ? 16 : 10;
          } else {
            ctx.fillStyle = p.isSymbol
              ? `rgba(126, 34, 206, ${currentOpacity})`
              : `rgba(79, 70, 229, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
            ctx.shadowBlur = 6;
          }
        } else if (activeBg === 'emerald') {
          // 3-chi Fon: Kiber Zumrad / Matrix
          if (isDark) {
            ctx.fillStyle = p.isSymbol
              ? `rgba(52, 211, 153, ${currentOpacity})`
              : `rgba(16, 185, 129, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
            ctx.shadowBlur = p.isSymbol ? 14 : 8;
          } else {
            ctx.fillStyle = p.isSymbol
              ? `rgba(5, 150, 105, ${currentOpacity})`
              : `rgba(4, 120, 87, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
            ctx.shadowBlur = 6;
          }
        } else if (activeBg === 'gold') {
          // 4-chi Fon: Qirollik Oltin
          if (isDark) {
            ctx.fillStyle = p.isSymbol
              ? `rgba(251, 191, 36, ${currentOpacity})`
              : `rgba(245, 158, 11, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(245, 158, 11, 0.85)';
            ctx.shadowBlur = p.isSymbol ? 16 : 10;
          } else {
            ctx.fillStyle = p.isSymbol
              ? `rgba(180, 83, 9, ${currentOpacity})`
              : `rgba(217, 119, 6, ${currentOpacity})`;
            ctx.shadowColor = 'rgba(217, 119, 6, 0.4)';
            ctx.shadowBlur = 6;
          }
        } else {
          // 1-chi Fon: Minimalist Klassik
          if (isDark) {
            ctx.fillStyle = p.isSymbol
              ? `rgba(214, 211, 209, ${currentOpacity * 0.7})`
              : `rgba(168, 162, 158, ${currentOpacity * 0.6})`;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
            ctx.shadowBlur = 4;
          } else {
            ctx.fillStyle = p.isSymbol
              ? `rgba(87, 83, 78, ${currentOpacity * 0.6})`
              : `rgba(120, 113, 108, ${currentOpacity * 0.5})`;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 2;
          }
        }

        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeBg, isDark]);

  return (
    <div
      key={`bg-theme-${activeBg}-${theme}`}
      className="fixed inset-0 w-screen h-screen pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Theme 5: Formula Live (Olovli & Jonli Formula Fon) */}
      {activeBg === 'formula_live' && (
        <>
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              isDark
                ? 'bg-[#0e1014] bg-[radial-gradient(#252932_1px,transparent_1px)] [background-size:28px_28px]'
                : 'bg-[#faf7f2] bg-[radial-gradient(#e4ddd2_1px,transparent_1px)] [background-size:28px_28px]'
            }`}
          />
          {/* Warm radiant atmospheric flares */}
          <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] rounded-full bg-rose-500/20 dark:bg-rose-600/30 blur-[100px] animate-pulse" />
          <div className="absolute top-1/4 -right-32 w-[40rem] h-[40rem] rounded-full bg-amber-500/20 dark:bg-amber-600/25 blur-[100px]" />
          <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-orange-500/15 dark:bg-orange-600/25 blur-[100px]" />
        </>
      )}

      {/* 2. Theme 2: Cosmic & Space Mathematics */}
      {activeBg === 'cosmic' && (
        <>
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              isDark
                ? 'bg-gradient-to-b from-[#060814] via-[#0b122c] to-[#04060f]'
                : 'bg-gradient-to-b from-[#eef2ff] via-[#e0e7ff] to-[#c7d2fe]'
            }`}
          />
          <div className="absolute -top-20 left-1/4 w-[42rem] h-[42rem] rounded-full bg-indigo-500/25 dark:bg-indigo-600/35 blur-[110px]" />
          <div className="absolute bottom-10 right-10 w-[38rem] h-[38rem] rounded-full bg-purple-500/25 dark:bg-purple-600/30 blur-[110px]" />
          <div className="absolute top-1/2 -left-20 w-[30rem] h-[30rem] rounded-full bg-blue-500/20 dark:bg-blue-600/25 blur-[90px]" />
        </>
      )}

      {/* 3. Theme 3: Cyber Emerald / Matrix */}
      {activeBg === 'emerald' && (
        <>
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              isDark
                ? 'bg-gradient-to-b from-[#02130c] via-[#042416] to-[#010f08]'
                : 'bg-gradient-to-b from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]'
            }`}
          />
          <div className="absolute -top-20 right-1/4 w-[40rem] h-[40rem] rounded-full bg-emerald-500/25 dark:bg-emerald-600/35 blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-[36rem] h-[36rem] rounded-full bg-teal-500/25 dark:bg-teal-600/30 blur-[100px]" />
        </>
      )}

      {/* 4. Theme 4: Royal Luxury Gold */}
      {activeBg === 'gold' && (
        <>
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              isDark
                ? 'bg-gradient-to-b from-[#140e04] via-[#221808] to-[#0f0b03]'
                : 'bg-gradient-to-b from-[#fefce8] via-[#fef08a]/35 to-[#fde047]/25'
            }`}
          />
          <div className="absolute -top-20 left-1/3 w-[42rem] h-[42rem] rounded-full bg-amber-500/25 dark:bg-amber-600/35 blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-[38rem] h-[38rem] rounded-full bg-yellow-500/20 dark:bg-yellow-600/30 blur-[100px]" />
        </>
      )}

      {/* 5. Theme 1: Modern Minimalist */}
      {activeBg === 'minimal' && (
        <>
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              isDark
                ? 'bg-[#121316] bg-[radial-gradient(#222630_1px,transparent_1px)] [background-size:24px_24px]'
                : 'bg-[#f8f6f0] bg-[radial-gradient(#e5dfd4_1px,transparent_1px)] [background-size:24px_24px]'
            }`}
          />
          <div className="absolute top-0 right-1/4 w-[34rem] h-[34rem] rounded-full bg-stone-300/25 dark:bg-stone-700/20 blur-[100px]" />
        </>
      )}

      {/* SINGLE UNIFIED PERSISTENT CANVAS FOR MAXIMUM PERFORMANCE AND FULLSCREEN PRESENCE */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-screen h-screen block pointer-events-none"
      />
    </div>
  );
};
