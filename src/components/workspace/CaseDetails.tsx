import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { HelpCircle, Target, ChevronDown, ChevronUp, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const STEPS = [
  'Read the brief + objective below',
  'Open the Database tab and preview tables',
  'Press Run Query on the starter SQL',
  'Pin the key result with Save Evidence',
  'Submit your finding with the numbers',
];

export const CaseDetails: React.FC = () => {
  const { activeCase, cases, selectCase, setActiveView } = useCaseStore();
  const [showHints, setShowHints] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const idx = cases.findIndex((c) => c.id === activeCase.id);
  const prev = idx > 0 ? cases[idx - 1] : null;
  const next = idx >= 0 && idx < cases.length - 1 ? cases[idx + 1] : null;

  const go = (id: string) => {
    selectCase(id);
    setActiveView('workspace');
  };

  return (
    <div className="bg-investigative-surface/60 border-b border-investigative-border/50 p-5 md:p-6 select-none shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center space-x-2.5 flex-wrap">
          <span className="text-xs md:text-sm font-mono font-bold bg-investigative-violet text-white px-3 py-1 rounded-full tracking-wide">
            {activeCase.code}
          </span>
          <span className="text-xs md:text-sm font-mono border border-investigative-border/70 px-3 py-1 rounded-full text-investigative-text-muted">
            {activeCase.category}
          </span>
          <span className="text-xs md:text-sm font-mono border border-investigative-border/70 px-3 py-1 rounded-full text-investigative-text-muted">
            {activeCase.difficulty}
          </span>
          <h1 className="text-lg md:text-xl font-bold text-investigative-text tracking-tight">
            {activeCase.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => prev && go(prev.id)}
            disabled={!prev}
            className="flex items-center space-x-1 text-xs text-investigative-text-muted hover:text-investigative-text border border-investigative-border/70 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40"
            title={prev ? `Previous: ${prev.title}` : 'First set'}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <span className="text-[11px] font-mono text-investigative-text-muted">
            {idx + 1} / {cases.length}
          </span>
          <button
            onClick={() => next && go(next.id)}
            disabled={!next}
            className="flex items-center space-x-1 text-xs text-investigative-text-muted hover:text-investigative-text border border-investigative-border/70 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40"
            title={next ? `Next: ${next.title}` : 'Last set'}
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center space-x-2 text-xs md:text-sm text-investigative-text-muted hover:text-investigative-violet border border-investigative-border/70 hover:border-investigative-violet/50 px-3.5 py-1.5 rounded-full transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showHints ? 'Hide Hints' : 'Hints'}</span>
            {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <p className="text-sm md:text-base text-investigative-text/90 leading-relaxed mb-4 max-w-5xl font-light">
        {activeCase.problem}
      </p>

      <div className="flex items-start space-x-3 bg-investigative-surface-raised/50 border border-investigative-border/50 px-4 py-3 rounded-2xl text-xs md:text-sm text-investigative-text">
        <Target className="w-4 h-4 text-investigative-violet mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-semibold text-investigative-text mr-1.5">Objective:</span>
          <span className="text-investigative-text-muted">{activeCase.objective}</span>
        </div>
      </div>

      {showSteps && (
        <div className="mt-3 flex items-start justify-between gap-3 bg-investigative-surface-raised/30 border border-investigative-border/50 px-4 py-3 rounded-2xl text-xs text-investigative-text-muted">
          <ol className="flex flex-wrap gap-x-4 gap-y-1.5">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-investigative-violet-subtle border border-investigative-violet/30 text-investigative-violet text-[10px] font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <button onClick={() => setShowSteps(false)} className="text-[11px] hover:text-investigative-text shrink-0">
            Hide
          </button>
        </div>
      )}

      {showHints && (
        <div className="mt-3.5 bg-violet-500/10 border border-violet-500/20 p-4 rounded-2xl text-xs md:text-sm space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-violet-400">
            <AlertCircle className="w-4 h-4" />
            <span>Hints:</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-investigative-text-muted pl-1">
            {activeCase.hints.map((hint, i) => (
              <li key={i} className="leading-relaxed">
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
