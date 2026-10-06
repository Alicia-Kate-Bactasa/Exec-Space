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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-investigative-surface border border-investigative-border rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-investigative-border flex items-center justify-between bg-investigative-surface-raised/40">
          <div className="flex items-center space-x-2 text-sm font-semibold text-investigative-text">
            <BookmarkPlus className="w-4 h-4 text-investigative-red" />
            <span>Pin Evidence to Board</span>
          </div>
          <button
            onClick={onClose}
            className="text-investigative-text-muted hover:text-investigative-text p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-investigative-text font-medium mb-1">
              Evidence Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ₱1.5M in failed orders counted in gross revenue"
              className="w-full bg-investigative-surface-raised border border-investigative-border rounded px-3 py-2 text-investigative-text placeholder:text-investigative-text-muted/60 focus:outline-none focus:border-investigative-red font-mono"
            />
          </div>

          <div>
            <label className="block text-investigative-text font-medium mb-1">
              Investigative Note:
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain why this query or dataset is critical proof..."
              className="w-full bg-investigative-surface-raised border border-investigative-border rounded px-3 py-2 text-investigative-text placeholder:text-investigative-text-muted/60 focus:outline-none focus:border-investigative-red resize-none font-mono"
            />
          </div>

          {/* Snapshot Summary */}
          <div className="p-2.5 rounded bg-investigative-surface-raised/60 border border-investigative-border/70 space-y-1 font-mono text-[11px]">
            <div className="text-investigative-text-muted flex justify-between">
              <span>Rows Captured:</span>
              <span className="text-investigative-text font-bold">{currentResult.rowCount} rows</span>
            </div>
            <div className="text-investigative-text-muted truncate">
              <span>Query: </span>
              <span className="text-investigative-text">{currentSql.replace(/\s+/g, ' ').substring(0, 70)}...</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-investigative-border text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-investigative-red text-white hover:bg-investigative-red-hover transition-colors font-medium disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Evidence</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
