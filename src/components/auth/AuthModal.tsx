import React, { useEffect, useRef, useState } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, authMode, authError, closeAuth, setAuthMode, signUp, logIn } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const isSignup = authMode === 'signup';

  // Reset fields whenever the modal opens / mode changes; focus email; close on Escape
  useEffect(() => {
    if (!isAuthOpen) return;
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    const t = setTimeout(() => emailRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [isAuthOpen, authMode, closeAuth]);

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) signUp(name, email, password);
    else logIn(email, password);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuth();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isSignup ? 'Sign up' : 'Log in'}
    >
      <div className="bg-investigative-surface border border-investigative-border/70 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header with tabs */}
        <div className="p-4 border-b border-investigative-border/50 bg-investigative-surface-raised/30 flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 rounded-full bg-investigative-surface-raised/60 border border-investigative-border/60">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors ${
                !isSignup
                  ? 'bg-investigative-violet text-white font-medium'
                  : 'text-investigative-text-muted hover:text-investigative-text'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Log in
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors ${
                isSignup
                  ? 'bg-investigative-violet text-white font-medium'
                  : 'text-investigative-text-muted hover:text-investigative-text'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign up
            </button>
          </div>
          <button
            onClick={closeAuth}
            aria-label="Close"
            className="text-investigative-text-muted hover:text-investigative-text p-1.5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <h2 className="text-lg font-medium text-investigative-text">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs font-light text-investigative-text-muted mt-1">
              {isSignup
                ? 'Progress saves to this browser. No email verification needed for this demo.'
                : 'Log in to pick up where you left off on this browser.'}
            </p>
          </div>

          {isSignup && (
            <div>
              <label htmlFor="auth-name" className="block font-medium mb-1.5">
                Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="name"
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-xl px-4 py-2.5 text-sm text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block font-medium mb-1.5">
              Email
            </label>
            <input
              id="auth-email"
              ref={emailRef}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-xl px-4 py-2.5 text-sm text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                minLength={isSignup ? 6 : undefined}
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-xl px-4 py-2.5 pr-11 text-sm text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-investigative-text-muted hover:text-investigative-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {authError && (
            <p role="alert" className="text-xs font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors font-medium text-sm"
          >
            {isSignup ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isSignup ? 'Sign up' : 'Log in'}
          </button>

          <p className="text-center text-xs text-investigative-text-muted font-light">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setAuthMode('login')} className="text-investigative-violet font-medium hover:underline">
                  Log in
                </button>
              </>
            ) : (
              <>
                New to ExecSpace?{' '}
                <button type="button" onClick={() => setAuthMode('signup')} className="text-investigative-violet font-medium hover:underline">
                  Create an account
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};
