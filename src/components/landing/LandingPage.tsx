import React, { useMemo, useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Database,
  ArrowRight,
  Search,
  CheckCircle2,
  FolderOpen,
  LogIn,
  UserPlus,
  Play,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { CaseDefinition } from '../../types';

type LevelType = 'Beginner' | 'Intermediate' | 'Advanced';

const LEVEL_DESCRIPTIONS: Record<LevelType, { title: string; subtitle: string; badgeClass: string; barClass: string }> = {
  Beginner: {
    title: 'Beginner',
    subtitle: 'Learn SELECT, WHERE, and foundational queries. No prior SQL experience needed.',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    barClass: 'bg-emerald-500',
  },
  Intermediate: {
    title: 'Intermediate',
    subtitle: 'Master JOINs, GROUP BY, aggregations, and business logic anomalies.',
    badgeClass: 'bg-violet-500/10 text-violet-400 border border-violet-500/30',
    barClass: 'bg-investigative-violet',
  },
  Advanced: {
    title: 'Advanced',
    subtitle: 'Tackle CTEs, window functions, and complex deduplication logic.',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
    barClass: 'bg-indigo-500',
  },
};

const ProblemCard: React.FC<{
  problem: CaseDefinition;
  solved: boolean;
  onStart: (id: string) => void;
}> = ({ problem, solved, onStart }) => (
  <div className="p-5 rounded-2xl bg-investigative-surface border border-investigative-border/60 hover:border-investigative-violet/60 transition-all flex flex-col justify-between shadow-xs">
    <div>
      {/* Problem Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-bold text-investigative-violet bg-investigative-violet-subtle border border-investigative-violet/20 px-2.5 py-0.5 rounded-full">
            {problem.code}
          </span>
          <span className="text-[11px] font-mono text-investigative-text-muted border border-investigative-border/60 px-2 py-0.5 rounded-full">
            {problem.category}
          </span>
        </div>
        {solved && (
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Solved</span>
          </span>
        )}
      </div>

      {/* Alphabetical Title & Summary */}
      <h3 className="text-sm md:text-base font-semibold text-investigative-text mb-1.5 leading-snug">
        {problem.title}
      </h3>
      <p className="text-xs text-investigative-text-muted font-light leading-relaxed mb-3.5 line-clamp-2">
        {problem.summary}
      </p>

      {/* Tables Involved */}
      <div className="text-[11px] text-investigative-text-muted font-mono flex items-center space-x-1.5 mb-4">
        <Database className="w-3.5 h-3.5 text-investigative-violet shrink-0" />
        <span className="truncate">Tables: {problem.tables.map((t) => t.name).join(', ')}</span>
      </div>
    </div>

    {/* Launch Button */}
    <button
      onClick={() => onStart(problem.id)}
      className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
        solved
          ? 'bg-investigative-surface-raised border-investigative-border/70 hover:border-investigative-violet text-investigative-text hover:bg-investigative-surface-raised/80'
          : 'bg-investigative-violet text-white border-investigative-violet hover:bg-investigative-violet-hover'
      }`}
    >
      <span>{solved ? 'Review Problem' : 'Start Problem'}</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

const LevelMasterCard: React.FC<{
  level: LevelType;
  problems: CaseDefinition[];
  isSolved: (id: string) => boolean;
  onStart: (id: string) => void;
  searchQuery: string;
  defaultExpanded?: boolean;
}> = ({ level, problems, isSolved, onStart, searchQuery, defaultExpanded = true }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const levelInfo = LEVEL_DESCRIPTIONS[level];

  // Auto-expand card if user searches
  const hasActiveSearch = searchQuery.trim().length > 0;
  const isCardOpen = hasActiveSearch ? true : isExpanded;

  // Extract all unique categories for this level and sort alphabetically
  const categories = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [problems]);

  // Filter problems by search query and category, then sort ALPHABETICALLY by title
  const filteredProblems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return problems
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tables.some((t) => t.name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [problems, selectedCategory, searchQuery]);

  const solvedCount = problems.filter((p) => isSolved(p.id)).length;
  const progressPercent = problems.length > 0 ? (solvedCount / problems.length) * 100 : 0;

  return (
    <div className="bg-investigative-surface/80 border border-investigative-border/70 rounded-3xl p-5 md:p-6 mb-5 shadow-xs transition-all">
      {/* Level Card Header — Click to expand / collapse */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors group ${
          isCardOpen ? 'pb-4 border-b border-investigative-border/50' : ''
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div className="mt-1 sm:mt-0.5">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                isCardOpen
                  ? 'bg-investigative-surface-raised border-investigative-border/70 text-investigative-text'
                  : 'bg-investigative-surface-raised/40 border-investigative-border/40 text-investigative-text-muted group-hover:text-investigative-text'
              }`}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCardOpen ? 'rotate-180 text-investigative-violet' : ''
                }`}
              />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${levelInfo.badgeClass}`}>
                {levelInfo.title}
              </span>
              <span className="text-xs font-mono text-investigative-text-muted">
                {problems.length} problems
              </span>
              <span className="text-[11px] font-mono text-investigative-text-muted/60 hidden sm:inline">
                {isCardOpen ? '· Click to collapse' : '· Click to view problems'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-investigative-text-muted font-light max-w-2xl">
              {levelInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Level Solved Progress Bar */}
        <div className="w-full sm:w-56 shrink-0 space-y-1.5 pl-10 sm:pl-0">
          <div className="flex justify-between text-xs font-mono text-investigative-text-muted">
            <span>Completed</span>
            <span className="font-semibold text-investigative-text">
              {solvedCount} / {problems.length}
            </span>
          </div>
          <div className="h-1.5 w-full bg-investigative-surface-raised border border-investigative-border/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${levelInfo.barClass} rounded-full transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Content Area */}
      {isCardOpen && (
        <div className="space-y-5 pt-4 animate-in fade-in duration-150">

      {/* Category Filter Pills (To keep the card organized and avoid clutter) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-investigative-text-muted font-mono mr-1">
          Categories:
        </span>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-investigative-violet text-white font-medium shadow-xs'
              : 'bg-investigative-surface-raised/70 border border-investigative-border/60 text-investigative-text-muted hover:text-investigative-text'
          }`}
        >
          All ({problems.length})
        </button>
        {categories.map((cat) => {
          const catCount = problems.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-investigative-violet text-white font-medium shadow-xs'
                  : 'bg-investigative-surface-raised/70 border border-investigative-border/60 text-investigative-text-muted hover:text-investigative-text'
              }`}
            >
              {cat} ({catCount})
            </button>
          );
        })}
      </div>

      {/* Problems Grid (Arranged Alphabetically) */}
      {filteredProblems.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-investigative-border/60 rounded-2xl text-xs text-investigative-text-muted font-mono">
          No problems found in {level} matching your search or category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map((p) => (
            <ProblemCard
              key={p.id}
              problem={p}
              solved={isSolved(p.id)}
              onStart={onStart}
            />
          ))}
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { cases, selectCase, setActiveView, findings, lastCaseId } = useCaseStore();
  const { user, openAuth } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'All' | LevelType>('All');

  const handleStartCase = (caseId: string) => {
    selectCase(caseId);
    setActiveView('workspace');
  };

  const isSolved = (id: string) => findings[id]?.verdict?.status === 'VERIFIED';
  const totalSolved = cases.filter((c) => isSolved(c.id)).length;
  const lastCase = useMemo(() => cases.find((c) => c.id === lastCaseId) || null, [cases, lastCaseId]);

  // Split problems into the 3 levels
  const beginnerProblems = useMemo(() => cases.filter((c) => c.difficulty === 'Beginner'), [cases]);
  const intermediateProblems = useMemo(() => cases.filter((c) => c.difficulty === 'Intermediate'), [cases]);
  const advancedProblems = useMemo(() => cases.filter((c) => c.difficulty === 'Advanced'), [cases]);

  return (
    <div className="h-full overflow-y-auto bg-investigative-bg text-investigative-text select-none">
      {/* GUEST BANNER (If visitor is not yet logged in) */}
      {!user && (
        <div className="bg-investigative-surface border-b border-investigative-border/50 px-6 py-3 flex items-center justify-between text-xs sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-investigative-text">Welcome to ExecSpace</span>
            <span className="hidden sm:inline text-investigative-text-muted">— 30 interactive SQL investigation sets.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuth('login')}
              className="px-3.5 py-1.5 rounded-full text-investigative-text hover:bg-investigative-surface-raised font-medium transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-4 py-1.5 rounded-full bg-investigative-violet text-white hover:bg-investigative-violet-hover font-medium transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD HERO HEADER */}
      <section className="px-6 pt-8 pb-6 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-investigative-text mb-1.5">
              Dashboard
            </h1>
            <p className="text-sm text-investigative-text-muted font-light max-w-xl">
              Your single source of truth for all database investigation sets. Browse by level, explore categories, and solve real transactional discrepancies.
            </p>
          </div>

          {/* Quick Continue Button if user has active case */}
          {lastCase && (
            <button
              onClick={() => handleStartCase(lastCase.id)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-investigative-surface-raised border border-investigative-border/70 hover:border-investigative-violet text-xs font-medium text-investigative-text transition-colors self-start md:self-auto cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-investigative-violet" />
              <span>Continue {lastCase.code}: {lastCase.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Overall Progress Bar Card */}
        <div className="p-4 rounded-2xl bg-investigative-surface/60 border border-investigative-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <FolderOpen className="w-5 h-5 text-investigative-violet shrink-0" />
            <div>
              <span className="font-semibold text-investigative-text block font-sans">Investigation Progress</span>
              <span className="text-investigative-text-muted">
                {totalSolved} of {cases.length} problems solved ({Math.round((totalSolved / (cases.length || 1)) * 100)}%)
              </span>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="h-2 rounded-full bg-investigative-surface-raised border border-investigative-border/60 overflow-hidden">
              <div
                className="h-full bg-investigative-violet rounded-full transition-all duration-300"
                style={{ width: `${(totalSolved / (cases.length || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global Search & Level Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex items-center gap-2.5 flex-1 bg-investigative-surface border border-investigative-border/60 rounded-full px-4 py-2 text-xs">
            <Search className="w-4 h-4 text-investigative-text-muted shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title, category, or table..."
              className="w-full bg-transparent outline-none placeholder:text-investigative-text-muted/60 text-investigative-text"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                  levelFilter === l
                    ? 'bg-investigative-violet text-white font-medium shadow-xs'
                    : 'bg-investigative-surface-raised/70 border border-investigative-border/60 text-investigative-text-muted hover:text-investigative-text'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3 LEVEL CARDS (The Single Source of Truth) */}
      <main className="px-6 pb-12 max-w-6xl mx-auto">
        {(levelFilter === 'All' || levelFilter === 'Beginner') && (
          <LevelMasterCard
            level="Beginner"
            problems={beginnerProblems}
            isSolved={isSolved}
            onStart={handleStartCase}
            searchQuery={searchQuery}
            defaultExpanded={levelFilter === 'Beginner'}
          />
        )}

        {(levelFilter === 'All' || levelFilter === 'Intermediate') && (
          <LevelMasterCard
            level="Intermediate"
            problems={intermediateProblems}
            isSolved={isSolved}
            onStart={handleStartCase}
            searchQuery={searchQuery}
            defaultExpanded={levelFilter === 'Intermediate'}
          />
        )}

        {(levelFilter === 'All' || levelFilter === 'Advanced') && (
          <LevelMasterCard
            level="Advanced"
            problems={advancedProblems}
            isSolved={isSolved}
            onStart={handleStartCase}
            searchQuery={searchQuery}
            defaultExpanded={levelFilter === 'Advanced'}
          />
        )}
      </main>

      {/* Simple Clean Footer */}
      <footer className="py-6 px-6 border-t border-investigative-border/40 text-center text-xs text-investigative-text-muted font-mono">
        ExecSpace — 30 database investigations arranged by category and difficulty
      </footer>
    </div>
  );
};
