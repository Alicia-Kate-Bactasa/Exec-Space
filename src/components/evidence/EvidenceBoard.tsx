import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { BookmarkCheck, Trash2, ArrowRight, Terminal, FileText, Plus } from 'lucide-react';

export const EvidenceBoard: React.FC = () => {
  const { evidenceList, removeEvidence, setActiveView, activeCase } = useCaseStore();

  const caseEvidence = evidenceList.filter((e) => e.caseId === activeCase.id);

  return (
    <div className="h-full flex flex-col p-6 bg-investigative-bg overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-investigative-border/50 mb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <BookmarkCheck className="w-5 h-5 text-investigative-violet" />
            <h1 className="text-xl font-bold text-investigative-text">
              Evidence
            </h1>
            <span className="text-xs font-mono bg-investigative-surface-raised/70 border border-investigative-border/60 px-2.5 py-0.5 rounded-lg text-investigative-text-muted">
              {caseEvidence.length} items pinned for {activeCase.code}
            </span>
          </div>
          <p className="text-sm text-investigative-text-muted">
            Saved database queries, aggregated records, and notes to substantiate your finding.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveView('workspace')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm border border-investigative-border/70 text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Investigate</span>
          </button>
          <button
            onClick={() => setActiveView('finding')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors shadow-xs"
          >
            <span>Proceed to Finding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      {caseEvidence.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-dashed border-investigative-border/60 rounded-2xl bg-investigative-surface/30">
          <BookmarkCheck className="w-12 h-12 text-investigative-border-muted/50 mb-3" />
          <h2 className="text-base font-semibold text-investigative-text mb-1.5">No Evidence Saved Yet</h2>
          <p className="text-sm text-investigative-text-muted max-w-md mb-5 leading-relaxed">
            Run queries in the investigation workspace, inspect anomalies, and click <span className="font-semibold text-investigative-text">"Save Evidence"</span> to pin findings here.
          </p>
          <button
            onClick={() => setActiveView('workspace')}
            className="px-4 py-2 rounded-xl text-sm bg-investigative-surface-raised border border-investigative-border/70 text-investigative-text hover:border-investigative-violet transition-colors font-medium"
          >
            Open Investigation Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseEvidence.map((item) => (
            <div
              key={item.id}
              className="bg-investigative-surface border border-investigative-border/60 rounded-2xl p-5 flex flex-col justify-between hover:border-investigative-border transition-colors shadow-xs"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="text-sm font-bold text-investigative-text leading-snug">
                    {item.title}
                  </h2>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this evidence item?')) {
                        removeEvidence(item.id);
                      }
                    }}
                    className="text-investigative-text-muted hover:text-violet-400 p-1.5 rounded-lg transition-colors"
                    title="Delete evidence"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Note */}
                {item.note && (
                  <div className="text-sm text-investigative-text/90 bg-investigative-surface-raised/40 border border-investigative-border/40 p-3 rounded-xl mb-3 leading-relaxed">
                    <p className="text-xs uppercase font-mono text-investigative-text-muted mb-1 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-investigative-violet" />
                      <span>Note:</span>
                    </p>
                    {item.note}
                  </div>
                )}

                {/* SQL Code Snippet */}
                <div className="bg-investigative-surface-raised/50 border border-investigative-border/50 rounded-xl p-3 mb-3 font-mono text-xs overflow-x-auto text-investigative-text">
                  <div className="flex items-center space-x-1.5 text-xs text-investigative-text-muted mb-1.5">
                    <Terminal className="w-3.5 h-3.5 text-investigative-violet" />
                    <span>SQL Query</span>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap leading-relaxed text-investigative-text/90 font-mono">
                    {item.query}
                  </pre>
                </div>

                {/* Data Preview Table */}
                <div className="border border-investigative-border/50 rounded-xl overflow-hidden mb-3">
                  <div className="bg-investigative-surface-raised/60 px-3 py-1.5 text-xs font-mono text-investigative-text-muted flex justify-between border-b border-investigative-border/40">
                    <span>Result Preview</span>
                    <span>{item.resultPreview.totalRows} rows captured</span>
                  </div>
                  <div className="overflow-x-auto max-h-36">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead className="bg-investigative-surface text-investigative-text-muted border-b border-investigative-border/40">
                        <tr>
                          {item.resultPreview.columns.slice(0, 4).map((col) => (
                            <th key={col} className="p-2 font-semibold truncate">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-investigative-border/30 text-investigative-text">
                        {item.resultPreview.sampleRows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.slice(0, 4).map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 truncate max-w-[120px]">
                                {cell === null ? 'NULL' : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2.5 border-t border-investigative-border/40 flex items-center justify-between text-xs font-mono text-investigative-text-muted">
                <span>Pinned at {item.createdAt}</span>
                <span className="text-violet-400 font-medium">Evidence #{item.id.substring(3, 7)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
