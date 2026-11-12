import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Site1Home } from './components/site1/Site1Home';
import { Site2LMS } from './components/site2/Site2LMS';
import { Site3Owner } from './components/site3/Site3Owner';
import { AuthPage } from './components/auth/AuthPage';
import { StudentAuthModal } from './components/common/StudentAuthModal';
import { AppBackground } from './components/common/AppBackground';
import { SiteTransitionWrapper } from './components/common/SiteTransitionWrapper';

const AppContent: React.FC = () => {
  const { activeSite, setActiveSite, currentUser, isOwnerAuth, loading } = useApp();
  const [showStudentAuth, setShowStudentAuth] = useState(false);
  const [studentAuthMode, setStudentAuthMode] = useState<'login' | 'register' | 'creator'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#121316] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F95738] to-[#E04828] text-white flex items-center justify-center font-bold text-xl shadow-md animate-pulse">
            F
          </div>
          <span className="text-xs font-semibold text-stone-500 tracking-wider uppercase">
            Fayzullo Matematika Akademiyasi...
          </span>
        </div>
      </div>
    );
  }

  // Dedicated Auth Page Route
  if (activeSite === 'auth') {
    return (
      <div className="relative min-h-screen">
        <AppBackground />
        <div className="relative z-10">
          <AuthPage
            initialMode={studentAuthMode}
            onBackToHome={() => setActiveSite('site1_open')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-stone-900 dark:text-stone-100 font-sans selection:bg-rose-500/20 selection:text-rose-900 relative pb-10">
      <AppBackground />

      <div className="relative z-10 flex flex-col flex-1">
        <Header
          onOpenAuthModal={(m) => {
            setStudentAuthMode(m);
            setActiveSite('auth');
          }}
          onOpenOwnerModal={() => {
            setStudentAuthMode('creator');
            setActiveSite('auth');
          }}
        />

        <SiteTransitionWrapper activeKey={activeSite}>
          {activeSite === 'site1_open' && <Site1Home />}

          {/* Student Dashboard Route */}
          {activeSite === 'site2_lms' && (
            currentUser ? (
              <Site2LMS />
            ) : (
              <AuthPage
                initialMode="login"
                onBackToHome={() => setActiveSite('site1_open')}
              />
            )
          )}

          {/* Creator / Super Admin Dashboard Route */}
          {activeSite === 'site3_owner' && (
            isOwnerAuth ? (
              <Site3Owner />
            ) : (
              <AuthPage
                initialMode="creator"
                onBackToHome={() => setActiveSite('site1_open')}
              />
            )
          )}
        </SiteTransitionWrapper>

        {activeSite === 'site1_open' && (
          <Footer onOpenOwnerModal={() => {
            setStudentAuthMode('creator');
            setActiveSite('auth');
          }} />
        )}

        {/* Global Auth Modal */}
        <StudentAuthModal
          isOpen={showStudentAuth}
          initialMode={studentAuthMode}
          onClose={() => setShowStudentAuth(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
