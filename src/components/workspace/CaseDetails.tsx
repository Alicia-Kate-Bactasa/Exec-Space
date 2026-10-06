import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { HelpCircle, Target, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export const CaseDetails: React.FC = () => {
  const { activeCase } = useCaseStore();
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="bg-investigative-surface border-b border-investigative-border p-4 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold bg-investigative-red text-white px-2 py-0.5 rounded tracking-wide">
            {activeCase.code}
          </span>
          <span className="text-xs font-mono border border-investigative-border px-2 py-0.5 rounded text-investigative-text-muted">
            {activeCase.category}
          </span>
          <h1 className="text-base font-semibold text-investigative-text">
            {activeCase.title}
          </h1>
        </div>

        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center space-x-1.5 text-xs text-investigative-text-muted hover:text-investigative-red self-start md:self-auto border border-investigative-border px-2 py-1 rounded transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showHints ? 'Hide Hints' : 'Investigative Hints'}</span>
          {showHints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <p className="text-xs text-investigative-text leading-relaxed mb-2.5 max-w-4xl">
        {activeCase.problem}
      </p>

      <div className="flex items-start space-x-2 bg-investigative-surface-raised/50 border border-investigative-border/80 px-3 py-2 rounded text-xs text-investigative-text">
        <Target className="w-3.5 h-3.5 text-investigative-red mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-investigative-text mr-1.5">Objective:</span>
          <span className="text-investigative-text-muted">{activeCase.objective}</span>
        </div>
      </div>

      {showHints && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded text-xs space-y-1.5 animate-fadeIn">
          <div className="flex items-center space-x-1.5 font-semibold text-amber-500">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Detective Leads:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-investigative-text pl-1">
            {activeCase.hints.map((hint, idx) => (
              <li key={idx} className="text-investigative-text-muted leading-relaxed">
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
