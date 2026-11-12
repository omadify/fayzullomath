import React from 'react';

export type StickerType =
  | 'fire'
  | 'sparkles'
  | 'trophy'
  | 'medal_gold'
  | 'medal_silver'
  | 'medal_bronze'
  | 'rocket'
  | 'target'
  | 'crown'
  | 'diamond'
  | 'zap'
  | 'coin'
  | 'grad'
  | 'robot'
  | 'book'
  | 'code'
  | 'hourglass'
  | 'chart'
  | 'shield'
  | 'teacher'
  | 'palette'
  | 'mail'
  | 'brick'
  | 'user'
  | 'generic';

interface AnimatedStickerProps {
  type?: StickerType;
  symbol?: string; // e.g. '🔥', '✨', '🏆', etc.
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export const detectStickerType = (symbol?: string, explicitType?: StickerType): StickerType => {
  if (explicitType) return explicitType;
  if (!symbol) return 'sparkles';

  if (symbol.includes('🔥')) return 'fire';
  if (symbol.includes('✨') || symbol.includes('⭐') || symbol.includes('🌟') || symbol.includes('💫')) return 'sparkles';
  if (symbol.includes('🏆')) return 'trophy';
  if (symbol.includes('🥇')) return 'medal_gold';
  if (symbol.includes('🥈')) return 'medal_silver';
  if (symbol.includes('🥉')) return 'medal_bronze';
  if (symbol.includes('🚀')) return 'rocket';
  if (symbol.includes('🎯')) return 'target';
  if (symbol.includes('👑')) return 'crown';
  if (symbol.includes('💎')) return 'diamond';
  if (symbol.includes('⚡')) return 'zap';
  if (symbol.includes('💰') || symbol.includes('💵') || symbol.includes('💳')) return 'coin';
  if (symbol.includes('🎓')) return 'grad';
  if (symbol.includes('🤖') || symbol.includes('🧠')) return 'robot';
  if (symbol.includes('📚') || symbol.includes('📖') || symbol.includes('📝')) return 'book';
  if (symbol.includes('💻') || symbol.includes('🖥️')) return 'code';
  if (symbol.includes('⏳') || symbol.includes('⏰') || symbol.includes('⏱️')) return 'hourglass';
  if (symbol.includes('📊') || symbol.includes('📈') || symbol.includes('📉')) return 'chart';
  if (symbol.includes('🛡️') || symbol.includes('🔒') || symbol.includes('🔑')) return 'shield';
  if (symbol.includes('👨‍🏫') || symbol.includes('🧑‍🏫')) return 'teacher';
  if (symbol.includes('🎨')) return 'palette';
  if (symbol.includes('📩') || symbol.includes('✉️') || symbol.includes('💬')) return 'mail';
  if (symbol.includes('🧱') || symbol.includes('🏗️')) return 'brick';
  if (symbol.includes('👥') || symbol.includes('👤')) return 'user';

  return 'generic';
};

export const AnimatedSticker: React.FC<AnimatedStickerProps> = ({
  type,
  symbol,
  size = 'md',
  className = '',
  glow = true
}) => {
  const detectedType = detectStickerType(symbol, type);
  const displaySymbol = symbol || (
    detectedType === 'fire' ? '🔥' :
    detectedType === 'sparkles' ? '✨' :
    detectedType === 'trophy' ? '🏆' :
    detectedType === 'medal_gold' ? '🥇' :
    detectedType === 'medal_silver' ? '🥈' :
    detectedType === 'medal_bronze' ? '🥉' :
    detectedType === 'rocket' ? '🚀' :
    detectedType === 'target' ? '🎯' :
    detectedType === 'crown' ? '👑' :
    detectedType === 'diamond' ? '💎' :
    detectedType === 'zap' ? '⚡' :
    detectedType === 'coin' ? '💰' :
    detectedType === 'grad' ? '🎓' :
    detectedType === 'robot' ? '🤖' :
    detectedType === 'book' ? '📚' :
    detectedType === 'code' ? '💻' :
    detectedType === 'hourglass' ? '⏳' :
    detectedType === 'chart' ? '📊' :
    detectedType === 'shield' ? '🛡️' :
    detectedType === 'teacher' ? '👨‍🏫' :
    detectedType === 'palette' ? '🎨' :
    detectedType === 'mail' ? '📩' :
    detectedType === 'brick' ? '🧱' :
    detectedType === 'user' ? '👥' : '✨'
  );

  // Size configs
  const sizeClasses = {
    sm: 'text-xs w-4 h-4 inline-flex items-center justify-center align-middle mx-0.5',
    md: 'text-sm w-5 h-5 inline-flex items-center justify-center align-middle mx-0.5',
    lg: 'text-lg w-7 h-7 inline-flex items-center justify-center align-middle mx-0.5',
    xl: 'text-2xl w-9 h-9 inline-flex items-center justify-center align-middle mx-0.5'
  };

  switch (detectedType) {
    case 'fire':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-flame shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Doimo Yonuvchi Olov"
          role="img"
          aria-label="fire"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-orange-500/40 blur-[3px] pointer-events-none animate-pulse" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_6px_rgba(249,115,22,0.9)] scale-110">
            {displaySymbol}
          </span>
        </span>
      );

    case 'sparkles':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-sparkle shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Yaltiragan Yulduz"
          role="img"
          aria-label="sparkles"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-amber-400/35 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'trophy':
    case 'medal_gold':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-trophy shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Oltin Kubok & G‘oliblik"
          role="img"
          aria-label="trophy"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-yellow-500/40 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.9)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'medal_silver':
    case 'medal_bronze':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-trophy shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Medal"
          role="img"
          aria-label="medal"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'rocket':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-rocket shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Tezkor Parvoz"
          role="img"
          aria-label="rocket"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-rose-500/30 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'target':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-target shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Aniqlik & Maqsad"
          role="img"
          aria-label="target"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-rose-600/35 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_5px_rgba(225,29,72,0.8)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'crown':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-crown shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="VIP Toj"
          role="img"
          aria-label="crown"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-amber-400/40 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.9)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'diamond':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-diamond shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Olmos Sifat"
          role="img"
          aria-label="diamond"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-cyan-400/35 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'zap':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-zap shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Tezkor Energiya"
          role="img"
          aria-label="zap"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-yellow-400/40 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_6px_rgba(250,204,21,1)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'coin':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-coin shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Balans & Moliya"
          role="img"
          aria-label="coin"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-amber-400/35 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_5px_rgba(245,158,11,0.85)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'grad':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-trophy shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Ta’lim & Diplom"
          role="img"
          aria-label="graduation"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'robot':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-bot shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Gemini AI Tizimi"
          role="img"
          aria-label="robot"
        >
          {glow && (
            <span className="absolute inset-0 rounded-full bg-indigo-500/35 blur-[3px] pointer-events-none" />
          )}
          <span className="relative z-10 filter drop-shadow-[0_0_6px_rgba(99,102,241,0.9)]">
            {displaySymbol}
          </span>
        </span>
      );

    case 'book':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-book shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Matematika Kursi"
          role="img"
          aria-label="book"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'code':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-code shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Dasturchi"
          role="img"
          aria-label="code"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'hourglass':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-hourglass shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Vaqt Sanoqi"
          role="img"
          aria-label="hourglass"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'chart':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-chart shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Statistika"
          role="img"
          aria-label="chart"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'shield':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-shield shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Xavfsizlik & Himoya"
          role="img"
          aria-label="shield"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'teacher':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-teacher shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Ustoz Fayzullo"
          role="img"
          aria-label="teacher"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'palette':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-palette shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Sayt Dizayni"
          role="img"
          aria-label="palette"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'mail':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-mail shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Murojaat"
          role="img"
          aria-label="mail"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'brick':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-brick shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Konstruktor"
          role="img"
          aria-label="brick"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    case 'user':
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-user shrink-0 leading-none ${sizeClasses[size]} ${className}`}
          title="Foydalanuvchi"
          role="img"
          aria-label="user"
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center justify-center select-none relative animate-sparkle shrink-0 leading-none ${sizeClasses[size]} ${className}`}
        >
          <span className="relative z-10 filter drop-shadow-sm">{displaySymbol}</span>
        </span>
      );
  }
};

/**
 * Utility helper to automatically render any string with animated emoji stickers.
 * Splits string by emoji characters and replaces each emoji with <AnimatedSticker />.
 */
export const renderWithAnimatedEmojis = (
  text: string,
  size: 'sm' | 'md' | 'lg' = 'sm'
): React.ReactNode => {
  if (!text) return null;

  // Regex matching emojis (including composite, flags, symbols)
  const regex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u;
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (regex.test(part)) {
          return (
            <AnimatedSticker
              key={`emoji-${index}`}
              symbol={part}
              size={size}
              className="mx-0.5 inline-block align-middle"
            />
          );
        }
        return <span key={`text-${index}`}>{part}</span>;
      })}
    </>
  );
};

/**
 * AnimatedText Component - drop-in replacement for strings with emojis
 */
export const AnimatedText: React.FC<{
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ text, size = 'sm', className = '' }) => {
  return <span className={className}>{renderWithAnimatedEmojis(text, size)}</span>;
};
