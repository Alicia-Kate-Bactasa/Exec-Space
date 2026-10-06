import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Database, Search, BookmarkCheck, FileText, ArrowRight, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { cases, selectCase, setActiveView } = useCaseStore();

  const handleStartCase = (caseId: string) => {
    selectCase(caseId);
    setActiveView('workspace');
  };

  return (
    <div className="h-full overflow-y-auto bg-investigative-bg text-investigative-text select-none">
      {/* HERO SECTION */}
      <section className="relative px-6 pt-12 pb-16 md:pt-16 md:pb-24 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Soft Violet Atmospheric Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Big Logo Showcase */}
        <div className="relative mb-8 p-3 rounded-3xl bg-investigative-surface-raised/40 border border-investigative-border/60 shadow-2xl backdrop-blur-sm group transition-transform duration-300 hover:scale-[1.02]">
          <img
            src="/ExecSpaceLogo.png"
            alt="ExecSpace Logo"
            className="w-48 sm:w-64 md:w-80 h-auto object-contain mx-auto rounded-2xl drop-shadow-md"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('/assets/')) {
                target.src = '/assets/ExecSpaceLogo.png';
              }
            }}
          />
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-investigative-text mb-4 max-w-3xl leading-tight">
          Investigate realistic database mysteries instead of answering SQL quizzes.
        </h1>

        {/* Subhead with larger text and cool gray tones */}
        <p className="text-base sm:text-lg text-investigative-text-muted max-w-2xl mb-8 leading-relaxed font-normal">
          A minimalist data detective playground for students. Explore real company databases in your browser, uncover discrepancies, collect evidence, and submit your findings.
        </p>

        {/* Hero Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => handleStartCase('case-04')}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-investigative-violet hover:bg-investigative-violet-hover text-white text-base font-semibold transition-all duration-200 shadow-md hover:shadow-violet-900/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#cases-section"
            className="px-6 py-3.5 rounded-xl bg-investigative-surface-raised/70 border border-investigative-border hover:border-investigative-violet/50 text-investigative-text text-base font-medium transition-all duration-200 hover:bg-investigative-surface"
          >
            Explore Available Cases
          </a>
        </div>

        {/* 4-STEP HOW IT WORKS SECTION */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-16">
          <div className="p-5 rounded-2xl bg-investigative-surface/80 border border-investigative-border/60 shadow-xs hover:border-investigative-violet/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center text-investigative-violet font-bold text-sm mb-3">
              1
            </div>
            <h2 className="text-base font-semibold text-investigative-text mb-1">
              Choose a Case
            </h2>
            <p className="text-sm text-investigative-text-muted leading-relaxed">
              Receive a realistic company brief such as missing revenue or duplicate charges.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-investigative-surface/80 border border-investigative-border/60 shadow-xs hover:border-investigative-violet/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center text-investigative-violet font-bold text-sm mb-3">
              2
            </div>
            <h2 className="text-base font-semibold text-investigative-text mb-1">
              Explore Database
            </h2>
            <p className="text-sm text-investigative-text-muted leading-relaxed">
              Inspect tables, columns, data types, and sample records directly in PostgreSQL.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-investigative-surface/80 border border-investigative-border/60 shadow-xs hover:border-investigative-violet/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center text-investigative-violet font-bold text-sm mb-3">
              3
            </div>
            <h2 className="text-base font-semibold text-investigative-text mb-1">
              Write SQL & Evidence
            </h2>
            <p className="text-sm text-investigative-text-muted leading-relaxed">
              Execute queries, visualize charts, and pin query results directly to your Evidence Board.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-investigative-surface/80 border border-investigative-border/60 shadow-xs hover:border-investigative-violet/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center text-investigative-violet font-bold text-sm mb-3">
              4
            </div>
            <h2 className="text-base font-semibold text-investigative-text mb-1">
              Submit Finding
            </h2>
            <p className="text-sm text-investigative-text-muted leading-relaxed">
              Explain the root cause and get instant evaluation feedback against ground truth.
            </p>
          </div>
        </div>
      </section>

      {/* CASES SHOWCASE SECTION */}
      <section id="cases-section" className="px-6 py-12 max-w-5xl mx-auto border-t border-investigative-border/50">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-investigative-text mb-2 tracking-tight">
            Available Detective Cases
          </h2>
          <p className="text-sm sm:text-base text-investigative-text-muted max-w-xl mx-auto">
            Choose any scenario below to open the investigation workspace with loaded data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {cases.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-investigative-surface border border-investigative-border/60 hover:border-investigative-violet/70 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-investigative-violet bg-investigative-violet-subtle border border-investigative-violet/20 px-2.5 py-1 rounded-md">
                    {c.code}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-mono font-medium ${
                    c.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : c.difficulty === 'Intermediate'
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {c.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-investigative-text mb-2">
                  {c.title}
                </h3>
                <p className="text-sm text-investigative-text-muted leading-relaxed mb-4">
                  {c.summary}
                </p>

                <div className="text-xs text-investigative-text-muted/80 font-mono flex items-center space-x-2 mb-4">
                  <Database className="w-3.5 h-3.5 text-investigative-violet" />
                  <span>Tables: {c.tables.map((t) => t.name).join(', ')}</span>
                </div>
              </div>

              <button
                onClick={() => handleStartCase(c.id)}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-investigative-surface-raised border border-investigative-border/70 hover:border-investigative-violet hover:bg-investigative-violet hover:text-white text-investigative-text text-sm font-semibold transition-all duration-150"
              >
                <span>Start Case</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-investigative-border/40 text-center text-xs text-investigative-text-muted font-mono">
        ExecSpace — Minimalist Database Detective Playground for Students
      </footer>
    </div>
  );
};
