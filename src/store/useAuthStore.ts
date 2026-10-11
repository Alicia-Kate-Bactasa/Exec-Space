import { create } from 'zustand';

export type AuthMode = 'login' | 'signup';

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthStoreState {
  user: AuthUser | null;
  isAuthOpen: boolean;
  authMode: AuthMode;
  authError: string | null;

  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
  signUp: (name: string, email: string, password: string) => boolean;
  logIn: (email: string, password: string) => boolean;
  logOut: () => void;
}

const USERS_KEY = 'execspace_users';
const SESSION_KEY = 'execspace_user';

const readUsers = (): Record<string, StoredUser> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeUsers = (users: Record<string, StoredUser>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizeName = (name: string) => name.trim();

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: typeof window === 'undefined' ? null : readSession(),
  isAuthOpen: false,
  authMode: 'login',
  authError: null,

  openAuth: (mode = 'login') => set({ isAuthOpen: true, authMode: mode, authError: null }),
  closeAuth: () => set({ isAuthOpen: false, authError: null }),
  setAuthMode: (mode) => set({ authMode: mode, authError: null }),

  signUp: (name, email, password) => {
    const cleanName = normalizeName(name);
    const cleanEmail = normalizeEmail(email);

    if (!cleanName) {
      set({ authError: 'Please enter your name.' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      set({ authError: 'Please enter a valid email address.' });
      return false;
    }
    if (password.length < 6) {
      set({ authError: 'Password must be at least 6 characters.' });
      return false;
    }

    const users = readUsers();
    if (users[cleanEmail]) {
      set({ authError: 'An account with this email already exists. Try logging in.' });
      return false;
    }

    users[cleanEmail] = { name: cleanName, email: cleanEmail, password };
    writeUsers(users);

    const user: AuthUser = { name: cleanName, email: cleanEmail };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user, isAuthOpen: false, authError: null });
    return true;
  },

  logIn: (email, password) => {
    const cleanEmail = normalizeEmail(email);
    const users = readUsers();
    const existing = users[cleanEmail];

    if (!existing || existing.password !== password) {
      set({ authError: 'Invalid email or password.' });
      return false;
    }

    const user: AuthUser = { name: existing.name, email: existing.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user, isAuthOpen: false, authError: null });
    return true;
  },

  logOut: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null });
  },
}));
