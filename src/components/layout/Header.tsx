import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Moon, Sun, RotateCcw, Home, BookOpen, BookmarkCheck, FileText } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeView, setActiveView, evidenceList, theme, toggleTheme, resetCurrentCase } = useCaseStore();
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="h-18 md:h-20 border-b border-investigative-border/50 bg-investigative-surface/95 px-6 md:px-8 flex items-center justify-between select-none shrink-0 z-20 backdrop-blur-md">
      {/* Brand & Clickable Logo to return to Home/Landing */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center space-x-3 hover:opacity-85 transition-opacity focus:outline-none"
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

      {/* Minimalist Navigation with preserved hover effects */}
      <nav aria-label="Main Navigation" className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => setActiveView('landing')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-150 ${
            activeView === 'landing'
              ? 'bg-investigative-violet text-white font-normal shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('workspace')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-150 ${
            activeView === 'workspace'
              ? 'bg-investigative-violet text-white font-normal shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Workspace</span>
        </button>

        <button
          onClick={() => setActiveView('evidence')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-150 ${
            activeView === 'evidence'
              ? 'bg-investigative-violet text-white font-normal shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Evidence</span>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
            activeView === 'evidence' ? 'bg-white/20 text-white' : 'bg-investigative-surface-raised text-investigative-text-muted'
          }`}>
            {evidenceList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('finding')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-150 ${
            activeView === 'finding'
              ? 'bg-investigative-violet text-white font-normal shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Finding</span>
        </button>
      </nav>

      {/* Minimalist Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={resetCurrentCase}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
          title="Reset database to initial state"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline font-light">Reset</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-light">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline font-light">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
