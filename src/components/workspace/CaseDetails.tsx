import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import {
  HelpCircle,
  Target,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  FileText,
  BookmarkCheck,
  Check,
} from 'lucide-react';

export const CaseDetails: React.FC = () => {
  const {
    activeCase,
    cases,
    selectCase,
    setActiveView,
    findings,
    evidenceList,
    setWorkspaceTab,
  } = useCaseStore();

  const [showHints, setShowHints] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const idx = cases.findIndex((c) => c.id === activeCase.id);
  const prev = idx > 0 ? cases[idx - 1] : null;
  const next = idx >= 0 && idx < cases.length - 1 ? cases[idx + 1] : null;

  const isSolved = findings[activeCase.id]?.verdict?.status === 'VERIFIED';
  const caseEvidence = evidenceList.filter((e) => e.caseId === activeCase.id);

  const go = (id: string) => {
    selectCase(id);
    setActiveView('workspace');
  };

  const expectedText =
    activeCase.solution?.expectedDiscrepancyText ||
    (activeCase.expectedDiscrepancy
      ? `Discrepancy: ${activeCase.expectedDiscrepancy.toLocaleString()}`
      : 'Locate the exact anomaly and quantify the variance');

  return (
    <div className="bg-investigative-surface/60 border-b border-investigative-border/50 p-4 md:p-5 select-none shrink-0 space-y-3.5">
      {/* Top Header: Metadata, Title, and Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 flex-wrap">
          <span className="text-xs font-mono font-bold bg-investigative-violet text-white px-3 py-1 rounded-full tracking-wide">
            {activeCase.code}
          </span>
          <span className="text-xs font-mono border border-investigative-border/70 px-2.5 py-0.5 rounded-full text-investigative-text-muted">
            {activeCase.category}
          </span>
          <span className="text-xs font-mono border border-investigative-border/70 px-2.5 py-0.5 rounded-full text-investigative-text-muted">
            {activeCase.difficulty}
          </span>
          {isSolved && (
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </span>
          )}
          <h1 className="text-base md:text-lg font-bold text-investigative-text tracking-tight">
            {activeCase.title}
          </h1>
        </div>

        {/* Set Prev/Next Navigation & Hints Button */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => prev && go(prev.id)}
            disabled={!prev}
            className="flex items-center space-x-1 text-xs text-investigative-text-muted hover:text-investigative-text border border-investigative-border/70 px-3 py-1.5 rounded-full transition-colors disabled:opacity-30 cursor-pointer"
            title={prev ? `Previous: ${prev.title}` : 'First set'}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <span className="text-xs font-mono text-investigative-text-muted">
            {idx + 1} / {cases.length}
          </span>
          <button
            onClick={() => next && go(next.id)}
            disabled={!next}
            className="flex items-center space-x-1 text-xs text-investigative-text-muted hover:text-investigative-text border border-investigative-border/70 px-3 py-1.5 rounded-full transition-colors disabled:opacity-30 cursor-pointer"
            title={next ? `Next: ${next.title}` : 'Last set'}
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center space-x-1.5 text-xs text-investigative-text-muted hover:text-investigative-violet border border-investigative-border/70 hover:border-investigative-violet/50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHints ? 'Hide Hints' : 'Hints'}</span>
            {showHints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Problem Narrative */}
      <p className="text-xs md:text-sm text-investigative-text/90 leading-relaxed font-light">
        {activeCase.problem}
      </p>

      {/* Objective & Expected Outputs Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-investigative-surface-raised/40 border border-investigative-border/60 p-3.5 rounded-2xl text-xs">
        <div className="flex items-start space-x-2.5">
          <Target className="w-4 h-4 text-investigative-violet mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-investigative-text block mb-0.5">Objective:</span>
            <p className="text-investigative-text-muted leading-relaxed">{activeCase.objective}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 border-t md:border-t-0 md:border-l border-investigative-border/50 pt-2.5 md:pt-0 md:pl-3.5">
          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-investigative-text block mb-0.5">Expected Output / Target Criteria:</span>
            <p className="text-investigative-text-muted leading-relaxed font-mono text-[11px]">{expectedText}</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-investigative-text-muted">
              <Database className="w-3 h-3 text-investigative-violet shrink-0" />
              <span>Tables: {activeCase.tables.map((t) => t.name).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Detailed Walkthrough */}
      {showSteps && (
        <div className="bg-investigative-surface-raised/30 border border-investigative-border/50 p-3.5 rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between text-investigative-text">
            <span className="font-semibold text-xs tracking-wide">
              Step-by-Step Guide:
            </span>
            <button
              onClick={() => setShowSteps(false)}
              className="text-[11px] text-investigative-text-muted hover:text-investigative-text cursor-pointer"
            >
              Hide Guide
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-investigative-surface/80 border border-investigative-border/40 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-investigative-text">
                <span className="w-4 h-4 rounded-full bg-investigative-violet-subtle text-investigative-violet text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Inspect Tables</span>
              </div>
              <p className="text-[11px] text-investigative-text-muted font-light leading-relaxed">
                Click table names in the left sidebar and run sample queries to see available columns.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-investigative-surface/80 border border-investigative-border/40 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-investigative-text">
                <span className="w-4 h-4 rounded-full bg-investigative-violet-subtle text-investigative-violet text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Run Starter SQL</span>
              </div>
              <p className="text-[11px] text-investigative-text-muted font-light leading-relaxed">
                Execute the starter query below and modify clauses (WHERE, JOIN) to locate the anomaly.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-investigative-surface/80 border border-investigative-border/40 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-investigative-text">
                <span className="w-4 h-4 rounded-full bg-investigative-violet-subtle text-investigative-violet text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Save Evidence</span>
              </div>
              <p className="text-[11px] text-investigative-text-muted font-light leading-relaxed">
                Click "Save Evidence" in the Results header to pin query proof for this problem.
              </p>
              <button
                onClick={() => setWorkspaceTab('evidence')}
                className="text-[11px] text-investigative-violet hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
              >
                <BookmarkCheck className="w-3 h-3" />
                <span>View Pinned ({caseEvidence.length})</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-investigative-surface/80 border border-investigative-border/40 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-investigative-text">
                <span className="w-4 h-4 rounded-full bg-investigative-violet-subtle text-investigative-violet text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Submit Finding</span>
              </div>
              <p className="text-[11px] text-investigative-text-muted font-light leading-relaxed">
                Switch to the Finding tab below, enter your numbers, and verify your conclusion!
              </p>
              <button
                onClick={() => setWorkspaceTab('finding')}
                className="text-[11px] text-investigative-violet hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>{isSolved ? 'Review Verdict' : 'Open Finding Tab'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hints Accordion */}
      {showHints && (
        <div className="bg-violet-500/10 border border-violet-500/20 p-3.5 rounded-2xl text-xs space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-violet-400">
            <AlertCircle className="w-4 h-4" />
            <span>Hints for {activeCase.code}:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-investigative-text-muted pl-1">
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
