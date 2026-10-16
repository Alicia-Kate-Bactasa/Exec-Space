import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowLeft, LogIn, UserPlus, FileText } from 'lucide-react';
import { UserDropdown } from './UserDropdown';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeCase,
  } = useCaseStore();
  const { user, openAuth } = useAuthStore();
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="h-18 md:h-20 border-b border-investigative-border/50 bg-investigative-surface/95 px-4 md:px-6 flex items-center justify-between select-none shrink-0 z-20 backdrop-blur-md">
      {/* Brand & Clickable Logo to return to Home/Landing */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center space-x-3 hover:opacity-85 transition-opacity focus:outline-none cursor-pointer"
          title="Return to ExecSpace Home"
        >
          {!logoError ? (
            <img
              src="/ExecSpaceLogo.png"
              alt="ExecSpace Logo"
              onError={() => {
                const img = document.getElementById('header-logo-img') as HTMLImageElement;
                if (img && !img.src.includes('/assets/')) {
                  img.src = '/assets/ExecSpaceLogo.png';
                } else {
                  setLogoError(true);
                }
              }}
              id="header-logo-img"
              className="h-9 md:h-11 w-auto object-contain max-h-11"
            />
          ) : (
            <div className="flex items-center space-x-2 bg-investigative-violet-subtle border border-investigative-violet/30 px-3 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-investigative-violet" />
              <span className="font-light tracking-wider text-base text-investigative-text">ExecSpace</span>
            </div>
          )}
          <span className="text-xl md:text-2xl font-light tracking-wide text-investigative-text">
            ExecSpace
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      {activeView !== 'workspace' ? (
        <nav className="hidden sm:flex items-center space-x-1.5 bg-investigative-surface-raised/40 p-1 rounded-full border border-investigative-border/50">
          <button
            type="button"
            onClick={() => setActiveView('landing')}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors cursor-pointer ${
              activeView === 'landing'
                ? 'bg-investigative-surface text-investigative-text shadow-xs border border-investigative-border/60'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => setActiveView('notes')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors cursor-pointer ${
              activeView === 'notes'
                ? 'bg-investigative-surface text-investigative-text shadow-xs border border-investigative-border/60'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
        </nav>
      ) : (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-sm bg-investigative-surface-raised/70 border border-investigative-border/60 text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('notes')}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm bg-investigative-surface-raised/50 border border-investigative-border/50 text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors cursor-pointer"
            title="Open Notes"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono bg-investigative-surface-raised/40 border border-investigative-border/50 px-3 py-1 rounded-full text-investigative-text-muted">
            <span className="w-2 h-2 rounded-full bg-investigative-violet" />
            <span className="text-investigative-text font-medium">{activeCase.code}</span>
            <span>·</span>
            <span className="truncate max-w-48 md:max-w-72">{activeCase.title}</span>
          </div>
        </div>
      )}

      {/* Actions: User Profile Chip Menu */}
      <div className="flex items-center space-x-2">
        {user ? (
          <UserDropdown />
        ) : (
          <>
            <button
              onClick={() => openAuth('login')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline font-light">Log in</span>
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Sign up</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
