import React, { useMemo } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Edit3, Check, Folder, ArrowRight, Clock } from 'lucide-react';

export const InvestigationNotes: React.FC = () => {
  const { notes, setNotes, activeCase, notesList, setActiveView } = useCaseStore();
  const currentNote = notes[activeCase.id] || '';

  const matchedNote = useMemo(() => {
    return notesList.find((n) => n.caseId === activeCase.id);
  }, [notesList, activeCase.id]);

  const wordCount = currentNote.trim() ? currentNote.trim().split(/\s+/).length : 0;
  const charCount = currentNote.length;

  return (
    <div className="h-full flex flex-col p-4 bg-investigative-surface/60 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-investigative-border/50 mb-3 text-sm shrink-0">
        <div className="flex items-center space-x-2 text-investigative-text">
          <Edit3 className="w-4 h-4 text-investigative-violet" />
          <span className="font-semibold">Notes</span>
          <span className="text-investigative-text-muted">({activeCase.code})</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('notes')}
            className="flex items-center space-x-1 text-xs text-investigative-violet hover:underline cursor-pointer"
          >
            <span>All Notes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Auto-saved</span>
          </div>
        </div>
      </div>

      {/* Editor Textarea */}
      <textarea
        value={currentNote}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Keep track of your hypotheses, suspicious order IDs, arithmetic notes, and patterns here as you investigate..."
        className="flex-1 w-full bg-investigative-surface-raised/40 border border-investigative-border/60 rounded-xl p-4 text-sm text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet resize-none font-mono leading-relaxed"
      />

      {/* Note Metadata Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-investigative-text-muted mt-2 pt-2 border-t border-investigative-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-investigative-surface-raised px-2 py-0.5 rounded-full border border-investigative-border/50">
            <Folder className="w-3 h-3 text-investigative-violet" />
            <span>{matchedNote?.folder || 'Case Notes'}</span>
          </span>
          {matchedNote?.updatedAt && (
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-investigative-violet" />
              <span>{new Date(matchedNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </span>
          )}
        </div>

        <div>
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span className="mx-1">·</span>
          <span>{charCount} chars</span>
        </div>
      </div>
    </div>
  );
};
