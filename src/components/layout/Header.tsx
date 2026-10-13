import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Moon, Sun, RotateCcw, Home, BookOpen, BookmarkCheck, FileText, LogIn, UserPlus, LogOut, User, CircleHelp, PanelTopClose, PanelTopOpen } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    evidenceList,
    theme,
    toggleTheme,
    resetCurrentCase,
    headerCollapsed,
    toggleHeaderCollapsed,
  } = useCaseStore();
  const { user, openAuth, logOut } = useAuthStore();
  const [logoError, setLogoError] = useState(false);
  const navButtonClass = (isActive: boolean) =>
    `flex items-center ${headerCollapsed ? 'justify-center px-2.5 py-2' : 'space-x-2 px-4 py-2'} rounded-full text-sm transition-all duration-150 ${
      isActive
        ? 'bg-investigative-violet text-white font-normal shadow-xs'
        : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60'
    }`;

  return (
    <header className={`${headerCollapsed ? 'h-14' : 'h-18 md:h-20'} border-b border-investigative-border/50 bg-investigative-surface/95 px-4 md:px-6 flex items-center justify-between select-none shrink-0 z-20 backdrop-blur-md`}>
      {/* Brand & Clickable Logo to return to Home/Landing */}
      <div className={`flex items-center ${headerCollapsed ? 'space-x-2' : 'space-x-3.5'}`}>
        <button
          onClick={() => setActiveView('landing')}
          className={`flex items-center ${headerCollapsed ? 'space-x-1.5' : 'space-x-3'} hover:opacity-85 transition-opacity focus:outline-none`}
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
          <span className={`${headerCollapsed ? 'hidden sm:inline text-base' : 'text-xl md:text-2xl'} font-light tracking-wide text-investigative-text`}>
            ExecSpace
          </span>
        </button>
      </div>

      {/* Minimalist Navigation with preserved hover effects */}
      <nav aria-label="Main Navigation" className={`flex items-center ${headerCollapsed ? 'space-x-1' : 'space-x-1 sm:space-x-2'}`}>
        <button
          onClick={() => setActiveView('landing')}
          className={navButtonClass(activeView === 'landing')}
          title="Home"
        >
          <Home className="w-4 h-4" />
          {!headerCollapsed && <span>Home</span>}
        </button>

        <button
          onClick={() => setActiveView('workspace')}
          className={navButtonClass(activeView === 'workspace')}
          title="Workspace"
        >
          <BookOpen className="w-4 h-4" />
          {!headerCollapsed && <span>Workspace</span>}
        </button>

        <button
          onClick={() => setActiveView('evidence')}
          className={navButtonClass(activeView === 'evidence')}
          title="Evidence"
        >
          <BookmarkCheck className="w-4 h-4" />
          {!headerCollapsed && <span>Evidence</span>}
          <span className={`${headerCollapsed ? 'ml-0.5' : ''} text-[11px] font-mono px-2 py-0.5 rounded-full ${
            activeView === 'evidence' ? 'bg-white/20 text-white' : 'bg-investigative-surface-raised text-investigative-text-muted'
          }`}>
            {evidenceList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('finding')}
          className={navButtonClass(activeView === 'finding')}
          title="Finding"
        >
          <FileText className="w-4 h-4" />
          {!headerCollapsed && <span>Finding</span>}
        </button>

        {user && (
          <button
            onClick={() => setActiveView('profile')}
            className={navButtonClass(activeView === 'profile')}
            title="Profile"
          >
            <User className="w-4 h-4" />
            {!headerCollapsed && <span>Profile</span>}
          </button>
        )}

        <button
          onClick={() => setActiveView('help')}
          className={navButtonClass(activeView === 'help')}
          title="Open help page"
        >
          <CircleHelp className="w-4 h-4" />
          {!headerCollapsed && <span>Help</span>}
        </button>
      </nav>

      {/* Minimalist Actions */}
      <div className={`flex items-center ${headerCollapsed ? 'space-x-1.5' : 'space-x-2'}`}>
        {user ? (
          <>
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              title={user.email}
              className={`${headerCollapsed ? 'hidden' : 'hidden md:flex'} items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-investigative-surface-raised/60 border border-investigative-border/60 text-sm cursor-pointer hover:bg-investigative-surface-raised transition-colors`}
            >
              <span className="w-7 h-7 rounded-full bg-investigative-violet text-white flex items-center justify-center text-xs font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-28 truncate font-light">{user.name}</span>
            </button>
            <button
              onClick={logOut}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
              title={`Log out (${user.email})`}
            >
              <LogOut className="w-4 h-4" />
              {!headerCollapsed && <span className="hidden sm:inline font-light">Log out</span>}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => openAuth('login')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {!headerCollapsed && <span className="hidden sm:inline font-light">Log in</span>}
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors font-medium"
            >
              <UserPlus className="w-4 h-4" />
              {!headerCollapsed && <span className="hidden sm:inline">Sign up</span>}
            </button>
          </>
        )}
        <button
          onClick={resetCurrentCase}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
          title="Reset database to initial state"
        >
          <RotateCcw className="w-4 h-4" />
          {!headerCollapsed && <span className="hidden sm:inline font-light">Reset</span>}
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              {!headerCollapsed && <span className="hidden sm:inline font-light">Light</span>}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              {!headerCollapsed && <span className="hidden sm:inline font-light">Dark</span>}
            </>
          )}
        </button>

        <button
          onClick={toggleHeaderCollapsed}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised/60 transition-colors"
          title={headerCollapsed ? 'Expand header' : 'Collapse header'}
        >
          {headerCollapsed ? <PanelTopOpen className="w-4 h-4" /> : <PanelTopClose className="w-4 h-4" />}
          {!headerCollapsed && <span className="hidden md:inline font-light">Collapse</span>}
        </button>
      </div>
    </header>
  );
};
