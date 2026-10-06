import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { X, BookmarkPlus, Check } from 'lucide-react';

interface SaveEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveEvidenceModal: React.FC<SaveEvidenceModalProps> = ({ isOpen, onClose }) => {
  const { currentResult, currentSql, activeCase, addEvidence } = useCaseStore();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen || !currentResult) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvidence({
      caseId: activeCase.id,
      title: title.trim(),
      note: note.trim(),
      query: currentSql,
      resultPreview: {
        columns: currentResult.columns,
        sampleRows: currentResult.rows.slice(0, 5),
        totalRows: currentResult.rowCount,
      },
    });

    setTitle('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-investigative-surface border border-investigative-border/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-investigative-border/50 flex items-center justify-between bg-investigative-surface-raised/30">
          <div className="flex items-center space-x-2 text-base font-semibold text-investigative-text">
            <BookmarkPlus className="w-4 h-4 text-investigative-violet" />
            <span>Save Evidence</span>
          </div>
          <button
            onClick={onClose}
            className="text-investigative-text-muted hover:text-investigative-text p-1.5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-investigative-text font-medium mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ₱1.5M in failed orders counted in gross revenue"
              className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-xl px-4 py-2.5 text-sm text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet"
            />
          </div>

          <div>
            <label className="block text-investigative-text font-medium mb-1.5">
              Notes
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain why this query or dataset is important..."
              className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-xl px-4 py-2.5 text-sm text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet resize-none leading-relaxed"
            />
          </div>

          {/* Snapshot Summary */}
          <div className="p-3.5 rounded-xl bg-investigative-surface-raised/40 border border-investigative-border/50 space-y-1.5 font-mono text-xs">
            <div className="text-investigative-text-muted flex justify-between">
              <span>Rows Captured:</span>
              <span className="text-investigative-text font-semibold">{currentResult.rowCount} rows</span>
            </div>
            <div className="text-investigative-text-muted truncate">
              <span>Query: </span>
              <span className="text-investigative-text">{currentSql.replace(/\s+/g, ' ').substring(0, 70)}...</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-investigative-border/70 text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors font-medium disabled:opacity-40 shadow-xs text-sm"
            >
              <Check className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
