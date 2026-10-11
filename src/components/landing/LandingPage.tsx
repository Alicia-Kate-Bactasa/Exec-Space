import React, { useMemo, useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Database, ArrowRight, Search, CheckCircle2, Terminal, Pin, Trophy } from 'lucide-react';
import { CaseDefinition } from '../../types';

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

const FILTERS: DifficultyFilter[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CaseCard: React.FC<{
  c: CaseDefinition;
  solved: boolean;
  onStart: (id: string) => void;
}> = ({ c, solved, onStart }) => (
  <div className="p-6 rounded-3xl bg-investigative-surface border border-investigative-border/60 hover:border-investigative-violet/60 transition-colors flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-medium text-investigative-violet bg-investigative-violet-subtle border border-investigative-violet/20 px-3 py-1 rounded-full">
          {c.code}
        </span>
        <span className={`text-xs px-3 py-1 rounded-full font-mono font-medium ${
          c.difficulty === 'Beginner'
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
            : c.difficulty === 'Intermediate'
            ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
            : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
        }`}>
          {c.difficulty}
        </span>
      </div>

      <h3 className="text-base font-medium text-investigative-text mb-1 flex items-center gap-2">
        {c.title}
        {solved && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
      </h3>
      <p className="text-sm font-light text-investigative-text-muted leading-relaxed mb-4">
        {c.summary}
      </p>

      <div className="text-xs text-investigative-text-muted/80 font-mono flex items-center space-x-2 mb-4">
        <Database className="w-3.5 h-3.5 text-investigative-violet" />
        <span>Tables: {c.tables.map((t) => t.name).join(', ')}</span>
      </div>
    </div>

    <button
      onClick={() => onStart(c.id)}
      className="w-full flex items-center justify-center space-x-2 py-3 rounded-full bg-investigative-surface-raised border border-investigative-border/70 hover:border-investigative-violet hover:bg-investigative-violet hover:text-white text-investigative-text text-sm font-medium transition-colors"
    >
      <span>{solved ? 'Review Case' : 'Start Case'}</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

const STEPS = [
  { n: '1', t: 'Pick a set', d: 'Start with Beginner. Each set is one clear question.' },
  { n: '2', t: 'Run & explore', d: 'Press Run on the starter query, then tweak it.' },
  { n: '3', t: 'Pin & solve', d: 'Save evidence, then submit your finding.' },
];

const CasesSection: React.FC<{
  visible: CaseDefinition[];
  groups: { title: string; hint: string; items: CaseDefinition[] }[];
  query: string;
  isSolved: (id: string) => boolean;
  onStart: (id: string) => void;
}> = ({ visible, groups, query, isSolved, onStart }) => (
  <section id="cases-section" className="px-6 pb-12 max-w-6xl mx-auto">
    {visible.length === 0 && (
      <div className="p-8 text-center border border-dashed border-investigative-border/60 rounded-3xl text-sm text-investigative-text-muted">
        No sets match “{query}”. Try clearing the search or picking another level.
      </div>
    )}
    {groups.map((g) =>
      g.items.length > 0 ? (
        <div key={g.title} className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-light tracking-tight">{g.title}</h2>
            <span className="text-xs font-mono text-investigative-text-muted">{g.hint} · {g.items.length} sets</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {g.items.map((c) => (
              <CaseCard key={c.id} c={c} solved={isSolved(c.id)} onStart={onStart} />
            ))}
          </div>
        </div>
      ) : null
    )}
  </section>
);

export const LandingPage: React.FC = () => {
  const { cases, selectCase, setActiveView, findings } = useCaseStore();
  const { user, openAuth } = useAuthStore();
  const [filter, setFilter] = useState<DifficultyFilter>('All');
  const [query, setQuery] = useState('');

  const handleStartCase = (caseId: string) => {
    selectCase(caseId);
    setActiveView('workspace');
  };

  const isSolved = (id: string) => findings[id]?.verdict?.status === 'VERIFIED';
  const solvedCount = cases.filter((c) => isSolved(c.id)).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      if (filter !== 'All' && c.difficulty !== filter) return false;
      if (!q) return true;
      return `${c.code} ${c.title} ${c.summary} ${c.category}`.toLowerCase().includes(q);
    });
  }, [cases, filter, query]);

  const groups: { title: string; hint: string; items: CaseDefinition[] }[] = useMemo(() => {
    if (filter !== 'All') return [{ title: `${filter} sets`, hint: `${visible.length} of ${cases.length}`, items: visible }];
    const by = (d: DifficultyFilter) => visible.filter((c) => c.difficulty === d);
    return [
      { title: 'Start here — Beginner', hint: 'Learn SELECT, WHERE, GROUP BY', items: by('Beginner') },
      { title: 'Next — Intermediate', hint: 'Joins, aggregates, anomalies', items: by('Intermediate') },
      { title: 'Challenge — Advanced', hint: 'Windows, CTEs, dedup logic', items: by('Advanced') },
    ];
  }, [visible, filter, cases.length]);

  // Logged-out guests get a persuasive landing page: no hero grid, no case
  // list — just what the app is, how it works, and clear calls to action.
  if (!user) {
    const levelCards = [
      { level: 'Beginner' as const, skill: 'SELECT, WHERE, GROUP BY', blurb: 'No experience needed. Each set asks one clear question and walks you through the query.' },
      { level: 'Intermediate' as const, skill: 'Joins, aggregates, anomalies', blurb: 'Connect tables, spot the numbers that don’t add up, and build the case.' },
      { level: 'Advanced' as const, skill: 'Windows, CTEs, dedup logic', blurb: 'For when you’re ready: layered queries and tricky data-quality puzzles.' },
    ];
    const countFor = (level: string) => cases.filter((c) => c.difficulty === level).length;

    return (
      <div className="h-full overflow-y-auto bg-investigative-bg text-investigative-text select-none">
        {/* Guest header bar — brand + auth CTAs (app Header stays login-only) */}
        <div className="sticky top-0 z-10 bg-investigative-bg/90 backdrop-blur-md border-b border-investigative-border/40">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/ExecSpaceLogo.png"
                alt="ExecSpace Logo"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('/assets/')) target.src = '/assets/ExecSpaceLogo.png';
                }}
              />
              <span className="text-lg font-light tracking-wide">ExecSpace</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2 rounded-full text-sm text-investigative-text-muted hover:text-investigative-text transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="px-5 py-2 rounded-full bg-investigative-violet text-white text-sm font-medium hover:bg-investigative-violet-hover transition-colors"
              >
                Sign up free
              </button>
            </div>
          </div>
        </div>

        {/* Section 1 — Hero: what ExecSpace is + primary CTA */}
        <section className="px-6 pt-16 pb-14 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight mb-4 leading-tight">
            Learn SQL by solving<br className="hidden sm:block" /> database mysteries.
          </h1>
          <p className="text-sm sm:text-lg text-investigative-text-muted leading-relaxed font-light mb-8 max-w-2xl mx-auto">
            ExecSpace turns practice queries into detective work. Run real SQL against
            realistic datasets, pin your evidence, and prove your finding — easiest
            case first, no setup required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => openAuth('signup')}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-investigative-violet text-white text-sm font-medium hover:bg-investigative-violet-hover transition-colors"
            >
              Sign up free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAuth('login')}
              className="px-7 py-3 rounded-full border border-investigative-border/70 text-sm text-investigative-text hover:border-investigative-violet transition-colors"
            >
              Log in
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-mono text-investigative-text-muted">
            <span>{cases.length} case sets</span>
            <span>3 difficulty levels</span>
            <span>Zero install</span>
            <span>Progress auto-saved</span>
          </div>
        </section>

        {/* Section 2 — What you get */}
        <section className="px-6 py-14 max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2 text-center">Everything you need to learn by doing</h2>
          <p className="text-sm text-investigative-text-muted font-light mb-8 text-center max-w-xl mx-auto">
            No tutorials to watch, no database to install. Just open a case and start querying.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Terminal, t: 'Real SQL, zero setup', d: 'Queries run in your browser against an in-memory database. Nothing to install, ever.' },
              { icon: Search, t: 'Mysteries, not exercises', d: 'Each set is a small story — failed orders, refund spikes, duplicate rows — with one clear question to answer.' },
              { icon: Pin, t: 'Pin your evidence', d: 'Save the query results that matter onto your evidence board as you investigate.' },
              { icon: Trophy, t: 'Prove your finding', d: 'Submit your culprit and explanation for instant feedback, and watch your solved count grow.' },
            ].map((f) => (
              <div key={f.t} className="p-6 rounded-3xl bg-investigative-surface border border-investigative-border/60">
                <div className="w-10 h-10 rounded-2xl bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center text-investigative-violet mb-3">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium mb-1.5">{f.t}</h3>
                <p className="text-xs font-light text-investigative-text-muted leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — How it works */}
        <section className="px-6 py-14 max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2 text-center">How it works</h2>
          <p className="text-sm text-investigative-text-muted font-light mb-8 text-center max-w-xl mx-auto">
            Three steps, repeated across every case — the same loop real analysts run.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="p-6 rounded-3xl bg-investigative-surface border border-investigative-border/60">
                <div className="w-9 h-9 rounded-full bg-investigative-violet text-white flex items-center justify-center font-semibold text-sm mb-3">
                  {s.n}
                </div>
                <h3 className="text-sm font-medium mb-1">{s.t}</h3>
                <p className="text-xs font-light text-investigative-text-muted leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Learning path, no case list */}
        <section className="px-6 py-14 max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2 text-center">A path from first query to confident</h2>
          <p className="text-sm text-investigative-text-muted font-light mb-8 text-center max-w-xl mx-auto">
            Cases unlock in order of difficulty, so you always know what to try next.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {levelCards.map((l) => (
              <div key={l.level} className="p-6 rounded-3xl bg-investigative-surface border border-investigative-border/60 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{l.level}</span>
                  <span className="text-xs font-mono text-investigative-text-muted">{countFor(l.level)} sets</span>
                </div>
                <div className="text-xs font-mono text-investigative-violet mb-2">{l.skill}</div>
                <p className="text-xs font-light text-investigative-text-muted leading-relaxed mb-5 flex-1">{l.blurb}</p>
                <button
                  onClick={() => openAuth('signup')}
                  className="w-full py-2.5 rounded-full border border-investigative-border/70 text-xs font-medium hover:border-investigative-violet hover:text-investigative-violet transition-colors"
                >
                  Start here
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Detached call-to-action card */}
        <section className="px-6 pb-16 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-investigative-violet/30 bg-investigative-violet-subtle px-6 py-12 sm:px-12 text-center">
            <h2 className="text-xl sm:text-3xl font-light tracking-tight mb-3">
              Your first mystery is waiting.
            </h2>
            <p className="text-sm text-investigative-text-muted font-light mb-7 max-w-lg mx-auto">
              Create a free account to save your progress across all 30 case sets —
              or log in to pick up exactly where you left off.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => openAuth('signup')}
                className="flex items-center gap-2 px-7 py-3 rounded-full bg-investigative-violet text-white text-sm font-medium hover:bg-investigative-violet-hover transition-colors"
              >
                Sign up free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuth('login')}
                className="px-7 py-3 rounded-full border border-investigative-violet/40 text-sm text-investigative-text hover:border-investigative-violet transition-colors"
              >
                Log in
              </button>
            </div>
          </div>
        </section>

        <footer className="py-8 px-6 border-t border-investigative-border/40 text-center text-xs text-investigative-text-muted font-mono">
          ExecSpace — 30 gentle database investigations for beginners
        </footer>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-investigative-bg text-investigative-text select-none">
      {/* HERO — minimal, no glow, no staged animation */}
      <section className="px-6 pt-12 pb-10 max-w-6xl mx-auto text-left">
        <div className="flex items-start gap-5 mb-8">
          <img
            src="/ExecSpaceLogo.png"
            alt="ExecSpace Logo"
            className="w-16 h-auto object-contain shrink-0"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('/assets/')) target.src = '/assets/ExecSpaceLogo.png';
            }}
          />
          <div>
            <div className="text-3xl font-light tracking-tight mb-2">ExecSpace</div>
            <h1 className="text-xl sm:text-2xl font-normal tracking-tight mb-3 leading-snug">
              Solve 30 bite-size database mysteries, easiest first.
            </h1>
            <p className="text-sm sm:text-base text-investigative-text-muted leading-relaxed font-light mb-4">
              Pick a set below, run the starter query, pin evidence, and submit your finding.
              Your progress saves automatically.
            </p>
            {/* Progress */}
            <div className="max-w-md">
              <div className="flex justify-between text-xs font-mono text-investigative-text-muted mb-1.5">
                <span>Your progress</span>
                <span>{solvedCount} of {cases.length} solved</span>
              </div>
              <div className="h-2 rounded-full bg-investigative-surface-raised border border-investigative-border/60 overflow-hidden">
                <div
                  className="h-full bg-investigative-violet rounded-full transition-all"
                  style={{ width: `${cases.length ? (solvedCount / cases.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 minimal steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {STEPS.map((s) => (
            <div key={s.n} className="p-5 rounded-2xl bg-investigative-surface border border-investigative-border/60">
              <div className="w-8 h-8 rounded-full bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center text-investigative-violet font-semibold text-xs mb-2">
                {s.n}
              </div>
              <h2 className="text-sm font-medium mb-1">{s.t}</h2>
              <p className="text-xs font-light text-investigative-text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>

        {/* Search + difficulty filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2 flex-1 bg-investigative-surface border border-investigative-border/60 rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-investigative-text-muted shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 30 sets (e.g. refund, join, window)..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-investigative-text-muted/60"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                  filter === f
                    ? 'bg-investigative-violet text-white border-investigative-violet'
                    : 'border-investigative-border/70 text-investigative-text-muted hover:text-investigative-text'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ALL CASES — rendered in one go, grouped by level, no pagination */}
      <CasesSection visible={visible} groups={groups} query={query} isSolved={isSolved} onStart={handleStartCase} />

      <footer className="py-8 px-6 border-t border-investigative-border/40 text-center text-xs text-investigative-text-muted font-mono">
        ExecSpace — 30 gentle database investigations for beginners
      </footer>
    </div>
  );
};
