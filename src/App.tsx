import React, { useEffect } from 'react';
import { useCaseStore } from './store/useCaseStore';
import { useAuthStore } from './store/useAuthStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LineageBar } from './components/layout/LineageBar';
import { Workspace } from './components/workspace/Workspace';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { ProfilePage } from './components/profile/ProfilePage';
import { HelpPage } from './components/help/HelpPage';
import { NotesPage } from './components/notes/NotesPage';

export const App: React.FC = () => {
  const { activeCase, selectCase, activeView, theme, dbError, setWorkspaceTab } = useCaseStore();
  const user = useAuthStore((s) => s.user);

  // Initialize PGlite database on initial mount
  useEffect(() => {
    selectCase(activeCase.id);
  }, []);

  // Sync theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync workspace tab if navigated via legacy/saved evidence or finding view
  useEffect(() => {
    if (activeView === 'evidence') {
      setWorkspaceTab('evidence');
    } else if (activeView === 'finding') {
      setWorkspaceTab('finding');
    }
  }, [activeView, setWorkspaceTab]);

  return (
    <div className="flex flex-col h-screen w-screen bg-investigative-bg text-investigative-text overflow-hidden font-sans">
      {/* Top Application Header — visible to logged-in users only */}
      {user && <Header />}

      {/* Main Content Area */}
      {activeView === 'landing' ? (
        <main className="flex-1 min-h-0 overflow-hidden">
          <LandingPage />
        </main>
      ) : activeView === 'help' ? (
        <main className="flex-1 min-h-0 overflow-hidden">
          <HelpPage />
        </main>
      ) : activeView === 'profile' ? (
        <main className="flex-1 min-h-0 overflow-hidden">
          <ProfilePage />
        </main>
      ) : activeView === 'notes' ? (
        <main className="flex-1 min-h-0 overflow-hidden">
          <NotesPage />
        </main>
      ) : (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Right Workspace Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-investigative-bg">
            {/* Data Lineage Breadcrumb Strip */}
            <LineageBar />

            {/* Database Notice if any */}
            {dbError && (
              <div className="bg-violet-950/20 border-b border-violet-500/30 px-4 py-2 text-xs text-violet-400 font-mono">
                Database Initialization Notice: {dbError}
              </div>
            )}

            {/* Active View Switcher */}
            <main className="flex-1 min-h-0 overflow-hidden">
              {(activeView === 'workspace' || activeView === 'evidence' || activeView === 'finding') && <Workspace />}
            </main>
          </div>
        </div>
      )}
      <AuthModal />
    </div>
  );
};

export default App;
