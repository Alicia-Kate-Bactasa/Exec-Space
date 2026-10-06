import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Edit3, Check } from 'lucide-react';

export const InvestigationNotes: React.FC = () => {
  const { notes, setNotes, activeCase } = useCaseStore();
  const currentNote = notes[activeCase.id] || '';

  return (
    <div className="h-full flex flex-col p-4 bg-investigative-surface overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-investigative-border mb-3 text-xs shrink-0">
        <div className="flex items-center space-x-2 text-investigative-text">
          <Edit3 className="w-3.5 h-3.5 text-investigative-red" />
          <span className="font-semibold">Detective Scratchpad</span>
          <span className="text-investigative-text-muted">({activeCase.code})</span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-emerald-500 font-mono">
          <Check className="w-3 h-3" />
          <span>Auto-saved</span>
        </div>
      </div>

      <textarea
        value={currentNote}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Keep track of your hypotheses, suspicious order IDs, arithmetic notes, and patterns here as you investigate..."
        className="flex-1 w-full bg-investigative-surface-raised border border-investigative-border rounded p-3 text-xs text-investigative-text placeholder:text-investigative-text-muted/60 focus:outline-none focus:border-investigative-red resize-none font-mono leading-relaxed"
      />
    </div>
  );
};
