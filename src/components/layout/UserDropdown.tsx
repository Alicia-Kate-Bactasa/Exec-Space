import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  CircleHelp,
  RotateCcw,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useCaseStore } from '../../store/useCaseStore';
import { useAuthStore } from '../../store/useAuthStore';

export const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    activeView,
    setActiveView,
    theme,
    toggleTheme,
    resetCurrentCase,
  } = useCaseStore();

  const { user, logOut } = useAuthStore();

  const displayName = user?.name?.trim() || 'Mimokii_ii';
  const displayEmail = user?.email?.trim() || 'mimokii@execspace.dev';
  const userInitial = displayName.charAt(0).toUpperCase() || 'M';

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectView = (view: 'profile' | 'help') => {
    setActiveView(view);
    setIsOpen(false);
  };

  const handleReset = async () => {
    await resetCurrentCase();
    setIsOpen(false);
  };

  const handleLogOut = () => {
    setIsOpen(false);
    logOut();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* User Profile Chip Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title={`Account: ${displayName}`}
        className={`group flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-investigative-violet/40 ${
          isOpen
            ? 'bg-investigative-surface-raised border-investigative-violet/50 shadow-xs'
            : 'bg-investigative-surface-raised/70 border-investigative-border/60 hover:bg-investigative-surface-raised hover:border-investigative-border text-investigative-text'
        }`}
      >
        <span className="w-7 h-7 rounded-full bg-investigative-violet text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs">
          {userInitial}
        </span>
        <span className="font-normal text-sm text-investigative-text truncate max-w-28 sm:max-w-36">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-investigative-text-muted transition-transform duration-200 group-hover:text-investigative-text shrink-0 ${
            isOpen ? 'rotate-180 text-investigative-violet' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-investigative-surface border border-investigative-border/80 shadow-2xl shadow-black/30 backdrop-blur-md z-50 py-1.5 text-investigative-text overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-investigative-border/50 bg-investigative-surface-raised/30 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-investigative-violet text-white flex items-center justify-center text-sm font-semibold shrink-0 shadow-xs">
              {userInitial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-investigative-text truncate leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-investigative-text-muted truncate mt-0.5">
                {displayEmail}
              </p>
            </div>
          </div>

          {/* Navigation Links: Profile & Help */}
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSelectView('profile')}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left group cursor-pointer ${
                activeView === 'profile'
                  ? 'bg-investigative-violet-subtle text-investigative-violet font-medium'
                  : 'text-investigative-text hover:bg-investigative-surface-raised/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-investigative-text-muted group-hover:text-investigative-violet transition-colors" />
                <span>Profile</span>
              </div>
              {activeView === 'profile' && <Check className="w-4 h-4 text-investigative-violet" />}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleSelectView('help')}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left group cursor-pointer ${
                activeView === 'help'
                  ? 'bg-investigative-violet-subtle text-investigative-violet font-medium'
                  : 'text-investigative-text hover:bg-investigative-surface-raised/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CircleHelp className="w-4 h-4 text-investigative-text-muted group-hover:text-investigative-violet transition-colors" />
                <span>Help</span>
              </div>
              {activeView === 'help' && <Check className="w-4 h-4 text-investigative-violet" />}
            </button>
          </div>

          <div className="border-t border-investigative-border/50 my-1" />

          {/* Secondary Utilities: Theme Toggle & Reset */}
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-investigative-text hover:bg-investigative-surface-raised/80 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
                <span>Theme</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-investigative-surface-raised text-investigative-text-muted border border-investigative-border/60">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleReset}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-investigative-text hover:bg-investigative-surface-raised/80 transition-colors text-left group cursor-pointer"
              title="Reset database to initial state"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-investigative-text-muted group-hover:text-amber-400 transition-colors" />
                <span>Reset</span>
              </div>
            </button>
          </div>

          <div className="border-t border-investigative-border/50 my-1" />

          {/* Account Actions: Log out */}
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-investigative-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-left group cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-investigative-text-muted group-hover:text-rose-400 transition-colors" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
