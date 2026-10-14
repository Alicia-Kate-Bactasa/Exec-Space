import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { BookmarkCheck, Trash2, ArrowRight, Terminal, Plus } from 'lucide-react';

interface WorkspaceEvidenceTabProps {
  onGoToResults: () => void;
  onGoToFinding: () => void;
}

export const WorkspaceEvidenceTab: React.FC<WorkspaceEvidenceTabProps> = ({
  onGoToResults,
  onGoToFinding,
}) => {
  const { evidenceList, removeEvidence, activeCase } = useCaseStore();
  const caseEvidence = evidenceList.filter((e) => e.caseId === activeCase.id);

  if (caseEvidence.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-investigative-surface/30">
        <div className="w-12 h-12 rounded-full bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center mb-3 text-investigative-violet">
          <BookmarkCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-investigative-text mb-1">
          No Evidence Saved Yet
        </h3>
        <p className="text-xs text-investigative-text-muted max-w-sm mb-4 leading-relaxed font-light">
          Run your SQL query above. When you find the numbers that prove the discrepancy, click <span className="font-semibold text-investigative-text">"Save Evidence"</span> in the Results header to pin it here.
        </p>
        <button
          onClick={onGoToResults}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-medium bg-investigative-surface-raised border border-investigative-border/70 hover:border-investigative-violet text-investigative-text transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Go to Query Results</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-investigative-border/50">
        <div className="flex items-center space-x-2">
          <BookmarkCheck className="w-4 h-4 text-investigative-violet" />
          <span className="text-sm font-semibold text-investigative-text">
            Pinned Evidence ({caseEvidence.length})
          </span>
          <span className="text-xs text-investigative-text-muted font-mono">
            for {activeCase.code}
          </span>
        </div>
        <button
          onClick={onGoToFinding}
          className="flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-medium bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors"
        >
          <span>Submit Finding</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {caseEvidence.map((item) => (
          <div
            key={item.id}
            className="bg-investigative-surface border border-investigative-border/60 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-investigative-border transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-sm text-investigative-text line-clamp-1">
                  {item.title}
                </h4>
                <button
                  onClick={() => removeEvidence(item.id)}
                  className="text-investigative-text-muted hover:text-rose-400 p-1 rounded-md transition-colors"
                  title="Remove this evidence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {item.note && (
                <p className="text-xs text-investigative-text-muted font-light mb-2.5 line-clamp-2">
                  {item.note}
                </p>
              )}

              {/* SQL Query Snippet */}
              <div className="bg-investigative-surface-raised/60 border border-investigative-border/40 rounded-lg p-2 mb-2 font-mono text-[11px] text-investigative-text-muted flex items-start gap-1.5 overflow-x-auto">
                <Terminal className="w-3 h-3 text-investigative-violet shrink-0 mt-0.5" />
                <span className="truncate">{item.query}</span>
              </div>

              {/* Preview Rows */}
              {item.resultPreview?.columns && item.resultPreview.sampleRows?.length > 0 && (
                <div className="border border-investigative-border/40 rounded-lg overflow-x-auto text-[11px] font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-investigative-surface-raised/80 text-investigative-text-muted border-b border-investigative-border/40">
                      <tr>
                        {item.resultPreview.columns.slice(0, 3).map((col) => (
                          <th key={col} className="px-2 py-1 truncate">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-investigative-border/30">
                      {item.resultPreview.sampleRows.slice(0, 3).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.slice(0, 3).map((cell, cIdx) => (
                            <td key={cIdx} className="px-2 py-0.5 text-investigative-text truncate max-w-28">
                              {String(cell ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-investigative-border/40 flex items-center justify-between text-[11px] text-investigative-text-muted font-mono">
              <span>{item.resultPreview?.totalRows || 0} rows pinned</span>
              <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
