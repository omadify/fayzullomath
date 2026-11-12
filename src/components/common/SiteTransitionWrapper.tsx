import React, { useEffect, useState } from 'react';

interface SiteTransitionWrapperProps {
  activeKey: string;
  children: React.ReactNode;
  className?: string;
}

export const SiteTransitionWrapper: React.FC<SiteTransitionWrapperProps> = ({
  activeKey,
  children,
  className = ''
}) => {
  const [displayKey, setDisplayKey] = useState(activeKey);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (activeKey !== displayKey) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setDisplayKey(activeKey);
        // Scroll to top of window when switching main sites smoothly
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setIsFading(false);
      }, 140);
      return () => clearTimeout(timer);
    }
  }, [activeKey, displayKey]);

  return (
    <div
      className={`flex-1 flex flex-col transition-all duration-300 ease-out transform-gpu ${
        isFading
          ? 'opacity-0 scale-[0.99] translate-y-1 pointer-events-none'
          : 'opacity-100 scale-100 translate-y-0 animate-site-fade-in'
      } ${className}`}
    >
      {children}
    </div>
  );
};
