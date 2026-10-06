import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { HelpCircle, Target, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export const CaseDetails: React.FC = () => {
  const { activeCase } = useCaseStore();
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="bg-investigative-surface/60 border-b border-investigative-border/50 p-5 md:p-6 select-none shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center space-x-3">
          <span className="text-xs md:text-sm font-mono font-bold bg-investigative-violet text-white px-3 py-1 rounded-xl tracking-wide shadow-xs">
            {activeCase.code}
          </span>
          <span className="text-xs md:text-sm font-mono border border-investigative-border/70 px-3 py-1 rounded-xl text-investigative-text-muted">
            {activeCase.category}
          </span>
          <h1 className="text-lg md:text-xl font-bold text-investigative-text tracking-tight">
            {activeCase.title}
          </h1>
        </div>

        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center space-x-2 text-xs md:text-sm text-investigative-text-muted hover:text-investigative-violet self-start md:self-auto border border-investigative-border/70 hover:border-investigative-violet/50 px-3 py-1.5 rounded-xl transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showHints ? 'Hide Hints' : 'Investigative Hints'}</span>
          {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Bigger text and comfortable line height for students */}
      <p className="text-sm md:text-base text-investigative-text/90 leading-relaxed mb-4 max-w-5xl">
        {activeCase.problem}
      </p>

      <div className="flex items-start space-x-3 bg-investigative-surface-raised/50 border border-investigative-border/50 px-4 py-3 rounded-xl text-xs md:text-sm text-investigative-text shadow-2xs">
        <Target className="w-4 h-4 text-investigative-violet mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-semibold text-investigative-text mr-1.5">Objective:</span>
          <span className="text-investigative-text-muted">{activeCase.objective}</span>
        </div>
      </div>

      {showHints && (
        <div className="mt-3.5 bg-violet-500/10 border border-violet-500/20 p-4 rounded-xl text-xs md:text-sm space-y-2 animate-fadeIn">
          <div className="flex items-center space-x-2 font-semibold text-violet-300">
            <AlertCircle className="w-4 h-4" />
            <span>Detective Leads:</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-investigative-text-muted pl-1">
            {activeCase.hints.map((hint, idx) => (
              <li key={idx} className="leading-relaxed">
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
