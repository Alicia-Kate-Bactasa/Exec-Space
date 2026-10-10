import React, { useMemo, useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Database, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
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

export const LandingPage: React.FC = () => {
  const { cases, selectCase, setActiveView, findings } = useCaseStore();
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

  return (
    <div className="h-full overflow-y-auto bg-investigative-bg text-investigative-text select-none">
      {/* HERO — minimal, no glow, no staged animation */}
      <section className="px-6 pt-12 pb-10 max-w-5xl mx-auto text-left">
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
          {[
            { n: '1', t: 'Pick a set', d: 'Start with Beginner. Each set is one clear question.' },
            { n: '2', t: 'Run & explore', d: 'Press Run on the starter query, then tweak it.' },
            { n: '3', t: 'Pin & solve', d: 'Save evidence, then submit your finding.' },
          ].map((s) => (
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
      <section id="cases-section" className="px-6 pb-12 max-w-5xl mx-auto">
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
                  <CaseCard key={c.id} c={c} solved={isSolved(c.id)} onStart={handleStartCase} />
                ))}
              </div>
            </div>
          ) : null
        )}
      </section>

      <footer className="py-8 px-6 border-t border-investigative-border/40 text-center text-xs text-investigative-text-muted font-mono">
        ExecSpace — 30 gentle database investigations for beginners
      </footer>
    </div>
  );
};
