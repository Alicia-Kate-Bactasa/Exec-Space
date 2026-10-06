import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Moon, Sun, RotateCcw, BookOpen, BookmarkCheck, FileText } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeView, setActiveView, evidenceList, theme, toggleTheme, resetCurrentCase } = useCaseStore();
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="h-13 border-b border-investigative-border/70 bg-investigative-surface/95 px-4 flex items-center justify-between select-none shrink-0 z-20 backdrop-blur-md">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          {!logoError ? (
            <img
              src="/ExecSpaceLogo.png"
              alt="ExecSpace Logo"
              onError={() => {
                // Try alternate path before falling back
                const img = document.getElementById('header-logo-img') as HTMLImageElement;
                if (img && !img.src.includes('/assets/')) {
                  img.src = '/assets/ExecSpaceLogo.png';
                } else {
                  setLogoError(true);
                }
              }}
              id="header-logo-img"
              className="h-8 w-auto object-contain max-h-8"
            />
          ) : (
            <div className="flex items-center space-x-2 bg-investigative-violet-subtle border border-investigative-violet/30 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-investigative-violet" />
              <span className="font-mono font-bold tracking-wider text-xs text-investigative-text">EXECSPACE</span>
            </div>
          )}
          <span className="text-[11px] text-investigative-text-muted/80 hidden sm:inline-block border-l border-investigative-border/60 pl-3 font-mono">
            Data Detective
          </span>
        </div>
      </div>

      {/* Simplified, Clean View Switcher Navigation (Reclaiming vertical space) */}
      <nav aria-label="Main Navigation" className="flex items-center space-x-1.5 bg-investigative-surface-raised/70 p-1 rounded-lg border border-investigative-border/50">
        <button
          onClick={() => setActiveView('workspace')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs transition-all duration-150 ${
            activeView === 'workspace'
              ? 'bg-investigative-violet text-white font-medium shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Workspace</span>
        </button>

        <button
          onClick={() => setActiveView('evidence')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs transition-all duration-150 ${
            activeView === 'evidence'
              ? 'bg-investigative-violet text-white font-medium shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface'
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Evidence</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
            activeView === 'evidence' ? 'bg-white/20 text-white' : 'bg-investigative-border/70 text-investigative-text-muted'
          }`}>
            {evidenceList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('finding')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs transition-all duration-150 ${
            activeView === 'finding'
              ? 'bg-investigative-violet text-white font-medium shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Finding</span>
        </button>
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={resetCurrentCase}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised border border-investigative-border/70 transition-colors"
          title="Reset database to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Case</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised border border-investigative-border/70 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
