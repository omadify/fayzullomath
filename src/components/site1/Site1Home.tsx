import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { StatsSection } from './StatsSection';
import { PublicLeaderboardSection } from './PublicLeaderboardSection';
import { PublicThematicOlympiadSection } from './PublicThematicOlympiadSection';
import { DemoLessonSection } from './DemoLessonSection';
import { ResultsSection } from './ResultsSection';
import { SingleMockTestBanner } from './SingleMockTestBanner';
import { CoursesSection } from './CoursesSection';
import { VIPPricingSection } from './VIPPricingSection';
import { TeacherBioSection } from './TeacherBioSection';
import { PublicSiteCreatorsSection } from './PublicSiteCreatorsSection';
import { ContactSupportSection } from './ContactSupportSection';
import { DiagnosticQuizModal } from './DiagnosticQuizModal';
import { MockExamPlayer } from '../site2/MockExamPlayer';
import { useSite1Reveals } from './scroll/useSite1Reveals';

export const Site1Home: React.FC = () => {
  const { db, activeTestId, setActiveTestId, setActiveSite } = useApp();
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const scenesRef = useRef<HTMLDivElement>(null);
  useSite1Reveals(scenesRef, [activeTestId, db.siteSections]);

  // If activeTestId is set on site1, render the mock exam player
  if (activeTestId) {
    return (
      <div className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <MockExamPlayer testId={activeTestId} onClose={() => setActiveTestId(null)} />
        </div>
      </div>
    );
  }

  // Sorted sections excluding removed sections
  const sortedSections = [...(db.siteSections || [])]
    .filter(s => s.isVisible && s.key !== 'books' && s.key !== 'calendar' && s.key !== 'news' && s.key !== 'achievements')
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const scene = (key: string, node: React.ReactNode) => (key === 'hero' ? node : <div key={key} data-scene>{node}</div>);

  const renderSectionByKey = (key: string) => scene(key, renderSectionInner(key));

  const renderSectionInner = (key: string) => {
    switch (key) {
      case 'hero':
        return <HeroSection key="hero" onOpenDiagnostic={() => setShowDiagnostic(true)} />;
      case 'stats':
        return <StatsSection key="stats" />;
      case 'leaderboard':
        return <PublicLeaderboardSection key="leaderboard" />;
      case 'olympiad':
        return <PublicThematicOlympiadSection key="olympiad" />;
      case 'demo':
        return <DemoLessonSection key="demo" />;
      case 'results':
        return <ResultsSection key="results" />;
      case 'mock':
        return <SingleMockTestBanner key="mock" onStartTest={(testId) => setActiveTestId(testId)} />;
      case 'courses':
        return <CoursesSection key="courses" />;
      case 'vip':
        return <VIPPricingSection key="vip" />;
      case 'teacher':
        return <TeacherBioSection key="teacher" />;
      case 'creators':
        return <PublicSiteCreatorsSection key="creators" />;
      case 'contact':
        return <ContactSupportSection key="contact" />;
      default:
        return null;
    }
  };

  const hasLeaderboard = sortedSections.some(s => s.key === 'leaderboard');
  const hasOlympiad = sortedSections.some(s => s.key === 'olympiad');
  const hasCreators = sortedSections.some(s => s.key === 'creators');

  return (
    <div ref={scenesRef} className="min-h-screen bg-transparent text-stone-900 dark:text-stone-100 transition-colors overflow-x-clip">
      {/* Dynamic or Default Homepage Layout */}
      {sortedSections.length > 0 && hasLeaderboard && hasOlympiad && hasCreators ? (
        sortedSections.map(s => renderSectionByKey(s.key))
      ) : (
        <>
          {/* 1. Hero & Stats */}
          <HeroSection onOpenDiagnostic={() => setShowDiagnostic(true)} />
          <div data-scene><StatsSection /></div>

          {/* 2. O‘quvchilar Milliy Reytingi (Asosiy Sahifada Darhol Ko‘rinadi) */}
          <div data-scene><PublicLeaderboardSection /></div>

          {/* 3. Mavzumiy Test & Olimpiada (G‘oliblar & Jonli Teskari Sanoq Soati) */}
          <div data-scene><PublicThematicOlympiadSection /></div>

          {/* 4. Demo Dars & Natijalar */}
          <div data-scene><DemoLessonSection /></div>
          <div data-scene><ResultsSection /></div>

          {/* 5. Mock Imtihon & Kurslar */}
          <div data-scene><SingleMockTestBanner onStartTest={(testId) => setActiveTestId(testId)} /></div>
          <div data-scene><CoursesSection /></div>
          <div data-scene><VIPPricingSection /></div>

          {/* 6. Ustoz Tavsifi */}
          <div data-scene><TeacherBioSection /></div>

          {/* 7. Sayt Yaratuvchilari (3 Nafar Dasturchi: Rasm, Tillar, Telegram, Telefon) */}
          <div data-scene><PublicSiteCreatorsSection /></div>

          {/* 8. Aloqa va Savollar */}
          <div data-scene><ContactSupportSection /></div>
        </>
      )}

      {/* Free diagnostic modal */}
      <DiagnosticQuizModal isOpen={showDiagnostic} onClose={() => setShowDiagnostic(false)} />
    </div>
  );
};
