import React from 'react';
import { User, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const ProfilePage: React.FC = () => {
  const { user, openAuth } = useAuthStore();

  if (!user) {
    return (
      <section className="h-full w-full flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-investigative-border/60 bg-investigative-surface p-6 text-center space-y-3">
          <h1 className="text-xl font-semibold text-investigative-text">Profile</h1>
          <p className="text-sm text-investigative-text-muted">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => openAuth('login')}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors"
          >
            Log in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full w-full flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-investigative-border/60 bg-investigative-surface p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-investigative-text">Profile</h1>

        <div className="space-y-4">
          <div className="rounded-xl border border-investigative-border/60 bg-investigative-surface-raised/30 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-investigative-text-muted mb-1">Name</p>
            <p className="flex items-center gap-2 text-sm md:text-base text-investigative-text">
              <User className="w-4 h-4 text-investigative-violet" />
              {user.name}
            </p>
          </div>

          <div className="rounded-xl border border-investigative-border/60 bg-investigative-surface-raised/30 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-investigative-text-muted mb-1">Email</p>
            <p className="flex items-center gap-2 text-sm md:text-base text-investigative-text break-all">
              <Mail className="w-4 h-4 text-investigative-violet" />
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
